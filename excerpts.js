/*
 * 코드 발췌 (2026-11-10)
 * - 각 작품 원본 저장소에서 본인이 작성한 부분을 줄 번호 그대로 옮겼습니다(Git 기록 기준).
 * - start: 원본 파일에서 첫 줄의 줄 번호. 공통 들여쓰기만 줄였고(탭은 공백 4칸), 그 외 내용은 원본과 같습니다.
 * - "//@fold N 설명" 줄은 원본 N줄을 접어서(생략) 보여 줍니다. 줄 번호는 그만큼 건너뜁니다.
 * - 줄 끝의 "// ▶ 설명"은 원본 코드에 없는 설명입니다. 화면에서는 코드에서 빠지고 번호 표시와 아래 설명 목록으로 나옵니다.
 * - data.js의 각 작품에서 excerpt: EXCERPTS.작품id 로 연결합니다. 그리는 코드는 codeview.js에 있습니다.
 */
const EXCERPTS = {
  delver: {
    title: '청크 AABB 절두체 판정',
    note: '청크 경계 상자(AABB)의 꼭짓점 8개를 뷰·투영 행렬로 클립 공간에 보낸 뒤, 6개 평면 중 하나라도 8개 모두 바깥이면 이 청크를 그리지 않습니다. 큐브마다가 아니라 청크마다 한 번만 판정해서 판정 비용도 줄였습니다.',
    blocks: [{
      label: 'CStaticCubeMap::Is_Visible', nav: ['CStaticCubeMap', 'Is_Visible(RUNTIME_CHUNK& chunk, _matrix& matrixOut)'],
      file: 'Client/Code/CStaticCubeMap.cpp', start: 371, lang: 'cpp',
      code: String.raw`bool CStaticCubeMap::Is_Visible(RUNTIME_CHUNK& chunk, _matrix& matrixOut)
{
    _vec3& vMin = chunk.tInfo.vMin;
    _vec3& vMax = chunk.tInfo.vMax;
    _vec3 vVertex[8] =
    {
        { vMin.x, vMin.y, vMin.z }, { vMax.x, vMin.y, vMin.z },
        { vMin.x, vMax.y, vMin.z }, { vMax.x, vMax.y, vMin.z },
        { vMin.x, vMin.y, vMax.z }, { vMax.x, vMin.y, vMax.z },
        { vMin.x, vMax.y, vMax.z }, { vMax.x, vMax.y, vMax.z }
    };
    bool bVertexOut[6] = { true,true,true,true,true,true };
    for (_vec3& vec : vVertex)  //정점이 절두체 나가있는지 확인
    {
        D3DXVECTOR4 q;
        D3DXVec3Transform(&q, &vec, &matrixOut); // ▶ 꼭짓점을 뷰·투영 행렬로 클립 공간에 보냄
        bVertexOut[0] &= q.x < -q.w;        //왼 // ▶ 평면마다 '꼭짓점이 모두 바깥인가'를 AND로 누적
        bVertexOut[1] &= q.x > q.w;         //오
        bVertexOut[2] &= q.y < -q.w;        //아래
        bVertexOut[3] &= q.y > q.w;         //위
        bVertexOut[4] &= q.z < 0.f;         //near 앞
        bVertexOut[5] &= q.z > q.w;         //far 너머
    }

    for (bool outside : bVertexOut)
        if (outside)
            return false;       // 청크 꼭짓점 8개가 모두 바깥이면 제외 // ▶ 한 평면이라도 해당되면 청크 전체를 그리지 않음

    return true;
}`
    }]
  },

  kirby: {
    title: '능력 객체 전환',
    note: '능력별 커비 객체를 미리 만들어 두고, 변신할 때는 새로 생성하지 않고 활성 플래그만 바꿉니다. 이전 객체의 위치·HP·바라보는 방향을 새 객체로 넘기고, 이전 객체는 비활성화해서 갱신·렌더링 대상에서 빠지게 합니다.',
    blocks: [{
      label: 'CSceneMgr::Set_Player', nav: ['CSceneMgr', 'Set_Player(KIRBY_ABILITY ePlayerID)'],
      file: 'DefaultWindow/CSceneMgr.cpp', start: 416, lang: 'cpp',
      code: String.raw`void CSceneMgr::Set_Player(KIRBY_ABILITY ePlayerID)
{
    if (m_eCurPlayerID == ePlayerID) return;
    if (ePlayerID != KIRBY_ABILITY::ABILITY_NORMAL)
    {
        //@fold 19 변신 효과음·이펙트 재생, 1초 연출 정지, 남아 있는 능력 별 정리
    }

    CUIMgr::Get_Instance()->SetPlayerAbilityUI(ePlayerID);


    CObj* prePlayer = Get_Player();

    m_eCurPlayerID = ePlayerID;

    CObj* curPlayer = Get_Player();


    curPlayer->SetObjIsUnused(false); // ▶ 미리 만들어 둔 능력 객체를 활성화(새로 생성하지 않음)
    curPlayer->SetPos(prePlayer->GetInfo()->fX, prePlayer->GetInfo()->fY); // ▶ 이전 객체의 위치를 이어받음


    prePlayer->SetObjIsUnused(true); // ▶ 이전 객체는 비활성화해 갱신·렌더링에서 제외
    prePlayer->SetPos(-100, -100);

    CPlayer* pPlayer = dynamic_cast<CPlayer*>(curPlayer);

    dynamic_cast<CPlayer*>(prePlayer)->GetStatus(pPlayer->GetHpPoint(), pPlayer->GetFaceDirPoint()); // ▶ 이전 객체의 HP·바라보는 방향을 새 객체로 넘김

    curPlayer->Update_Rect();
    prePlayer->Update_Rect();


    if (ePlayerID != KIRBY_ABILITY::ABILITY_NORMAL)
    {
        pPlayer->SetHyper();
        pPlayer->SetPlayerAnim();
    }
}`
    }]
  },

  kirbyBoss: {
    title: '보스 패턴 상태 머신 (도팡, Daroach)',
    note: '보스 도팡의 행동을 enum으로 나누고, 행동마다 지속 시간을 표로 둔 상태 머신입니다. 매 프레임 현재 행동만 처리하고, 별·폭탄 탄은 공격 애니메이션의 정해진 프레임에 생성합니다. 별·폭탄 공격이 끝나면 세 번 순간이동한 뒤 다음 패턴을 무작위로 고르며, 빔은 추첨에서 빼서 예고 단계를 거쳐서만 시작합니다.',
    leftBlocks: [0],
    blocks: [{
      label: 'CMonster_Daroach · 행동별 지속 시간', nav: ['CMonster_Daroach'],
      file: 'DefaultWindow/CMonster_Daroach.h', start: 78, lang: 'cpp',
      code: String.raw`float   m_fPatternTime[DAROACH_ACTION::DAROACH_ACTION_END]
{
    1.f,    //DAROACH_IDLE,
    1.f,    //DAROACH_BLINK,
    2.f,    //DAROACH_BEAM_PRE,
    5.5f,   //DAROACH_BEAM,
    3.f,    //DAROACH_BOMB,
    2.f,    //DAROACH_STAR,
};`
    }, {
      label: 'CMonster_Daroach::ActionAttack', nav: ['CMonster_Daroach', 'ActionAttack()'],
      file: 'DefaultWindow/CMonster_Daroach.cpp', start: 231, lang: 'cpp',
      code: String.raw`void CMonster_Daroach::ActionAttack()
{
    m_pTarget = CSceneMgr::Get_Instance()->Get_Player();
    switch (m_curDaroachAction)
    {
    case CMonster_Daroach::DAROACH_IDLE:
        m_eCurState = DAROACH_ANIM::DAROACH_IDLE_ANIM;
        m_iCurArea = 2;
        MoveTo(m_ptMoveArea[m_iCurArea].m_fX, m_ptMoveArea[m_iCurArea].m_fY, m_fSpeed);
        if (m_PatternStart + m_fPatternTime[DAROACH_ACTION::DAROACH_IDLE] * 3000.f < GetTickCount()) // ▶ 대기 시간이 지나면 다음 행동을 무작위로 고름
        {
            int iNext = (int)DAROACH_ACTION::DAROACH_IDLE;

            for(;iNext == (int)DAROACH_ACTION::DAROACH_IDLE || iNext == (int)DAROACH_ACTION::DAROACH_BEAM;) // ▶ 빔은 추첨에서 빼서 예고(BEAM_PRE)를 거쳐서만 시작
                iNext = (rand() % DAROACH_ACTION::DAROACH_ACTION_END);

            SetNewAction((DAROACH_ACTION)iNext);
        }
        break;
    case CMonster_Daroach::DAROACH_BLINK:
        ActionBlink(); // ▶ 순간이동 3회 후 다음 패턴 (별·폭탄 공격이 끝나면 이 단계로 돌아옴)
        break;
    case CMonster_Daroach::DAROACH_BEAM_PRE:
        m_curDaroachAction = DAROACH_ACTION::DAROACH_BEAM; // ▶ 예고 연출·플레이어 높이 추적·발사는 Attack_Beam이 단계별로 처리
        break;
    case CMonster_Daroach::DAROACH_BEAM:
        Attack_Beam();
        break;
    case CMonster_Daroach::DAROACH_BOMB:
        Attack_Bomb();
        break;
    case CMonster_Daroach::DAROACH_STAR:
        Attack_Star();
        break;
    //@fold 4 ACTION_END · default
    }
}`
    }]
  },

  popcorn: {
    title: 'Destroy() 지연 삭제 문제 — 수정 전후',
    note: '수정 전에는 Destroy 직후 같은 프레임에서 GetComponent로 카드를 찾아, 곧 사라질 이전 카드가 초기화됐습니다. 수정 후에는 새 카드가 Init() 중 SetEffect(this)로 자기 자신을 슬롯에 등록하고, 슬롯은 그 캐시 참조로 효과를 실행합니다. 이전 카드는 선택 시점에 미리 삭제합니다.',
    commit: 'https://github.com/GniNeSt/POPCORN_DEMO/commit/72e8fb9483c361281fbfeb98da16898f38ea380c',
    blocks: [{
      label: '수정 전 · 커밋 67c2186', caption: '수정 전 · 커밋 67c2186', nav: ['ItemManager', 'SetItem'],
      file: 'Assets/2.Scripts/Manager/ItemManager.cs', start: 66, lang: 'csharp',
      code: String.raw`foreach (var i in _ico)
{
    //@fold 5 카드 종류(Type) 결정

    ItemCardCtrlObj icco = i.transform.GetChild(0).gameObject.GetComponent<ItemCardCtrlObj>();
    if(icco != null)
    {
        Destroy(icco); // ▶ Destroy는 프레임이 끝날 때 실제로 삭제됨
    }

    i.transform.GetChild(0).gameObject.AddComponent(itemName);
    i.transform.GetChild(0).GetComponent<ItemCardCtrlObj>().Init(); // ▶ 같은 프레임이라 아직 남아 있는 이전 카드가 초기화됨

    i.AppearCard();
    i.transform.GetChild(0).GetChild(0).GetChild(3).gameObject.SetActive(true);
}`
    }, {
      label: '수정 후 · 커밋 72e8fb9', caption: '수정 후 · 커밋 72e8fb9', nav: ['ItemCtrlObj', 'SetEffect(ItemCardCtrlObj obj)'],
      file: 'Assets/2.Scripts/Object/ItemCtrlObj.cs', start: 14, lang: 'csharp',
      code: String.raw`[SerializeField] ItemCardCtrlObj _icco;
public void OnClick()
{
    _icco.CardEffect(); // ▶ GetComponent 대신 캐시해 둔 참조로 효과 실행

    transform.parent.GetComponent<ItemManager>().ItemSelect();
}
public void SetItem(System.Type type)
{
    transform.GetChild(0).gameObject.AddComponent(type);
    transform.GetChild(0).GetComponent<ItemCardCtrlObj>().Init();
    transform.GetChild(0).GetChild(0).GetChild(3).gameObject.SetActive(true);
    AppearCard();
}
public void SetEffect(ItemCardCtrlObj obj) // ▶ 새 카드가 Init() 중 SetEffect(this)로 자신을 등록
{
    _icco = obj;
}
public void RemoveCard()
{
    Destroy(_icco); // ▶ 카드를 고른 시점에 미리 삭제
    GetComponent<Animator>().Play("ItemCardRemove");
}`
    }]
  },

  lyria: {
    title: '흙 마법서 규칙 판정',
    note: '각 책은 오른쪽으로 2D 레이(RaycastAll)를 쏴서 범위 안의 책을 검사합니다. 흙 마법서는 범위 안의 불·물 마법서 개수가 같아야 하고, 어긋나면 위반한 규칙 번호(ErrorNum)를 남겨 UI가 해당 규칙을 빨간색으로 표시합니다.',
    blocks: [{
      label: 'OrganizeBookCtrl.ErrorCheck · 흙(Ocher) 분기', nav: ['OrganizeBookCtrl', 'ErrorCheck'],
      file: 'Assets/2.Scripts/OrganizeBookCtrl.cs', start: 137, lang: 'csharp',
      code: String.raw`case BookType.Ocher:
    if (!_sm.IsOnStage)
        return true;
    //@fold 2 주석 처리된 이전 코드
    countR = 0; countB = 0;
    foreach (RaycastHit2D hit in hits) // ▶ 오른쪽으로 쏜 레이에 맞은, 범위 안의 책들
    {
        if (hit.transform.GetComponent<OrganizeBookCtrl>() == null)
        {
            continue;
        }
        BookType bookType = (BookType)hit.collider.gameObject.GetComponent<OrganizeBookCtrl>().BookNum;
        if (bookType == BookType.Red)
        {
            countR++;
        }
        else if (bookType == BookType.Blue)
        {
            countB++;
        }
    }
    if (countR != countB) // ▶ 흙 규칙: 범위 안의 불·물 마법서 개수가 같아야 함
    {
        //Debug.Log("OcherError!!!");
        _error = true;
        _errorBook = this;
        ErrorNum = 1; // ▶ 위반한 규칙 번호 → UI가 해당 규칙을 빨간색으로 표시
        return true;
    }
    ErrorNum = -1;
    _error = false;
    break;`
    }]
  },

  hellodita: {
    title: '미니게임 공통 인터페이스와 결과 판정',
    note: '모든 미니게임은 IMinigame을 구현하고, 결과 형태가 다른 게임만 선택 인터페이스를 추가로 구현합니다. 디렉터는 개별 게임을 몰라도 인터페이스 종류에 따라 결과를 판정하고, 시간 초과는 패배로 처리합니다.',
    blocks: [{
      label: 'IMinigame', nav: ['IMinigame'],
      file: 'Scripts/Minigame/IMinigame.cs', start: 3, lang: 'csharp',
      code: String.raw`public interface IMinigame
{
    /// <summary>미니게임 시작(상태 초기화 포함)</summary>
    void StartGame();

    /// <summary>강제 종료(리소스 정리/상태 리셋)</summary>
    void AbortGame();

    /// <summary>플레이어가 조건을 달성해 '성공'으로 종료되면 true</summary>
    bool IsFinished { get; }

    /// <summary>완료 시 호출(성공/실패는 디렉터가 타임아웃으로 판정)</summary>
    event Action Finished; // 플레이어가 미션 완료했을 때만 호출
}`
    }, {
      label: 'IMinigameResult', nav: ['IMinigameResult'],
      file: 'Scripts/Minigame/IMinigameResult.cs', start: 1, lang: 'csharp',
      code: String.raw`public interface IMinigameResult
{
    bool WasSuccess { get; }
}`
    }, {
      label: 'MinigameDirector.CoRunMinigame · 결과 판정부', nav: ['MinigameDirector', 'CoRunMinigame'],
      file: 'Scripts/Minigame/MinigameDirector.cs', start: 225, lang: 'csharp',
      code: String.raw`// 결과 판정
MinigameOutcome outcome;
if (entry.logic is IMinigameOutcomeProvider op) // ▶ 결과(Outcome)를 직접 넘기는 게임
{
    outcome = op.Outcome;
    if (!finished && t >= playMaxSeconds) outcome = MinigameOutcome.Lose; // 타임아웃은 패배
    success = (outcome == MinigameOutcome.Win);
}
else if (entry.logic is IMinigameResult r) // ▶ 성공 여부만 넘기는 게임
{
    success = finished && r.WasSuccess;
    outcome = success ? MinigameOutcome.Win : MinigameOutcome.Lose;
}
else // ▶ 완료 이벤트만 있는 게임: 시간 안에 끝내면 승리
{
    success = finished; // 끝냈으면 승리, 아니면 패배
    outcome = success ? MinigameOutcome.Win : MinigameOutcome.Lose;
}`
    }]
  }
};
