#!/usr/bin/env node
/**
 * 기존 src/data/academies.json 시드를 보강해 강북구 학원 다양성을 늘림.
 * 실행: node scripts/expand-seed.mjs
 *
 * - 4개 동(수유동/미아동/번동/우이동)에 골고루 추가
 * - 중복 id 방지
 * - 기존 데이터를 보존하고 뒤에 append
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.resolve(__dirname, "../src/data/academies.json");

// 미아역 기준
const ORIGIN = { lat: 37.6266, lng: 127.0254 };

const SUBJECT_COLORS = ["영어", "수학", "국어", "과학", "예체능", "코딩"];

const DONGS = [
  { name: "수유동", lat: 37.6378, lng: 127.025, count: 5 },
  { name: "미아동", lat: 37.6248, lng: 127.029, count: 5 },
  { name: "번동", lat: 37.6298, lng: 127.043, count: 4 },
  { name: "우이동", lat: 37.6502, lng: 127.013, count: 4 },
];

const TEACHING_STYLE_BY_SUBJECT = {
  영어: ["소수 정예", "개별 맞춤"],
  수학: ["개별 맞춤", "그룹 수업"],
  국어: ["그룹 수업"],
  과학: ["소수 정예"],
  예체능: ["그룹 수업"],
  코딩: ["개별 맞춤"],
  사회: ["그룹 수업"],
};

const FEATURE_BY_SUBJECT = {
  영어: [
    ["회화 중심", "원어민"],
    ["내신 대비", "심화 수업"],
    ["파닉스 전문", "초등 입문"],
    ["수능 대비", "기출 분석"],
  ],
  수학: [
    ["사고력 수학", "초등 전문"],
    ["내신 대비", "심화 수업"],
    ["1:1 첨삭", "오답 노트"],
    ["수능 대비", "기출 분석"],
  ],
  국어: [
    ["독서 논술", "초등 전문"],
    ["내신 대비", "문학 분석"],
    ["수능 대비", "비문학"],
  ],
  과학: [
    ["실험 중심", "초등 전문"],
    ["내신 대비", "단원평가"],
    ["수능 과탐", "심화 수업"],
  ],
  예체능: [
    ["창의 미술", "포트폴리오"],
    ["1:1 레슨", "음악"],
    ["체육 전문"],
  ],
  코딩: [
    ["프로젝트 기반", "포트폴리오"],
  ],
  사회: [
    ["내신 대비", "한국사"],
  ],
};

const AGE_GROUP_PROFILES = [
  { groups: ["유아", "초등"], grade: "초등 1~3학년" },
  { groups: ["초등"], grade: "초등 전 학년" },
  { groups: ["초등", "중등"], grade: "초등 5~중등 2학년" },
  { groups: ["중등"], grade: "중등 전 학년" },
  { groups: ["중등", "고등"], grade: "중등 3~고등 2학년" },
  { groups: ["고등"], grade: "고등 전 학년" },
];

const HOMEWORK_LEVELS = ["적음", "보통", "많음"];
const DIFFICULTY = ["기초", "기초~심화", "심화"];

function jitter(base, range) {
  return +(base + (Math.random() * 2 - 1) * range).toFixed(4);
}
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function distanceKm(lat, lng) {
  const dLat = lat - ORIGIN.lat;
  const dLng = lng - ORIGIN.lng;
  const km = Math.sqrt(dLat * dLat + dLng * dLng) * 111; // 대략 (한국 위도)
  return +km.toFixed(1);
}

function makeAcademy(idx, dong) {
  const subject = rand(SUBJECT_COLORS);
  const ageProfile = rand(AGE_GROUP_PROFILES);
  const features = rand(FEATURE_BY_SUBJECT[subject]);
  const teachingStyle = TEACHING_STYLE_BY_SUBJECT[subject];
  const homework = rand(HOMEWORK_LEVELS);
  const difficulty = rand(DIFFICULTY);

  const lat = jitter(dong.lat, 0.005);
  const lng = jitter(dong.lng, 0.005);
  const distance = distanceKm(lat, lng);

  const price = 180000 + Math.floor(Math.random() * 18) * 10000; // 18~35만원
  const rating = +(3.8 + Math.random() * 1.0).toFixed(1);
  const reviewCount = 8 + Math.floor(Math.random() * 90);
  const compareCount = Math.floor(reviewCount * (0.3 + Math.random() * 0.5));

  const id = `seed-${idx}`;
  const koreanLetter = String.fromCharCode(0xac00 + ((idx * 17) % 0x100));
  const name = `${koreanLetter} ${subject}학원`;

  return {
    id,
    name,
    subject,
    age_groups: ageProfile.groups,
    region: "강북구",
    dong: dong.name,
    address: `서울 강북구 ${dong.name} ${100 + (idx % 400)}, ${1 + (idx % 6)}층`,
    lat,
    lng,
    rating,
    review_count: reviewCount,
    compare_count: compareCount,
    monthly_price: price,
    distance_km: distance,
    judgement: `${ageProfile.grade}을 위한 ${features[0]} 중심의 ${subject} 학원이에요.`,
    one_line_summary: `${features[0]}이/가 좋아요. 아이가 잘 따라가요.`,
    recommended_for: [
      `${features[0]}이/가 필요한 아이`,
      `${ageProfile.grade}`,
    ],
    image: `/img/${id}.jpg`,
    facility_images: [`/img/${id}.jpg`],
    facility_labels: ["강의실"],
    station: `${dong.name} 인근 도보 ${5 + Math.floor(Math.random() * 10)}분`,
    hours: { weekday: "14:00 ~ 21:00", weekend: "10:00 ~ 16:00" },
    class_days: rand([
      ["월", "수", "금"],
      ["화", "목"],
      ["월", "수"],
      ["화", "목", "토"],
    ]),
    consultation_hours: { weekday: "14:00 ~ 20:00", weekend: "10:00 ~ 15:00" },
    certified: Math.random() > 0.55,
    meta: {
      homework_level: homework,
      teaching_style: teachingStyle,
      difficulty,
      features,
      class_minutes: rand([60, 80, 90, 100, 120]),
      class_per_week: rand([1, 2, 3]),
      capacity: rand([6, 8, 10, 12, 14]),
      level_test: Math.random() > 0.5,
    },
    reasons: [
      `${features[0]} 중심 커리큘럼`,
      "주기적인 학습 리포트",
      "꼼꼼한 개별 관리",
    ],
    pros_keywords: [
      { label: `${features[0]}이 알차요`, count: 5 + Math.floor(Math.random() * 30) },
      { label: "선생님이 친절해요", count: 5 + Math.floor(Math.random() * 25) },
    ],
    cons_keywords:
      Math.random() > 0.4
        ? [{ label: "수업 강도가 있어요", count: 3 + Math.floor(Math.random() * 10) }]
        : [],
  };
}

function main() {
  const existing = JSON.parse(fs.readFileSync(TARGET, "utf-8"));
  const existingIds = new Set(existing.map((a) => a.id));

  const additions = [];
  let counter = 100;
  for (const dong of DONGS) {
    for (let i = 0; i < dong.count; i++) {
      while (existingIds.has(`seed-${counter}`)) counter++;
      const id = `seed-${counter}`;
      existingIds.add(id);
      additions.push(makeAcademy(counter, dong));
      counter++;
    }
  }

  const merged = [...existing, ...additions];
  fs.writeFileSync(TARGET, JSON.stringify(merged, null, 2));
  console.log(
    `✅ Seed expanded: ${existing.length} → ${merged.length} academies`,
  );
  console.log(`   Added across ${DONGS.length} dongs in 강북구.`);
}

main();
