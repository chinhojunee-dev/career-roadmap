import type {
  Activity, ActivityDraft, Assessment, ChatReply, ChatRequest, ImportSource, ImportedActivity, ItemKind,
  Profile, ProfileRow, Roadmap, RoadmapDetail,
} from '../model/types';

/**
 * 화면은 이 인터페이스로만 데이터를 받는다.
 * 지금은 mockCareerApi 가 연결돼 있고, 인증·DB·외부 서비스는 쓰지 않는다.
 * 나중에 AI/서버 API 로 바꿀 때는 이 인터페이스를 구현한 httpCareerApi 로 index.ts 만 교체하면 된다.
 */
export interface CareerApi {
  /* 프로필 */
  getProfile(): Promise<Profile>;
  saveProfile(patch: Partial<Profile>): Promise<Profile>;
  getProfileRows(): Promise<ProfileRow[]>;

  /* AI — 채팅과 파일·Notion 가져오기는 각각 함수 하나로 모아 둔다 */
  chat(req: ChatRequest): Promise<ChatReply>;
  importActivities(req: { source: Exclude<ImportSource, 'chat'>; url?: string }): Promise<ImportedActivity[]>;
  /** 활동 편집기에서 Notion·파일로 한 번에 채우기 */
  importActivityDraft(): Promise<ActivityDraft>;
  /** AI 역량 분석 */
  getAssessment(): Promise<Assessment>;

  /* 학기별 로드맵 */
  getRoadmap(): Promise<Roadmap>;
  getRoadmapItem(title: string, kind: ItemKind): Promise<RoadmapDetail>;
  setRoadmapSelected(key: string): Promise<void>;
  setItemDone(title: string, done: boolean): Promise<void>;
  markRoadmapFilled(): Promise<void>;

  /* 활동 */
  listActivities(): Promise<Activity[]>;
  saveActivities(list: Activity[]): Promise<void>;
}
