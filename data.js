/*
 * 포트폴리오 내용 데이터 (사이트와 인쇄용 PDF가 함께 사용)
 * - 내용 근거: CLAUDE_PORTFOLIO_TECH_AUDIT.md(코드·Git 검토)와 사용자 확인 사항.
 * - 값이 빈 문자열/빈 배열이면 화면에 그리지 않습니다(빈칸을 노출하지 않음).
 * - tier: 'main'은 대표작(상단 카드), 'sub'는 목록. order가 작을수록 먼저 표시.
 * - 코드 발췌는 excerpts.js에 있습니다(excerpt: EXCERPTS.작품id).
 */
/*
 * 공개 연락처 — 이 사이트와 저장소는 누구나 볼 수 있습니다(GitHub Pages는 공개 저장소).
 * - 공개해도 되는 값만 넣으세요: 구직용 이메일, GitHub 주소 정도.
 * - 전화번호·주소·생년월일, 그리고 그런 정보가 들어간 이력서 PDF 링크는 넣지 마세요.
 *   한 번 커밋하면 나중에 지워도 Git 기록에 남습니다. 전화번호는 회사에 직접 내는 이력서에만 적으세요.
 * - 값이 비어 있으면 "연락처는 지원 서류에 기재"라는 안내만 표시됩니다.
 */
const CONTACT = {
  email: 'octhj@naver.com',  // 구직용 공개 이메일
  github: ''  // 예: https://github.com/아이디
};

/* 메탈슬러그 영상 2개를 이어서 반복 재생 (YouTube 재생목록 + loop) */
const METAL_VIDEOS = ['3YWSvEDkvD4', 'Hgm4Zs9Lwrc'];

