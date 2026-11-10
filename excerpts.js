/*
 * 코드 발췌 (2026-11-10)
 * - 각 작품 원본 저장소에서 본인이 작성한 부분만 그대로 옮겼습니다(Git 기록 기준).
 * - 줄인 부분은 "// …" 주석으로 표시했고, 설명을 위해 덧붙인 주석은 "// ▶"로 시작합니다.
 *   그 외에는 원본과 같습니다(빈 줄 일부만 정리).
 * - data.js의 각 작품에서 excerpt: EXCERPTS.작품id 로 연결합니다.
 */
const EXCERPTS = {
  delver: {
    title: '청크 AABB 절두체 판정',
    note: '청크 경계 상자(AABB)의 꼭짓점 8개를 뷰·투영 행렬로 클립 공간에 보낸 뒤, 6개 평면 중 하나라도 8개 모두 바깥이면 이 청크를 그리지 않습니다. 큐브마다가 아니라 청크마다 한 번만 판정해서 판정 비용도 줄였습니다.',
    blocks: [{
      label: 'CStaticCubeMap::Is_Visible', file: 'Client/Code/CStaticCubeMap.cpp', lines: '371–400', lang: 'cpp',
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
        D3DXVec3Transform(&q, &vec, &matrixOut);
        bVertexOut[0] &= q.x < -q.w;        //왼
        bVertexOut[1] &= q.x > q.w;         //오
        bVertexOut[2] &= q.y < -q.w;        //아래
        bVertexOut[3] &= q.y > q.w;         //위
        bVertexOut[4] &= q.z < 0.f;         //near 앞
        bVertexOut[5] &= q.z > q.w;         //far 너머
    }

    for (bool outside : bVertexOut)
        if (outside)
            return false;       // 청크 꼭짓점 8개가 모두 바깥이면 제외

    return true;
}`
    }]
  },

  kirby: {
    title: '능력 객체 전환',
    note: '능력별 커비 객체를 미리 만들어 두고, 변신할 때는 새로 생성하지 않고 활성 플래그만 바꿉니다. 이전 객체의 위치·HP·바라보는 방향을 새 객체로 넘기고, 이전 객체는 비활성화해서 갱신·렌더링 대상에서 빠지게 합니다.',
    blocks: [{
      label: 'CSceneMgr::Set_Player', file: 'DefaultWindow/CSceneMgr.cpp', lines: '416–472', lang: 'cpp',
      code: String.raw`void CSceneMgr::Set_Player(KIRBY_ABILITY ePlayerID)
{
	if (m_eCurPlayerID == ePlayerID) return;
	if (ePlayerID != KIRBY_ABILITY::ABILITY_NORMAL)
	{
		// … 변신 효과음·이펙트 재생, 1초 연출 정지, 남아 있는 능력 별 정리 (생략)
	}

	CUIMgr::Get_Instance()->SetPlayerAbilityUI(ePlayerID);

	CObj* prePlayer = Get_Player();

	m_eCurPlayerID = ePlayerID;

	CObj* curPlayer = Get_Player();

	curPlayer->SetObjIsUnused(false);
	curPlayer->SetPos(prePlayer->GetInfo()->fX, prePlayer->GetInfo()->fY);

	prePlayer->SetObjIsUnused(true);
	prePlayer->SetPos(-100, -100);

	CPlayer* pPlayer = dynamic_cast<CPlayer*>(curPlayer);

	dynamic_cast<CPlayer*>(prePlayer)->GetStatus(pPlayer->GetHpPoint(), pPlayer->GetFaceDirPoint());

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

  popcorn: {
    title: 'Destroy() 지연 삭제 문제 — 수정 전후',
    note: '수정 전에는 Destroy 직후 같은 프레임에서 GetComponent로 카드를 찾아, 곧 사라질 이전 카드가 초기화됐습니다. 수정 후에는 새 카드가 Init() 중 SetEffect(this)로 자기 자신을 슬롯에 등록하고, 슬롯은 그 캐시 참조로 효과를 실행합니다. 이전 카드는 선택 시점에 미리 삭제합니다.',
    commit: 'https://github.com/GniNeSt/POPCORN_DEMO/commit/72e8fb9483c361281fbfeb98da16898f38ea380c',
    blocks: [{
      label: '수정 전 — ItemManager.SetItem (커밋 67c2186)', file: 'Assets/2.Scripts/Manager/ItemManager.cs', lines: '66–85', lang: 'csharp',
      code: String.raw`foreach (var i in _ico)
{
    // … 카드 종류(Type) 결정 (생략)
    ItemCardCtrlObj icco = i.transform.GetChild(0).gameObject.GetComponent<ItemCardCtrlObj>();
    if(icco != null)
    {
        Destroy(icco);   // ▶ 실제 삭제는 프레임 끝
    }

    i.transform.GetChild(0).gameObject.AddComponent(itemName);
    i.transform.GetChild(0).GetComponent<ItemCardCtrlObj>().Init();   // ▶ 아직 남아 있는 이전 카드를 찾음

    i.AppearCard();
    i.transform.GetChild(0).GetChild(0).GetChild(3).gameObject.SetActive(true);
}`
    }, {
      label: '수정 후 — ItemCtrlObj (커밋 72e8fb9)', file: 'Assets/2.Scripts/Object/ItemCtrlObj.cs', lines: '14–36', lang: 'csharp',
      code: String.raw`[SerializeField] ItemCardCtrlObj _icco;
public void OnClick()
{
    _icco.CardEffect();          // ▶ GetComponent 대신 캐시 참조

    transform.parent.GetComponent<ItemManager>().ItemSelect();
}
public void SetItem(System.Type type)
{
    transform.GetChild(0).gameObject.AddComponent(type);
    transform.GetChild(0).GetComponent<ItemCardCtrlObj>().Init();
    transform.GetChild(0).GetChild(0).GetChild(3).gameObject.SetActive(true);
    AppearCard();
}
public void SetEffect(ItemCardCtrlObj obj)   // ▶ 새 카드가 Init() 중 SetEffect(this)로 등록
{
    _icco = obj;
}
public void RemoveCard()
{
    Destroy(_icco);              // ▶ 카드를 고른 시점에 미리 삭제
    GetComponent<Animator>().Play("ItemCardRemove");
}`
    }]
  },

  lyria: {
    title: '흙 마법서 규칙 판정',
    note: '각 책은 오른쪽으로 2D 레이(RaycastAll)를 쏴서 범위 안의 책을 검사합니다. 흙 마법서는 범위 안의 불·물 마법서 개수가 같아야 하고, 어긋나면 위반한 규칙 번호(ErrorNum)를 남겨 UI가 해당 규칙을 빨간색으로 표시합니다.',
    blocks: [{
      label: 'OrganizeBookCtrl.ErrorCheck — 흙(Ocher) 분기', file: 'Assets/2.Scripts/OrganizeBookCtrl.cs', lines: '137–169', lang: 'csharp',
      code: String.raw`case BookType.Ocher:
    if (!_sm.IsOnStage)
        return true;
    // … 주석 처리된 이전 코드 (생략)
    countR = 0; countB = 0;
    foreach (RaycastHit2D hit in hits)
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
    if (countR != countB)
    {
        //Debug.Log("OcherError!!!");
        _error = true;
        _errorBook = this;
        ErrorNum = 1;
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
      label: 'IMinigame · IMinigameResult', file: 'Scripts/Minigame/IMinigame.cs · IMinigameResult.cs', lines: '전체', lang: 'csharp',
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
}
public interface IMinigameResult
{
    bool WasSuccess { get; }
}`
    }, {
      label: 'MinigameDirector.CoRunMinigame — 결과 판정부', file: 'Scripts/Minigame/MinigameDirector.cs', lines: '225–242', lang: 'csharp',
      code: String.raw`// 결과 판정
MinigameOutcome outcome;
if (entry.logic is IMinigameOutcomeProvider op)
{
    outcome = op.Outcome;
    if (!finished && t >= playMaxSeconds) outcome = MinigameOutcome.Lose; // 타임아웃은 패배
    success = (outcome == MinigameOutcome.Win);
}
else if (entry.logic is IMinigameResult r)
{
    success = finished && r.WasSuccess;
    outcome = success ? MinigameOutcome.Win : MinigameOutcome.Lose;
}
else
{
    success = finished; // 끝냈으면 승리, 아니면 패배
    outcome = success ? MinigameOutcome.Win : MinigameOutcome.Lose;
}`
    }]
  }
};
