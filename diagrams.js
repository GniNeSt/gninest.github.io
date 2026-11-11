/*
 * 구조 다이어그램 (SVG) — 사이트 상세 창과 PDF가 함께 씁니다.
 * 각 다이어그램은 원본 코드의 실제 호출 순서·분기를 옮긴 것입니다(근거 파일은 항목마다 주석).
 * 색·글꼴은 diagrams.css에서 정합니다.
 */
const DIAGRAMS = (() => {
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let uid = 0;

  // 여러 줄 텍스트. 각 줄은 문자열 또는 [문자열, 클래스]
  const text = (x, y, lines, cls = '', anchor = 'middle', lh = 14) =>
    lines.map((l, i) => {
      let [t, c] = Array.isArray(l) ? l : [l, ''];
      // 한글이 섞인 코드 글자는 고정폭 대신 본문 글꼴(굵게)로: 고정폭 한글은 간격이 벌어져 보임
      if (/[\u3131-\uD79D]/.test(t)) { c = c.replace('mono', 'kcode'); cls = cls.replace('mono', 'kcode'); }
      return '<text x="' + x + '" y="' + (y + i * lh) + '" text-anchor="' + anchor + '" class="' + (cls + ' ' + c).trim() + '">' + esc(t) + '</text>';
    }).join('');
  // 상자 + 가운데 정렬 글자
  const box = (x, y, w, h, lines, cls = '') => {
    const n = lines.length, lh = 14, ty = y + h / 2 - (n - 1) * lh / 2 + 4;
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" class="b ' + cls + '"/>' + text(x + w / 2, ty, lines, 't ' + cls, 'middle', lh);
  };
  // 꺾은선 화살표 (pts: [[x,y], ...])
  const arrow = (pts, label, lx, ly, cls = '') =>
    '<polyline points="' + pts.map(p => p.join(',')).join(' ') + '" class="a ' + cls + '" marker-end="url(#m' + uid + ')"/>' +
    (label ? text(lx, ly, [label], 'al', 'middle') : '');
  const svg = (w, h, title, body) =>
    '<svg class="dg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(title) + '" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><marker id="m' + uid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>' + body + '</svg>';
  const make = (fn) => () => { uid++; return fn(); };

  return {
    /* HelloDita — MinigameDirector.CoRunMinigame 흐름 (Scripts/Minigame/MinigameDirector.cs) */
    hellodita: make(() => {
      const X = 8, W = 196, C = X + W / 2;
      const steps = [
        [8, 28, ['진입 연출 · 조작 안내']],
        [50, 28, [['StartGame()', 'mono']]],
        [92, 40, ['제한 시간 동안 플레이', ['Finished 이벤트 또는 시간 초과', 'sm']]],
        [146, 40, ['결과 판정', ['결과 인터페이스 종류로 분기', 'sm']]],
        [200, 28, ['정리 — AbortGame · 화면 해제']],
        [242, 28, ['결과 이벤트 → 스탯 · 업적 반영']]
      ];
      let b = steps.map(s => box(X, s[0], W, s[1], s[2])).join('');
      for (let i = 0; i < steps.length - 1; i++) b += arrow([[C, steps[i][0] + steps[i][1]], [C, steps[i + 1][0]]]);
      b += box(222, 8, 110, 214, [], 'soft') + text(277, 30, ['미니게임 6종'], 't strong') + text(277, 46, ['IMinigame 구현'], 'sm') +
        text(277, 74, ['StackTheBlocks', 'CatchTheFruit', 'ChamChamCham', 'ObstacleRunner', 'SlotMachine', 'TimingAngle'], 'mono sm', 'middle', 18) +
        text(277, 196, ['인스펙터 목록에 등록'], 'sm');
      b += arrow([[222, 64], [204, 64]], '', 0, 0, 'dash') + text(213, 84, ['선택'], 'al');
      b += '<rect x="8" y="282" width="324" height="26" rx="3" class="b accent"/>' + text(170, 299, ['새 미니게임 = IMinigame 구현 + 목록 등록 · 디렉터 코드는 수정 없음'], 't accent sm');
      return svg(340, 316, 'HelloDita 미니게임 실행 흐름', b);
    }),

    /* 리리아 — 배치 완료 후 규칙 검사 (Manager/GameManager.cs, OrganizeBookCtrl.cs) */
    lyria: make(() => {
      let b = box(8, 8, 324, 28, ['모든 책을 놓으면 GameManager.ErrorCheck()']) +
        box(8, 50, 324, 28, ['책마다 오른쪽으로 RaycastAll → 범위 안의 책']) +
        box(8, 92, 324, 28, ['책 종류별 원소 규칙과 비교']);
      b += arrow([[170, 36], [170, 50]]) + arrow([[170, 78], [170, 92]]);
      const rules = [['불', '물·풀과', '인접 금지', 'fire'], ['물', '불과', '인접 금지', 'water'], ['풀', '물 또는 흙이', '있어야 함', 'grass'], ['흙', '불 개수 =', '물 개수', 'earth']];
      rules.forEach((r, i) => {
        const x = 8 + i * 83;
        b += '<rect x="' + x + '" y="134" width="75" height="50" rx="3" class="b"/><rect x="' + x + '" y="134" width="4" height="50" class="el ' + r[3] + '"/>' +
          text(x + 40, 150, [r[0]], 't strong') + text(x + 40, 165, [r[1], r[2]], 'sm', 'middle', 12);
      });
      b += arrow([[170, 120], [170, 134]]);
      b += box(95, 200, 150, 28, ['위반한 책이 있나?'], 'strong');
      b += arrow([[170, 184], [170, 200]]);
      b += box(8, 250, 150, 40, ['없음', ['→ 다음 단계로', 'sm']]) + box(182, 250, 150, 40, ['있음 → 그 규칙을 빨간색', ['NPC 대사로 다시 시도 안내', 'sm']], 'warn');
      b += arrow([[120, 228], [83, 250]]) + arrow([[220, 228], [257, 250]]);
      return svg(340, 298, '리리아 규칙 검사 흐름', b);
    }),

    /* 커비 — 능력 객체 전환 (DefaultWindow/CSceneMgr.cpp Set_Player) */
    kirbyAbility: make(() => {
      let b = text(170, 14, ['능력별 커비 객체를 미리 만들어 둠 (하나만 활성)'], 'sm');
      [['일반', 0], ['닌자', 0], ['버블', 1], ['토네이도', 0]].forEach((k, i) => {
        b += box(8 + i * 83, 22, 75, 36, [k[0], [k[1] ? '활성' : 'Unused', 'sm']], k[1] ? 'accent' : 'dim');
      });
      const steps = [
        [76, ['Set_Player(새 능력) — 같은 능력이면 종료']],
        [116, ['새 객체 활성 · 이전 객체 위치로 이동']],
        [156, ['이전 객체 비활성 · 화면 밖으로']],
        [196, ['이전 객체의 HP · 방향을 새 객체로 복사']]
      ];
      steps.forEach((s, i) => { b += box(8, s[0], 324, 28, s[1]); if (i) b += arrow([[170, steps[i - 1][0] + 28], [170, s[0]]]); });
      b += text(170, 242, ['객체를 새로 만들지 않아 변신할 때 생성·해제 비용이 없음'], 'sm');
      return svg(340, 250, '커비 능력 객체 전환', b);
    }),

    /* 커비 — 보스 도팡 상태 전이 (DefaultWindow/CMonster_Daroach.cpp, .h m_fPatternTime) */
    kirbyBoss: make(() => {
      let b = box(100, 8, 160, 30, ['대기 — 중앙으로 (3초)']) +
        box(80, 54, 200, 30, ['다음 패턴 무작위 · 빔은 제외'], 'strong');
      b += arrow([[180, 38], [180, 54]]);
      const col = [[20, '빔 예고 (2초)', '플레이어 높이 추적'], [132, '폭탄', '3프레임째 생성'], [244, '별', '5프레임째 3방향']];
      col.forEach(c => { b += box(c[0], 104, 100, 42, [c[1], [c[2], 'sm']]); });
      b += arrow([[120, 84], [70, 104]]) + arrow([[180, 84], [182, 104]]) + arrow([[240, 84], [294, 104]]);
      b += box(20, 168, 100, 42, ['빔 발사', ['약 3.5초', 'sm']], 'warn') + arrow([[70, 146], [70, 168]]);
      b += box(150, 168, 194, 42, ['순간이동 × 3', ['5개 지점 중 무작위', 'sm']]);
      b += arrow([[182, 146], [182, 168]]) + arrow([[294, 146], [294, 168]]);
      b += arrow([[20, 189], [8, 189], [8, 23], [100, 23]], '', 0, 0) + text(14, 17, ['빔 종료 후'], 'al', 'start');
      b += arrow([[344, 189], [354, 189], [354, 69], [280, 69]]) + text(350, 63, ['다시 선택'], 'al', 'end');
      b += text(180, 232, ['시간 값은 행동별 지속 시간 표(m_fPatternTime)에서 읽음'], 'sm');
      return svg(362, 240, '보스 도팡 패턴 상태 전이', b);
    }),

    /* PopCorn — Destroy() 지연 삭제와 수정 전후 (ItemManager.cs @67c2186, ItemCtrlObj.cs @72e8fb9) */
    popcorn: make(() => {
      const step = (x, y, w, code, desc, cls = '') => box(x, y, w, 40, [[code, 'mono'], [desc, 'sm']], cls);
      const frame = (x, y, w, h, label, cls = '') => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" class="f ' + cls + '"/>' + text(x + 10, y + 16, [label], 'fl', 'start');
      let b = text(10, 62, ['수정 전'], 'lane', 'start');
      b += frame(90, 14, 640, 86, '프레임 N — 카드 교체') + frame(744, 14, 246, 86, '프레임 N이 끝날 때', 'end');
      b += step(104, 46, 190, 'Destroy(이전 카드)', '삭제 예약만 됨') + step(318, 46, 170, 'AddComponent(새 카드)', '새 카드 추가') +
        step(512, 46, 204, 'GetComponent().Init()', '아직 남은 이전 카드가 초기화', 'warn') + step(758, 46, 218, '이전 카드 실제 파괴', '새 카드는 초기화 안 된 채 남음', 'warn');
      b += arrow([[294, 66], [318, 66]]) + arrow([[488, 66], [512, 66]]) + arrow([[716, 66], [758, 66]]);
      b += text(10, 172, ['수정 후'], 'lane', 'start');
      b += frame(90, 124, 250, 86, '카드를 고른 프레임') + frame(354, 124, 150, 86, '프레임 끝', 'end') + frame(518, 124, 302, 86, '새 카드를 놓는 프레임') + frame(834, 124, 156, 86, '클릭할 때');
      b += step(104, 156, 222, 'RemoveCard()', 'Destroy(이전 카드)를 미리 호출') + step(368, 156, 122, '이전 카드 파괴', '정리 끝') +
        step(532, 156, 112, 'AddComponent', '→ Init()') + step(662, 156, 144, 'SetEffect(this)', '슬롯에 자신을 등록', 'ok') + step(848, 156, 128, 'OnClick()', '캐시 참조로 실행', 'ok');
      b += arrow([[326, 176], [368, 176]]) + arrow([[490, 176], [532, 176]]) + arrow([[644, 176], [662, 176]]) + arrow([[806, 176], [848, 176]]);
      b += arrow([[90, 230], [990, 230]], '', 0, 0, 'time') + text(540, 248, ['시간 →   Unity의 Destroy()는 호출한 프레임이 끝날 때 실제로 파괴됨'], 'sm');
      return svg(1000, 256, 'PopCorn Destroy 지연 삭제 프레임 흐름', b);
    }),

    /* 메탈슬러그 — 상·하체 분리 (Scripts/Player/PlayerController.cs Update, PlatformerJump.cs) */
    metal: make(() => {
      let b = box(4, 100, 104, 50, ['입력', ['이동·점프·조준·공격', 'sm']]) +
        box(122, 100, 128, 50, [['PlayerController', 'mono'], ['Update()', 'sm mono']]);
      b += arrow([[108, 125], [122, 125]]);
      b += box(278, 10, 234, 58, ['하체 — LBAnimator', ['Run · JumpL', 'mono sm'], ['이동 · 점프만 담당', 'sm']]);
      b += '<rect x="278" y="88" width="234" height="122" rx="3" class="b"/>' + text(395, 106, ['상체 — BustAnimator'], 't strong') +
        text(290, 126, [['Run · onJump', 'mono'], ['Over / DownShot', 'mono'], ['Shoot · Diagonal', 'mono'], ['CloseAttack_1', 'mono']], 'sm', 'start', 20) +
        text(500, 126, ['하체와 같은 이동 상태', '위 · 아래 조준', '사격 · 방향 전환', '근접 공격'], 'sm', 'end', 20);
      b += arrow([[250, 112], [264, 112], [264, 39], [278, 39]]) + arrow([[250, 136], [278, 136]]);
      b += box(122, 172, 128, 52, ['공격 키', ['CircleCast(반경 1.2)', 'mono sm'], ['적 있음: 근접 · 없음: 사격', 'sm']], 'strong');
      b += arrow([[186, 150], [186, 172]]) + arrow([[250, 198], [278, 198]]);
      b += text(260, 248, ['두 Animator가 각자 상태를 가지고 스프라이트를 겹쳐 그림 → "달리며 위로 사격" 같은 조합을 상태 수를 곱하지 않고 표현'], 'sm');
      return svg(520, 258, '메탈슬러그 상·하체 분리 애니메이션', b);
    })
  };
})();