const projects = [
  {
    id: 'hellodita', tier: 'main', order: 1, category: 'unity',
    title: 'HelloDita', subtitle: '다마고치형 육성 · 대화 · 미니게임',
    tags: ['Unity', 'C#', '2인 팀 리더'],
    award: '게임핑 10분게임 콘테스트(그때 그 게임편) 3등 · 총점 77.177점',
    activity: 'STOVE 인디 지원 선정 · 제9회 일러스타 페스 인디 부스 체험 전시 (2025.10.03–04, KINTEX)',
    image: 'assets/hellodita-feed.jpg', imageAlt: 'HelloDita 플레이 화면 — 펫이 있는 방과 도구 버튼',
    cardImage: 'assets/hellodita-title.jpg', // 사이트 목록·대표 카드에만 쓰는 대표 이미지(타이틀 화면). 상세 내용과 PDF 소개 쪽은 image를 씁니다.
    tldr: [['내 역할', '2인 팀 리더 · 콘셉트·시스템 설계·Unity 개발·아트·배포'], ['핵심 성과', '게임핑 10분게임 콘테스트 3등 · 일러스타 페스 체험 전시 · 미니게임 6종을 공통 구조로 통합'], ['증빙', '플레이 페이지 · 플레이 영상 · 수상 발표 캡처 · 전시 부스 사진']],
    excerpt: EXCERPTS.hellodita,
    summary: '진로 고민을 다마고치 형식에 담은 내러티브 게임. 여러 미니게임·상태·대화 시스템을 하나의 흐름으로 묶어 완성했습니다.',
    period: '2025.08.05 – 2025.09.30', team: '2인 (본인 팀 리더)', platform: 'PLAYINIT 공개',
    videos: ['JLEUmAh-7zA'],
    role: '전체 콘셉트·시스템 설계, Unity 프로그래밍 전반, 캐릭터 아트, 빌드·배포. 팀원이 노션에 정리한 미니게임·대사·UI 기획을 데이터와 코드로 구현',
    features: [
      ['미니게임 공통 실행 구조', '공통 인터페이스 IMinigame(시작·중단·완료 이벤트)과 결과별 선택 인터페이스를 두고, 실행 디렉터가 진입 연출 → 제한 시간 플레이 → 결과 판정 → 정리 → 스탯·업적 반영을 한 코루틴에서 처리합니다. 미니게임 6종이 같은 흐름을 공유합니다.', 'assets/hellodita-minigame.jpg', '미니게임 진입 연출 — 슬롯별 안내 화면(위태위태 탑 쌓기)'],
      ['이벤트 기반 펫 상태', '포만감·행복도는 효과(enum)로만 바뀌고, 증감값은 인스펙터 효과 테이블로 조정합니다. 값 변화와 상태 구간 변화를 별도 이벤트로 알려 UI·감정 연출·업적이 각자 반응합니다.', 'assets/hellodita-feed.jpg', '밥 주기 도구로 효과를 적용하는 장면'],
      ['시간과 규칙', '게임 시간은 일시정지 키 집합을 지원해 미니게임·메신저가 서로의 정지를 풀지 않습니다. 규칙 엔진이 경과 시간을 누적해 포만감 감소, 쓰레기·질병에 따른 행복도 감소를 적용합니다.'],
      ['데이터 기반 채팅 시나리오', 'ScriptableObject 프로필의 시간·조건 트리거로 대사를 띄우고, 선택지에 따른 후속 대사는 우선 큐로 먼저 처리합니다.', 'assets/hellodita-chat.jpg', '메신저 대화와 선택지']
    ],
    code: ['IMinigame · MinigameDirector — 미니게임 실행 흐름', 'PetStats · PetRulesEngine · GameElapsedTimer — 상태·시간 규칙', 'ChatScenarioProfile · ChatScenarioDirector · ChatUIManager — 대화', 'AchievementEvents · AchievementManager — 업적'],
    story: null,
    collaboration: '2인 팀의 리더로 방향을 정하고 개발 전반을 맡았습니다. 미니게임 구성, 채팅 대사, UI 종류, 상호작용 콘텐츠의 세부 기획은 팀원이 담당했습니다.',
    method: '핵심 코드를 직접 작성한 뒤 AI로 리뷰·수정했습니다.',
    // 세 번째 값은 PDF에서만 쓰는 원본 사진(private/ 폴더, 저장소에 올리지 않음). 없으면 두 번째 값의 사이트용 이미지를 씁니다.
    evidenceImages: [['assets/hellodita-award.jpg', '게임핑 10분게임 콘테스트 결과 발표 화면 (3등, 총점 77.177점)'], ['assets/hellodita-booth.jpg', '제9회 일러스타 페스 STOVE 인디 부스 (2025.10.03–04, KINTEX)', 'private/hellodita-booth.jpg']],
    next: '심사평에서 스토리 개연성, 반복 구조, 미니게임·인터랙션 완성도가 아쉬운 점으로 지적됐습니다.',
    links: [['플레이 · PLAYINIT', 'https://playinit.net/games/ditacomolita'], ['플레이 영상', 'https://youtu.be/JLEUmAh-7zA']]
  },
  {
    id: 'delver', tier: 'main', order: 2, category: 'cpp',
    title: 'Delver 모작', subtitle: '3D 던전 탐험 · C++/DirectX 9',
    tags: ['C++', 'DirectX 9', 'ImGui', '3인 팀 리더'],
    award: '청크 절두체 컬링 · 같은 실내 장면 프레임 시간 약 74% 단축',
    image: 'assets/delver-quest.jpg', imageAlt: 'Delver 모작 플레이 화면 — 퀘스트 추적 UI와 랜턴·화염 지팡이',
    tldr: [['내 역할', '3인 팀 리더 · PR 153건 통합 · 맵 에디터·렌더링·충돌·퀘스트·미니게임 2종'], ['핵심 성과', '청크 절두체 컬링으로 같은 실내 장면 프레임 시간 74.80ms → 19.15ms'], ['증빙', '컬링 ON/OFF 캡처 · 플레이 영상 · Git 이력']],
    excerpt: EXCERPTS.delver,
    summary: '학원 제공 프레임워크 위에서 3인 팀을 이끌며 맵 에디터, 청크 단위 렌더링·컬링, 지형 충돌, 퀘스트와 미니게임을 구현했습니다.',
    period: '2026.09.14 – 2026.10.15', team: '프로그래머 3인 (본인 팀 리더)', platform: 'Windows',
    videos: ['jawLBCFsNAY'],
    role: '팀 리더 · 브랜치 PR 통합(153건), 스테이지 흐름 구성, 맵 에디터, 청크 맵·절두체 컬링, 지형 충돌, 상호작용·퀘스트, 아이템 베이스 계층, 점광원 관리, 미니게임 2종',
    features: [
      ['ImGui 맵 에디터', '별도 실행 툴. 마우스 레이와 블록 AABB의 슬랩 교차로 블록을 고르고, 맞은 면 방향으로 인접 블록을 설치합니다. 블록 종류 선택, 선택 블록 높이 0.25 단위 조정, 버전 헤더가 있는 맵 파일 저장과 검증 로드를 지원합니다.'],
      ['청크 단위 절두체 컬링', '정적 큐브를 XZ 격자 청크로 묶어 청크별 AABB를 만들고, 꼭짓점 8개를 클립 공간으로 변환해 6개 평면 중 하나라도 완전히 바깥이면 그리지 않습니다. 로딩 화면에서는 청크를 프레임마다 나눠 생성합니다.'],
      ['지형 충돌', '현재 위치 주변 3×3 청크의 큐브만 검사해 바닥·천장·벽 충돌을 처리합니다. 벽은 큐브 로컬 공간에서 최근접점 기준으로 밀어냅니다.'],
      ['게임플레이 시스템', 'std::function 조건·행동을 바인딩하는 상호작용 컴포넌트, 퀘스트 상태 머신(수락→진행→완료→보상)과 추적 UI, 바닥/손 아이템 상속 계층, D3D9 점광원 인덱스 할당·반납.', 'assets/delver-quest.jpg', '퀘스트 추적 UI(처치 목표 완료), 손에 든 랜턴(점광원)과 화염 지팡이'],
      ['스테이지와 미니게임', '시작 마을 → 튜토리얼 → 미니게임 1 → 메인 → 미니게임 2 → 보스 → 결과 화면. 미니게임 1은 이상현상을 판별해 앞으로 가거나 되돌아가는 반복 회랑(위치 선분과 포털 평면의 교차로 통과 판정)입니다.']
    ],
    code: ['MapEditor: CEditorMap · CMapSerializer — 피킹·배치·저장', 'CStaticCubeMap — 청크 빌드 · Is_Visible 컬링 · 지형 충돌', 'CInterAction · CQuest — 상호작용·퀘스트', 'CLightMgr · CPointLight — 점광원', 'CStage_Mirage — 이상현상 회랑'],
    story: {
      problem: '큐브로 만든 맵 전체를 매 프레임 그리면, 시야가 좁은 실내에서도 프레임 시간이 74.80ms까지 늘어납니다(컬링 OFF 측정).',
      cause: '화면에 보이지 않는 큐브까지 모두 렌더링 대상이었습니다. 큐브마다 판정하면 판정 비용도 커지므로, 묶음 단위 판정이 필요했습니다.',
      fix: '큐브를 격자 청크로 묶고 청크 AABB 하나로 절두체 바깥 여부를 판정해, 보이지 않는 청크를 통째로 제외했습니다.',
      result: '같은 실내 장면에서 컬링 OFF 74.80ms → ON 19.15ms (약 74% 단축). 단일 프레임 측정이며, 두 캡처의 카메라 방향은 조금 다릅니다.',
      images: [['assets/delver-culling-off.webp', '컬링 OFF · 74.80ms'], ['assets/delver-culling-on.jpg', '컬링 ON · 19.15ms']]
    },
    collaboration: '팀원 2명은 몬스터·보스 패턴·파티클·미니맵, 인벤토리·장비 UI를 각각 맡았습니다. 저는 팀 리더로 PR을 검토·병합하며 통합을 담당했습니다.',
    method: '코드는 직접 작성했고, 조명·충돌 값 조정 등은 AI에게 조언을 받아 참고했습니다.',
    evidenceImages: [],
    next: '충돌 검사 시 이웃 청크 큐브를 매번 복사하는 비용, 회전 큐브의 청크 경계 계산, 고정 파이프라인의 동시 광원 수 제한을 다음 개선 지점으로 보고 있습니다.',
    links: [['플레이 영상', 'https://youtu.be/jawLBCFsNAY']]
  },
  {
    id: 'lyria', tier: 'sub', order: 3, category: 'unity',
    title: '리리아와 마법도서관', subtitle: '원소 규칙 책 배치 퍼즐',
    tags: ['Unity', 'C#', '2인 팀 · 프로그래밍 전담'],
    award: 'BUD 게임 콘테스트 최우수상(2등)',
    image: 'assets/lyria-rules.jpg', imageAlt: '리리아와 마법도서관 플레이 화면 — 규칙 목록과 책장',
    tldr: [['내 역할', '2인 팀의 프로그래밍 전담 · 캐릭터·로고·UI 아트'], ['핵심 성과', 'BUD 게임 콘테스트 최우수상(2등) · 원소별 인접 규칙 판정과 위반 피드백'], ['증빙', 'itch.io 플레이 · 플레이 영상']],
    excerpt: EXCERPTS.lyria,
    summary: '원소마다 다른 규칙을 가진 마법서를 책장에 정리하는 퍼즐. 규칙 판정과 위반 피드백을 구현했습니다.',
    period: '2025.01.20 – 2025.03.05', team: '2인 (기획 1 · 프로그래밍 1)', platform: 'PC · Web',
    videos: ['Ld0Yu-ibStg'], videoStart: 70, // 기존 공유 링크(&t=70s)와 같은 지점부터 재생
    role: 'Unity 프로그래밍 전체, 캐릭터 디자인·로고·UI. 팀원(팀 리더)이 문서로 전달한 레벨 디자인을 단계 데이터와 씬 배치로 구현',
    features: [
      ['원소별 규칙 판정', '각 책에서 2D 레이를 쏴 범위 안의 책 종류를 검사합니다. 불↔물·불↔풀 인접 금지, 풀은 물이나 흙이 필요, 흙은 주변 불과 물의 개수가 같아야 합니다.', 'assets/lyria-rules.jpg', '단계별 규칙 목록과 선택한 책'],
      ['규칙을 전달하는 UI', '위반한 규칙 텍스트를 빨간색으로 표시하고, 실패하면 캐릭터 대사로 다시 시도를 안내하며, 성공하면 다음 단계로 넘어갑니다.'],
      ['배치와 회수', '마우스 레이캐스트로 빈 칸을 강조하고, 책을 놓거나 다시 집어 다른 칸으로 옮깁니다.', 'assets/lyria-place.jpg', '책장에 책을 배치하는 중']
    ],
    code: ['OrganizeBookCtrl — 규칙 판정', 'SectionManager · SectionCtrl — 배치·회수', 'GameManager · LevelSetManager — 진행·단계 데이터'],
    story: null,
    collaboration: '팀원이 아이디어, 팀 리더, 퍼즐 레벨 디자인을 맡았고, 저는 Unity 개발 전체와 아트·UI를 맡았습니다.',
    method: '', evidenceImages: [],
    next: '대사와 진행이 코드에 직접 들어 있어, 데이터로 분리하고 판정을 이벤트 기반으로 바꾸는 것을 다음 개선 방향으로 보고 있습니다.',
    links: [['플레이 · itch.io', 'https://gninest.itch.io/ly'], ['플레이 영상', 'https://www.youtube.com/watch?v=Ld0Yu-ibStg'], ['작품 소개', 'https://mandlemandle.com/projects/e9dca2']]
  },
  {
    id: 'kirby', tier: 'sub', order: 4, category: 'cpp',
    title: '별의 커비 모작', subtitle: '도팡일당의 습격 · 2D 액션',
    tags: ['C++', 'WinAPI', '개인'],
    award: '',
    image: 'assets/kirby-ability.jpg', imageAlt: '별의 커비 모작 플레이 화면 — 버블 능력과 능력 아이템',
    tldr: [['내 역할', '1인 개발 · 학원 제공 뼈대 위에 게임 전체 구현'], ['핵심 성과', '능력 4종 사전 생성·전환, 타일 → 지면 선분·충돌 자동 생성, 보스 패턴'], ['증빙', '플레이 영상 · X 개발 일지']],
    excerpt: EXCERPTS.kirby, extraExcerpts: [EXCERPTS.kirbyBoss],
    summary: '학원 제공 WinAPI 뼈대 위에 능력 전환, 타일 충돌, 보스와 미니게임까지 1인으로 완성한 2D 액션 모작입니다.',
    period: '2026.07.05 – 2026.07.26', team: '개인', platform: 'Windows',
    videos: ['cqB-xHE5II4'],
    role: '게임 전체 구현. 학원 제공 뼈대(메인 루프·오브젝트 기반 클래스·매니저) 위에 타일 저장/로드와 충돌 생성 로직을 직접 설계',
    features: [
      ['능력별 객체 전환', '일반·닌자·버블·토네이도 커비를 미리 만들어 두고 활성 플래그로 전환합니다. 변신 시 위치·HP·방향을 이어받고 전용 변신 애니메이션을 재생하며, 비활성 객체는 갱신·렌더링에서 제외합니다.', 'assets/kirby-ability.jpg', '버블 능력 상태. 아래 화면에는 저장한 능력 아이템'],
      ['타일 → 충돌 데이터', '저장한 타일을 불러와 종류별로 평지·경사 지면 선분과 충돌 사각형을 자동 생성하고, 런타임에는 이 선분과 사각형으로 충돌을 처리합니다.'],
      ['입력과 보스', '최근 입력을 기억하는 버퍼로 더블 탭 대시를 판정하고, enum 기반 상태 머신으로 보스 패턴(순간이동·빔·폭탄·별)을 구성했습니다.', 'assets/kirby-boss.jpg', '보스 도팡 전투(토네이도 능력)'],
      ['게임 구성', '튜토리얼 · 메인 스테이지 2개 · 보스, 창작 미니게임, 월드맵(스테이지 선택), 인트로 컷신.']
    ],
    code: ['CSceneMgr::CreatePlayer · Set_Player — 능력 전환', 'CTileMgr::SaveTile · LoadTile · UseTile — 타일·충돌 생성', 'CPlayer::RememberKeyDown · ComboCheck — 입력 버퍼', 'CMonster_Daroach — 보스 패턴'],
    story: null, collaboration: '', method: '', evidenceImages: [],
    next: '이동·점프가 프레임 단위 고정값이라 델타 타임 기반으로 바꾸는 것, 입력 버퍼를 참조로 다루도록 고치는 것을 다음 개선 지점으로 보고 있습니다.',
    links: [['플레이 영상', 'https://youtu.be/cqB-xHE5II4'], ['첫 개발 일지 · X', 'https://x.com/gninest/status/2075995152913711236'], ['마지막 시연 · X', 'https://x.com/gninest/status/2081660055334838718']]
  },
  {
    id: 'popcorn', tier: 'sub', order: 5, category: 'unity',
    title: 'PopCorn', subtitle: '2진수 입력 카드 퍼즐',
    tags: ['Unity', 'C#', '개인'],
    award: '',
    image: 'assets/popcorn-pad.jpg', imageAlt: 'PopCorn 플레이 화면 — 카드 3장과 2진수 숫자 패드',
    tldr: [['내 역할', '1인 개발 · 기획·프로그래밍 전체'], ['핵심 성과', '2진수 입력 퍼즐과 업그레이드 카드 8종 · Unity Destroy() 지연 삭제 문제 해결'], ['증빙', '개발 영상 · 프로젝트 PDF · 수정 전후 Git 커밋']],
    excerpt: EXCERPTS.popcorn,
    summary: '8칸 2진수 숫자 패드로 카드의 숫자를 맞추는 UI 퍼즐. 입력 피로도와 업그레이드 카드로 선택의 무게를 더했습니다.',
    period: '2024.07.26 – 2024.08.29', team: '개인', platform: 'PC',
    videos: ['ngXkDta6gbc'],
    role: '기획·프로그래밍 전체',
    features: [
      ['2진수 입력과 매칭', '각 자리를 켜고 끄면 자리값의 합으로 십진수를 계산하고, 펼쳐진 카드 중 같은 숫자를 찾아 점수를 얻습니다.', 'assets/popcorn-pad.jpg', '카드 3장과 8칸 2진수 숫자 패드'],
      ['업그레이드 카드', '공통 카드 클래스를 상속한 버프·디버프 8종을 런타임에 컴포넌트로 교체합니다. 피로도가 쌓이면 디버프를 룰렛으로 받습니다.', 'assets/popcorn-cards.jpg', '업그레이드 카드 3장 중 하나를 고르는 화면'],
      ['진행과 기록', 'enum 상태로 카드 배치·입력·아이템 선택·종료를 구분하고, 이름별 최고 점수에 따라 목표 점수가 올라갑니다.']
    ],
    code: ['InGameManager · NumBoxCtrlObj — 규칙·입력', 'ItemManager · ItemCtrlObj · ItemCardCtrlObj — 카드 효과', 'SaveManager — 기록'],
    story: {
      problem: '이전 카드 컴포넌트를 Destroy하고 같은 베이스를 상속한 새 카드 컴포넌트를 추가했더니, 추가 자체가 안 된 것처럼 보였습니다.',
      cause: 'Destroy는 프레임 끝에 실제로 삭제됩니다. 같은 프레임의 GetComponent가 곧 사라질 이전 컴포넌트를 반환해, 초기화가 이전 카드에서 실행되고 새 카드는 초기화되지 않았습니다.',
      fix: '새 카드가 초기화될 때 스스로 슬롯에 등록하도록 바꾸고(캐시 참조), 효과 실행은 GetComponent 대신 이 참조를 쓰게 했습니다. 이전 카드는 선택 시점에 미리 삭제해 생성 프레임과 분리했습니다.',
      result: 'Git 커밋 67c2186 → 72e8fb9에 수정 전후가 남아 있습니다. 이후 AddComponent의 반환값을 바로 쓰는 방법이 더 확실하다는 것도 알게 됐습니다.',
      images: []
    },
    collaboration: '', method: '', evidenceImages: [],
    next: '종료 화면에서 저장을 매 프레임 호출하는 부분과, 카드 숫자를 UI 텍스트에서 다시 읽는 구조를 정리할 수 있습니다.',
    links: [['개발 영상', 'https://youtu.be/ngXkDta6gbc'], ['프로젝트 자료 (PDF)', 'https://drive.google.com/file/d/1lpKq0ZdxiTojbuu7pVT6lR7r1en-n87P/view']]
  },
  {
    id: 'hori', tier: 'sub', order: 6, category: 'unity',
    title: 'HoriVerti!', subtitle: 'Kenney Jam 2024 출품 · 연결 퍼즐 액션',
    tags: ['Unity', 'C#', '개인', '게임잼'],
    award: '',
    image: 'https://img.youtube.com/vi/G9SND7FjTz0/hqdefault.jpg', imageAlt: 'HoriVerti! 플레이 영상 썸네일',
    tldr: [['내 역할', '1인 게임잼 출품 · 기획·프로그래밍 (아트·사운드는 Kenney 에셋)'], ['핵심 성과', '처음으로 혼자 완성해 공개하고 플레이어 피드백을 받은 작품'], ['증빙', 'itch.io 플레이 · 게임잼 출품 기록 · 플레이 영상']],
    summary: '가로·세로 연결이 마법이 되는 게임. 처음으로 혼자 완성해 공개하고 플레이어 반응을 받은 작품입니다.',
    period: '2024.07.20 – 2024.07.27', team: '개인', platform: 'HTML5 · 브라우저',
    videos: ['G9SND7FjTz0'],
    role: '기획·프로그래밍 (아트·사운드는 잼 규정에 따라 Kenney 에셋 사용)',
    features: [
      ['연결과 공격', '3×3 노드를 잇는 경로를 LineRenderer로 보여 주고, 연결한 노드 수에 비례한 광역 공격을 합니다.'],
      ['자원과 스킬', '가로·세로 이동 횟수를 자원으로 모아 스킬을 사용합니다.'],
      ['위험과 과부하', '위험 노드에 닿으면 경로가 끝나고 위험 노드가 늘어나며, 누적 8회면 잠시 입력이 막히는 과부하가 걸립니다.']
    ],
    code: [], story: null, collaboration: '', method: '', evidenceImages: [],
    next: '플레이어 의견에서 게임 안 규칙 안내와 장기 플레이의 반복성이 지적됐습니다. 원본 소스는 남아 있지 않습니다.',
    links: [['플레이 · itch.io', 'https://gninest.itch.io/horiverti'], ['플레이 영상', 'https://youtu.be/G9SND7FjTz0'], ['게임잼 출품 기록', 'https://itch.io/jam/kenney-jam-2024/rate/2843969']]
  },
  {
    id: 'metal', tier: 'sub', order: 7, category: 'unity',
    title: '메탈슬러그6 모작', subtitle: '2D 런앤건 · 초기 Unity 학습작',
    tags: ['Unity', 'C#', '개인'],
    award: '',
    image: 'assets/metal-run.jpg', imageAlt: '메탈슬러그6 모작 플레이 화면 — 이동하며 사격',
    tldr: [['내 역할', '1인 개발 · 초기 Unity 학습작'], ['핵심 성과', '상체·하체 Animator 분리로 이동과 사격 동작을 조합'], ['증빙', '플레이 영상 2편']],
    summary: 'Unity를 처음 배우던 시기의 모작. 상체와 하체 애니메이션을 따로 관리해 달리면서 위·아래로 쏘는 조합을 처리했습니다.',
    period: '2024.04 – 2024.06 (Git 기록 기준)', team: '개인', platform: 'Windows',
    role: '프로그래밍 전체 (원작 리소스 사용)',
    videos: METAL_VIDEOS,
    features: [
      ['상·하체 분리 애니메이션', '플레이어를 상체(BustAnimator)와 하체(LBAnimator) 두 Animator로 나눴습니다. 이동·점프는 하체가, 조준·사격·수류탄은 상체가 따로 재생해, 달리기와 위/아래 사격 같은 조합을 동작 수를 곱하지 않고 표현합니다.', 'assets/metal-run.jpg', '이동하면서 사격하는 장면'],
      ['슬러그 탑승', '캐릭터와 탑승체의 활성 상태, 카메라 대상, 사격과 하차 위치를 전환합니다.', 'assets/metal-slug.jpg', '슬러그 탑승 지점(IN 표시)'],
      ['무기·적·포로', '무기 교체와 탄약, 구간별 적 생성, 포로 구출과 보상, 탄환·적·아이템 오브젝트 풀을 구현했습니다.']
    ],
    code: ['PlayerController — 상체/하체 Animator 제어', 'PlayerAnimationController — 상체/하체 동작 분류표', 'SlugController — 탑승체'],
    story: null, collaboration: '', method: '', evidenceImages: [],
    next: '처음 배우던 때 만든 작품이라 구조가 거칠지만, 동작을 부위별로 나눠 조합한다는 발상은 이후 프로젝트의 상태 분리 설계로 이어졌습니다.',
    links: [['플레이 영상 1', 'https://youtu.be/3YWSvEDkvD4'], ['플레이 영상 2', 'https://youtu.be/Hgm4Zs9Lwrc']]
  }
];
