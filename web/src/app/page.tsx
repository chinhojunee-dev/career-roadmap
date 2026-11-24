import { RoadmapScreen } from '@/features/career-roadmap/screens/RoadmapScreen';

// 첫 화면은 학기별 로드맵(메인). 리다이렉트 없이 바로 그린다.
// (프록시 뒤에서 Next 가 절대 주소로 리다이렉트하면 내부 호스트가 노출될 수 있다)
export default function Home() {
  return <RoadmapScreen />;
}
