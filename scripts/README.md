# scripts/

학원지도 데이터 파이프라인.

## 개요

`src/data/academies.json` 이 학원지도가 사용하는 단일 데이터 소스.
초기 시드는 `expand-seed.mjs` 로 생성되어 있고, 실제 운영 데이터는
`import-academies.mjs` 로 공공데이터를 받아 덮어쓴다.

```
시드 (큐레이션 30개)  ──── npm run seed   ────▶  src/data/academies.json
                                                       ▲
공공데이터 (실 학원)  ──── npm run import:academies ───┘
```

---

## 환경 변수

`.env.local` (Git 무시):

```bash
# 서울 열린데이터 광장 인증키
# https://data.seoul.go.kr → 우상단 "인증키 신청"
SEOUL_OPENAPI_KEY=발급받은_키

# 카카오 개발자센터의 "REST API 키"
# (지도용 JavaScript 키와 다름!)
# https://developers.kakao.com → 내 애플리케이션 → 앱 키
KAKAO_REST_KEY=발급받은_키

# (지도 표시용, 별개)
NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은_JS_키
```

---

## 명령어

### `node scripts/expand-seed.mjs`
큐레이션 시드 12개 → 30개로 확장. 시연·개발 환경에서 지도가 비어 보이지 않게.
이미 30개 이상이면 더 추가하지 않음.

### `node scripts/import-academies.mjs`
운영 데이터 수집 파이프라인.

1. **서울 열린데이터** (`neisAcademyInfo`) 호출 → 강북구 학원 메타 추출
2. **카카오 로컬 API** 로 도로명 주소 → 위도/경도 변환
3. `src/data/academies.json` 으로 저장 (덮어씀)
4. `src/data/academies.import-meta.json` 에 수집 메타 기록 (총개수·실패목록·소스)

후기/평점/가격은 공공데이터에 없으므로 모두 0 또는 기본값.
추후 학원 자체 입력 폼이나 사용자 후기로 보강 예정.

---

## 데이터 모델

`Academy` 타입 (`src/lib/types.ts`)을 그대로 따른다.
Import 스크립트가 채우지 못하는 필드(후기·시설사진·강사진·운영시간 등)는
빈 값으로 두며 학원 상세 페이지에서 placeholder로 처리됨.

---

## 데이터 소스

| 출처 | 용도 | 갱신 주기 |
|---|---|---|
| 서울 열린데이터 - 학원 교습소 정보 | 학원 메타 (이름·주소·과목·전화) | 월 1회 |
| 카카오 로컬 API | 좌표 변환 | 호출 시 |
| (Phase 2) 사용자 후기 / 학원 자체 입력 | 평점·가격·시설·강사 | 실시간 |

---

## 트러블슈팅

- **"Seoul API 401"** — `SEOUL_OPENAPI_KEY` 가 잘못됐거나 신청 직후라 미반영. 1시간 후 재시도.
- **"Kakao REST key invalid"** — JS 키와 REST 키를 혼동했을 가능성. 카카오 개발자센터에서 REST 키 별도 확인.
- **빈 결과** — 공공데이터의 `ADMST_ZONE_NM` 필드 변경에 영향. 스크립트 내 필터 키워드 "강북" 부분을 조정.
- **좌표 변환 실패가 많음** — 도로명 주소가 아닌 지번 주소 항목들. `geocode()` 호출 전 형식을 정규화하거나 결과 없는 건 건너뜀.
