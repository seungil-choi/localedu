#!/usr/bin/env node
/**
 * 서울 4개 자치구(강북·노원·도봉·성북) 학원 공공데이터 import 파이프라인
 *
 * 데이터 소스:
 *   1. 서울 열린데이터 광장 - neisAcademyInfo
 *   2. VWorld Geocoder API (좌표 변환)
 *   3. Kakao REST API (fallback)
 *
 * 환경변수 (.env.local):
 *   SEOUL_OPENAPI_KEY  - 필수
 *   VWORLD_KEY         - 권장 (좌표 변환)
 *   KAKAO_REST_KEY     - 옵션 (VWorld 실패 시 fallback)
 *
 * 실행:
 *   node scripts/import-academies.mjs                       # 4개 구 모두
 *   node scripts/import-academies.mjs --regions 강북구,노원구
 *   node scripts/import-academies.mjs --max 50 --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, "..");
const TARGET = path.join(PROJECT, "src/data/academies.json");
const META = path.join(PROJECT, "src/data/academies.import-meta.json");

// 자치구별 기준점 (대표 지하철역) + ID prefix
const REGIONS = {
  강북구: { center: { lat: 37.6266, lng: 127.0254 }, id: "gangbuk", landmark: "미아역" },
  노원구: { center: { lat: 37.6543, lng: 127.0608 }, id: "nowon", landmark: "노원역" },
  도봉구: { center: { lat: 37.6533, lng: 127.0476 }, id: "dobong", landmark: "창동역" },
  성북구: { center: { lat: 37.5928, lng: 127.0166 }, id: "seongbuk", landmark: "성신여대입구역" },
};

const SUBJECT_KEYWORDS = {
  영어: ["영어", "English", "어학"],
  수학: ["수학", "산수"],
  국어: ["국어", "독서", "논술", "글쓰기", "문학"],
  과학: ["과학", "화학", "물리", "생물"],
  사회: ["사회", "역사", "한국사"],
  예체능: ["미술", "음악", "피아노", "체육", "무용", "발레", "태권도", "검도", "예체능", "댄스"],
  코딩: ["코딩", "프로그래밍", "컴퓨터", "AI", "로봇", "정보처리"],
};

const DEFAULT_FEATURES = {
  영어: ["커리큘럼 정규반"],
  수학: ["내신 대비"],
  국어: ["독서 논술"],
  과학: ["탐구 위주"],
  사회: ["내신 대비"],
  예체능: ["기초 입문"],
  코딩: ["프로젝트 기반"],
};

// 자치구별 법정동 화이트리스트 (동 추출용)
const REGION_DONGS = {
  강북구: ["수유동", "미아동", "번동", "우이동", "송중동", "삼양동", "송천동", "삼각산동", "인수동"],
  노원구: ["월계동", "공릉동", "하계동", "중계동", "상계동", "노원역"],
  도봉구: ["쌍문동", "방학동", "창동", "도봉동"],
  성북구: ["성북동", "삼선동", "동선동", "돈암동", "안암동", "보문동", "정릉동", "길음동", "월곡동", "장위동", "석관동"],
};

/* ──────── env ──────── */

function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const f of envFiles) {
    const p = path.join(PROJECT, f);
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, "utf-8").split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
      }
    }
  }
}

/* ──────── args ──────── */

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = {
    regions: ["강북구", "노원구", "도봉구", "성북구"],
    max: Infinity,
    dryRun: false,
    concurrency: 6,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--regions") args.regions = argv[++i].split(",").map((s) => s.trim());
    else if (argv[i] === "--max") args.max = Number(argv[++i]);
    else if (argv[i] === "--concurrency") args.concurrency = Number(argv[++i]);
    else if (argv[i] === "--dry-run") args.dryRun = true;
  }
  return args;
}

/* ──────── Seoul OpenAPI ──────── */

async function fetchAcademyPage(key, start, end) {
  const url = `http://openapi.seoul.go.kr:8088/${encodeURIComponent(key)}/json/neisAcademyInfo/${start}/${end}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Seoul API ${res.status}`);
  const data = await res.json();
  const root = data.neisAcademyInfo;
  if (!root) throw new Error("Unexpected response: " + JSON.stringify(data).slice(0, 200));
  if (root.RESULT?.CODE && root.RESULT.CODE !== "INFO-000") {
    throw new Error(`Seoul API: ${root.RESULT.CODE} ${root.RESULT.MESSAGE}`);
  }
  return {
    total: Number(root.list_total_count ?? 0),
    rows: Array.isArray(root.row) ? root.row : [],
  };
}

