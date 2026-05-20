export interface ChildProfile {
  grade: string; // "초등 2학년"
  birthYear: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  region: string;
  child: ChildProfile;
  interestedSubjects: string[];
  membership: "일반 회원" | "프리미엄";
  initial: string; // 아바타 이니셜
}

export const MOCK_USER: UserProfile = {
  name: "김지혜",
  email: "jihye.kim@example.com",
  phone: "010-1234-5678",
  region: "서울 강북구",
  child: { grade: "초등 2학년", birthYear: 2018 },
  interestedSubjects: ["수학", "영어"],
  membership: "일반 회원",
  initial: "김",
};

export interface Inquiry {
  id: string;
  type: string;
  title: string;
  date: string;
  status: "답변 완료" | "답변 대기";
}

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "Q-20260506-0003",
    type: "학원 정보 관련",
    title: "학원 수강료 문의",
    date: "2026.05.06 14:30",
    status: "답변 완료",
  },
  {
    id: "Q-20260428-0002",
    type: "서비스 이용",
    title: "비교함 기능 관련 문의",
    date: "2026.04.28 11:15",
    status: "답변 완료",
  },
  {
    id: "Q-20260415-0001",
    type: "기타",
    title: "회원 탈퇴 관련 문의",
    date: "2026.04.15 09:42",
    status: "답변 완료",
  },
];