/** 한 번 다운로드해서 region별로 분배 — 트래픽 절약 */
async function fetchAllByRegions(key, regions) {
  const targetSet = new Set(regions);
  const buckets = Object.fromEntries(regions.map((r) => [r, []]));
  const PAGE = 1000;
  let start = 1;
  let total = Infinity;
  while (start <= total) {
    const { total: t, rows } = await fetchAcademyPage(key, start, start + PAGE - 1);
    total = t;
    for (const r of rows) {
      if (
        targetSet.has(r.ADMDST_NM) &&
        r.REG_STTS_NM === "개원" &&
        r.PEI_TRNG_NM === "학원"
      ) {
        buckets[r.ADMDST_NM].push(r);
      }
    }
    process.stdout.write(
      `\r   페이지 ${start}-${start + PAGE - 1} 처리 (전체 ${total}건, ` +
        regions.map((r) => `${r}:${buckets[r].length}`).join(" ") +
        ")",
    );
    start += PAGE;
    await sleep(120);
  }
  process.stdout.write("\n");
  return buckets;
}

/* ──────── Geocoding ──────── */

async function geocodeVWorld(address, key) {
  const params = new URLSearchParams({
    service: "address",
    request: "getCoord",
    version: "2.0",
    crs: "epsg:4326",
    address,
    refine: "true",
    simple: "false",
    format: "json",
    type: "ROAD",
    key,
  });
  const res = await fetch(`https://api.vworld.kr/req/address?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.response?.status !== "OK") {
    params.set("type", "PARCEL");
    const res2 = await fetch(`https://api.vworld.kr/req/address?${params}`);
    if (!res2.ok) return null;
    const data2 = await res2.json();
    if (data2.response?.status !== "OK") return null;
    const p = data2.response.result.point;
    return { lat: parseFloat(p.y), lng: parseFloat(p.x), source: "vworld:parcel" };
  }
  const p = data.response.result.point;
  return { lat: parseFloat(p.y), lng: parseFloat(p.x), source: "vworld:road" };
}

async function geocodeKakao(address, key) {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } });
  if (!res.ok) return null;
  const data = await res.json();
  const doc = data.documents?.[0];
  if (!doc) return null;
  return { lat: parseFloat(doc.y), lng: parseFloat(doc.x), source: "kakao" };
}

async function geocode(address, { vworldKey, kakaoKey }) {
  if (vworldKey) {
    try {
      const r = await geocodeVWorld(address, vworldKey);
      if (r) return r;
    } catch {
      /* pass */
    }
  }
  if (kakaoKey) {
    try {
      return await geocodeKakao(address, kakaoKey);
    } catch {
      /* pass */
    }
  }
  return null;
}

/* ──────── Normalization ──────── */

function detectSubject(name, fldNm, courseList) {
  const text = `${name ?? ""} ${fldNm ?? ""} ${courseList ?? ""}`;
  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return subject;
  }
  if (fldNm?.includes("외국어")) return "영어";
  if (fldNm?.includes("입시")) return "수학";
  if (fldNm?.includes("종합")) return "수학";
  if (fldNm?.includes("기예") || fldNm?.includes("예능")) return "예체능";
  if (fldNm?.includes("컴퓨터")) return "코딩";
  return "사회";
}

function detectAgeGroups(courseList, fldNm) {
  const text = `${courseList ?? ""} ${fldNm ?? ""}`;
  const groups = new Set();
  if (/유아|어린이/.test(text)) groups.add("유아");
  if (/초등|초/.test(text)) groups.add("초등");
  if (/중등|중학/.test(text)) groups.add("중등");
  if (/고등|고교|수능/.test(text)) groups.add("고등");
  if (groups.size === 0) groups.add("초등");
  return [...groups];
}

function distanceKm(lat, lng, origin) {
  const dLat = lat - origin.lat;
  const dLng = lng - origin.lng;
  return +(Math.sqrt(dLat * dLat + dLng * dLng) * 111).toFixed(1);
}

function dongFromAddress(address, region) {
  const text = String(address);
  const dongs = REGION_DONGS[region] || [];
  // 1) 괄호 안 행정동 우선
  const paren = text.match(/\(([^)]*)\)/g) || [];
  for (const p of paren) {
    for (const d of dongs) if (p.includes(d)) return d;
  }
  // 2) 본문에 직접 등장
  for (const d of dongs) if (text.includes(d)) return d;
  return region;
}

function toAcademy(row, coord, region, regionInfo) {
  const name = row.PEI_NM || `학원-${row.PEI_DSGN_NO}`;
  const fldNm = row.FLD_NM;
  const courseList = row.TRNG_CRS_LIST_NM;
  const address = [row.ROAD_NM_ADDR, row.DADDR].filter(Boolean).join(" ").trim();
  const subject = detectSubject(name, fldNm, courseList);
  const age_groups = detectAgeGroups(courseList, fldNm);
  const capacity = Number(row.PSCP_SUM) || 10;
  const features = courseList
    ? courseList.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : DEFAULT_FEATURES[subject] ?? [];

  return {
    id: `${regionInfo.id}-${row.PEI_DSGN_NO}`,
    name,
    subject,
    age_groups,
    region,
    dong: dongFromAddress(address, region),
    address,
    lat: coord.lat,
    lng: coord.lng,
    rating: 0,
    review_count: 0,
    compare_count: 0,
    monthly_price: 0,
    distance_km: distanceKm(coord.lat, coord.lng, regionInfo.center),
    judgement: `${fldNm || subject} 분야의 학원이에요.`,
    one_line_summary: "",
    recommended_for: age_groups.map((g) => `${g} 자녀를 둔 학부모`),
    image: "",
    facility_images: [],
    facility_labels: [],
    station: "",
    hours: { weekday: "", weekend: "" },
    class_days: [],
    consultation_hours: { weekday: "", weekend: "" },
    certified: true,
    meta: {
      homework_level: "보통",
      teaching_style: ["그룹 수업"],
      difficulty: "기초~심화",
      features,
      class_minutes: 60,
      class_per_week: 2,
      capacity,
      level_test: false,
    },
    reasons: [],
    pros_keywords: [],
    cons_keywords: [],
    _meta: {
      source: "seoul-openapi:neisAcademyInfo",
      designation_no: row.PEI_DSGN_NO,
      field: fldNm,
    },
  };
}

/* ──────── 동시 처리 (병렬 geocoding) ──────── */

async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  async function run() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
      done++;
      if (done % 25 === 0 || done === items.length) {
        process.stdout.write(`\r   좌표 변환 ${done} / ${items.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run));
  process.stdout.write("\n");
  return results;
}

/* ──────── Main ──────── */

async function main() {
  loadEnv();
  const args = parseArgs();
  const seoulKey = process.env.SEOUL_OPENAPI_KEY;
  const vworldKey = process.env.VWORLD_KEY;
  const kakaoKey = process.env.KAKAO_REST_KEY;

  if (!seoulKey) {
    console.error("✗ SEOUL_OPENAPI_KEY 가 설정되지 않았어요. .env.local 확인.");
    process.exit(1);
  }

  console.log(`📡 서울 열린데이터에서 ${args.regions.join(", ")} 학원을 수집합니다…`);
  const buckets = await fetchAllByRegions(seoulKey, args.regions);
  for (const r of args.regions) {
    console.log(`   ${r}: ${buckets[r].length}건`);
  }

  if (!vworldKey && !kakaoKey) {
    console.warn("⚠  Geocoder 키가 없어 좌표 변환 불가. 학원 메타만 추출.");
  } else {
    console.log(`   Geocoder: ${vworldKey ? "VWorld" : ""}${vworldKey && kakaoKey ? " + " : ""}${kakaoKey ? "Kakao(fallback)" : ""}`);
    console.log(`   Concurrency: ${args.concurrency}`);
  }

  if (args.dryRun) {
    console.log("DRY-RUN: 저장 안 함. 각 region 첫 2건 미리보기:");
    for (const r of args.regions) {
      console.log(`  [${r}]`);
      buckets[r].slice(0, 2).forEach((row) => {
        console.log(`    - ${row.PEI_NM} (${row.FLD_NM}) @ ${row.ROAD_NM_ADDR}`);
      });
    }
    return;
  }

  // 4개 region 모두 병합 후 좌표 변환 (병렬)
  const allRows = [];
  for (const r of args.regions) {
    for (const row of buckets[r]) {
      allRows.push({ row, region: r });
    }
  }
  const target = allRows.slice(0, args.max);
  if (target.length < allRows.length) {
    console.log(`   --max ${args.max} 적용 → ${target.length}건만 처리`);
  }

  const errors = [];
  const academies = [];
  await mapWithConcurrency(target, args.concurrency, async ({ row, region }) => {
    const address = row.ROAD_NM_ADDR;
    if (!address) {
      errors.push({ name: row.PEI_NM, reason: "no address" });
      return;
    }
    try {
      let coord = await geocode(address, { vworldKey, kakaoKey });
      if (!coord) {
        coord = { ...REGIONS[region].center, source: "fallback:origin" };
        errors.push({ name: row.PEI_NM, region, reason: "geocode fallback to origin" });
      }
      academies.push(toAcademy(row, coord, region, REGIONS[region]));
    } catch (e) {
      errors.push({ name: row.PEI_NM, region, reason: e.message });
    }
  });
  console.log(`   변환 성공: ${academies.length} / 부분 실패: ${errors.length}`);

  fs.writeFileSync(TARGET, JSON.stringify(academies, null, 2));
  fs.writeFileSync(
    META,
    JSON.stringify(
      {
        importedAt: new Date().toISOString(),
        regions: args.regions,
        total: academies.length,
        byRegion: Object.fromEntries(
          args.regions.map((r) => [r, academies.filter((a) => a.region === r).length]),
        ),
        sourceRows: allRows.length,
        kakaoUsed: Boolean(kakaoKey),
        vworldUsed: Boolean(vworldKey),
        errorCount: errors.length,
        errors: errors.slice(0, 100),
        sources: [
          "https://data.seoul.go.kr (neisAcademyInfo)",
          "https://api.vworld.kr (Geocoder API)",
        ],
      },
      null,
      2,
    ),
  );
  console.log(`✅ ${TARGET} (${academies.length}개)`);
  console.log(`   메타: ${META}`);
}

main().catch((e) => {
  console.error("\n✗ Import 실패:", e);
  process.exit(1);
});
