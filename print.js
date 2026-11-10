/*
 * 기술 포트폴리오(PDF) 렌더링 — data.js·excerpts.js의 내용을 A4 가로 페이지로 배치합니다.
 * 내용을 고칠 때는 data.js / excerpts.js만 고치면 사이트와 PDF에 함께 반영됩니다.
 * 쪽 구성: 표지 → 한눈에 보기 → 작품별(소개 · 장면/문제 해결 · 코드) → 그 밖의 작품 → 교육·연락처
 */
const SITE = 'https://gninest.github.io/';
const SITE_SHORT = 'gninest.github.io';
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ordered = [...projects].sort((a, b) => a.order - b.order);
const mainProjects = ordered.filter(p => p.excerpt || p.story);
const minorProjects = ordered.filter(p => !p.excerpt && !p.story);
let pageNo = 0;

const page = (cls, inner, label) => {
  pageNo++;
  return '<section class="page ' + cls + '">' + inner +
    '<footer class="pfoot"><span>정효준 · 게임 클라이언트 프로그래머 기술 포트폴리오</span>' +
    '<span>' + (label ? esc(label) + '<i>·</i>' : '') + '<a href="' + SITE + '">' + SITE_SHORT + '</a><b>' + pageNo + '</b></span></footer></section>';
};
const link = (href, text) => '<a href="' + esc(href) + '">' + esc(text) + '</a>';
const plain = (href, inner) => '<a class="plain" href="' + esc(href) + '">' + inner + '</a>';
const tags = t => '<div class="tags">' + t.map(x => '<span>' + esc(x) + '</span>').join('') + '</div>';
const meta = p => '<dl class="meta">' +
  [['기간', p.period], ['팀', p.team], ['플랫폼', p.platform], ['담당', p.role]].filter(r => r[1]).map(r => '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl>';
const tldr = p => p.tldr ? '<dl class="tldr">' + p.tldr.map(t => '<dt>' + esc(t[0]) + '</dt><dd>' + esc(t[1]) + '</dd>').join('') + '</dl>' : '';
const linkRow = p => '<p class="links">' + link(SITE + '#' + p.id, '사이트에서 자세히 보기 ↗') +
  p.links.map(l => '<i>·</i>' + link(l[1], l[0] + ' ↗')).join('') + '</p>';
const features = list => '<ol class="features">' + list.map(f =>
  '<li><strong>' + esc(f[0]) + '</strong><span>' + esc(f[1]) + '</span></li>').join('') + '</ol>';
const fig = (src, cap, cls) => '<figure class="' + (cls || '') + '"><div class="frame"><img src="' + esc(src) + '" alt=""></div>' + (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure>';
const numCap = (i, title, text) => '<b class="fnum">' + String(i).padStart(2, '0') + '</b><strong>' + esc(title) + '</strong>' + (text ? '<span>' + esc(text) + '</span>' : '');
const head = (eyebrow, title, slim) => '<header class="ph' + (slim ? ' slim' : '') + '"><p class="eyebrow">' + eyebrow + '</p><h2>' + esc(title) + '</h2></header>';
const textBlock = (h, t) => t ? '<h3>' + h + '</h3><p>' + esc(t) + '</p>' : '';
const qrBox = (id, caption) => plain(SITE, '<span class="qr-wrap"><span class="qr" id="' + id + '"></span><span class="qr-cap">' + caption + '</span></span>');
const QR_CAPTION = '사이트 바로 가기<small>플레이 영상과 상세 설명</small>';

/* 1. 표지 */
const coverShots = [['assets/hellodita-title.jpg', 'HelloDita'], ['assets/delver-quest.jpg', 'Delver 모작'], ['assets/lyria-rules.jpg', '리리아와 마법도서관'], ['assets/popcorn-cards.jpg', 'PopCorn']];
let html = page('cover',
  '<div class="cover-top"><div class="cover-l">' +
    '<p class="eyebrow">Game Client Programmer · Technical Portfolio</p>' +
    '<h1>정효준<span>Gninest</span></h1>' +
    '<p class="lead">규칙을 구현하고,<br>플레이로 연결합니다.</p>' +
    '<p class="sub">Unity/C# · C++/DirectX 9로 게임 7편을 만들었고,<br>팀 프로젝트 두 편이 공모전에서 입상했습니다.</p>' +
  '</div>' +
  '<div class="cover-shots">' + coverShots.map((s, i) => '<figure class="' + (i ? '' : 'main') + '"><div class="frame"><img src="' + s[0] + '" alt=""></div><figcaption>' + s[1] + '</figcaption></figure>').join('') + '</div></div>' +
  '<div class="cover-bar"><dl class="contact">' +
    '<div><dt>이메일</dt><dd>' + link('mailto:' + CONTACT.email, CONTACT.email) + '</dd></div>' +
    '<div><dt>포트폴리오</dt><dd>' + link(SITE, SITE_SHORT) + '</dd></div>' +
    '<div><dt>YouTube</dt><dd>' + link('https://youtube.com/@gninest1641', 'youtube.com/@gninest1641') + '</dd></div></dl>' +
    plain(SITE, '<span class="qr-inline"><span class="qr-cap">사이트 바로 가기<small>플레이 영상과 상세 설명</small></span><span class="qr" id="qr"></span></span>') +
  '</div>');

/* 2. 한눈에 보기 */
html += page('overview',
  head('At a glance', '한눈에 보기') +
  '<div class="ov-top">' +
    '<section><h3>지원 분야</h3><p class="big">신입 게임 클라이언트 프로그래머</p><p>Unity/C# · C++/DirectX 9</p></section>' +
    '<section><h3>핵심 기술</h3><ul class="chips">' + ['Unity · C#', 'C++ · STL', 'DirectX 9', 'WinAPI', 'ImGui', 'Git · GitHub PR'].map(c => '<li>' + c + '</li>').join('') + '</ul></section>' +
    '<section><h3>대표 성과</h3><ol class="hl">' +
      '<li><b>HelloDita</b><span>2인 팀 리더 · 게임핑 10분게임 콘테스트 <em>3등</em></span></li>' +
      '<li><b>리리아와 마법도서관</b><span>프로그래밍 전담 · BUD 게임 콘테스트 <em>최우수상(2등)</em></span></li>' +
      '<li><b>Delver 모작</b><span>3인 팀 리더 · 청크 절두체 컬링으로 프레임 시간 <em>약 74% 단축</em></span></li></ol></section>' +
  '</div>' +
  '<h3 class="list-h">작품 목록</h3><table class="plist"><thead><tr><th>작품</th><th>기간</th><th>형태</th><th>기술</th><th>이 문서에서 볼 내용</th><th class="pg">쪽</th></tr></thead><tbody>' +
    ordered.map(p => '<tr><td>' + link(SITE + '#' + p.id, p.title) + (p.award ? '<small>' + esc(p.award.split(' · ')[0]) + '</small>' : '') + '</td>' +
      '<td class="nw">' + esc(p.period.replace(' (Git 기록 기준)', '')) + '</td><td class="nw">' + esc(p.team) + '</td><td class="nw">' + esc(p.tags.slice(0, 2).join(' · ')) + '</td>' +
      '<td>' + esc(p.excerpt ? (p.story ? '문제 해결 · ' : '') + '코드 — ' + [p.excerpt, ...(p.extraExcerpts || [])].map(e => e.title.replace(/ — .*/, '').replace(/ \(.*\)/, '')).join(' · ') : p.subtitle) + '</td><td class="pg" data-for="' + p.id + '"></td></tr>').join('') +
  '</tbody></table>');

/* 프레임 흐름 도식 (PopCorn 문제 해결 쪽) — 수정 전후 코드(excerpts.js)의 호출 순서를 그대로 옮긴 것 */
const step = (t, d, cls) => '<li class="' + (cls || '') + '"><b>' + t + '</b>' + (d ? '<span>' + d + '</span>' : '') + '</li>';
const TIMELINES = {
  popcorn: '<div class="timeline"><h3>프레임 흐름</h3>' +
    '<div class="lane"><p class="lane-h">수정 전</p><div class="frame-box"><p>같은 프레임 안</p><ol>' +
      step('<code>Destroy</code>(이전 카드)', '삭제 예약만 됨') + step('<code>AddComponent</code>(새 카드)') + step('<code>GetComponent().Init()</code>', '아직 남은 이전 카드가 반환·초기화', 'bad') + '</ol></div>' +
      '<div class="frame-end"><p>프레임 끝</p><ol>' + step('이전 카드 삭제', '새 카드는 초기화되지 않은 채 남음', 'bad') + '</ol></div></div>' +
    '<div class="lane"><p class="lane-h">수정 후</p><div class="frame-box"><p>카드를 고른 프레임</p><ol>' +
      step('<code>RemoveCard()</code>', 'Destroy(이전 카드)를 미리 호출') + '</ol></div>' +
      '<div class="frame-box"><p>새 카드를 놓는 프레임</p><ol>' + step('<code>AddComponent</code> → <code>Init()</code>') + step('<code>SetEffect(this)</code>', '새 카드가 슬롯에 자신을 등록', 'good') + '</ol></div>' +
      '<div class="frame-box"><p>클릭할 때</p><ol>' + step('<code>OnClick()</code>', '캐시 참조로 효과 실행', 'good') + '</ol></div></div></div>'
};

/* 3. 작품별 페이지 */
const pageOf = {};
const LEFT_BLOCKS = { hellodita: [1] };   // 코드 쪽에서 왼쪽 열로 보낼 짧은 블록
mainProjects.forEach((p, idx) => {
  const no = '<b>' + String(idx + 1).padStart(2, '0') + '</b>';
  const sceneFeatures = p.features.filter(f => f[2] && f[2] !== p.image);
  const sceneFig = f => fig(f[2], numCap(p.features.indexOf(f) + 1, f[0], f[3]), 'scene');
  pageOf[p.id] = pageNo + 1;

  // 3-1. 소개
  html += page('pg-proj',
    '<header class="ph"><p class="eyebrow">' + no + esc(p.subtitle) + '</p><div class="title-row"><h2>' + esc(p.title) + '</h2>' + tags(p.tags) + '</div>' +
      (p.award ? '<p class="award">' + esc(p.award) + '</p>' : '') + '</header>' +
    '<div class="proj-grid"><div class="col-l"><div class="frame hero"><img src="' + esc(p.image) + '" alt=""></div>' + tldr(p) + meta(p) + linkRow(p) + '</div>' +
    '<div class="col-r"><h3>핵심 구현</h3>' + features(p.features) + '</div></div>', p.title);

  // 3-2. 장면 / 문제 해결
  let usedText = false, usedScenes = false;
  const story4 = s => [['문제', s.problem], ['원인', s.cause], ['해결', s.fix], ['검증', s.result]];
  if (p.story && p.story.images.length) {
    // 측정 비교 이미지가 있는 문제 해결 (Delver)
    const s = p.story, imgs = s.images;
    const metric = c => { const m = c.split(' · '); return '<span class="m-k">' + esc(m[0]) + '</span><span class="m-v">' + esc(m[1] || '') + '</span>'; };
    html += page('pg-story',
      head(no + esc(p.title), '문제 해결 — 청크 단위 절두체 컬링', true) +
      '<div class="compare">' + fig(imgs[0][0], metric(imgs[0][1]), 'cmp') +
        '<div class="arrow"><span>→</span><b>약 74%</b><small>프레임 시간 단축</small></div>' + fig(imgs[1][0], metric(imgs[1][1]), 'cmp good') + '</div>' +
      '<dl class="story4">' + story4(s).map(r => '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>').join('') + '</dl>', p.title);
  } else if (p.story) {
    // 이미지 없는 문제 해결 (PopCorn) — 관련 장면과 함께
    const s = p.story, f = sceneFeatures[0];
    usedScenes = true;
    html += page('pg-story',
      head(no + esc(p.title), '문제 해결 — Destroy() 지연 삭제', true) +
      '<div class="story-side">' + (f ? sceneFig(f) : '') +
      '<dl class="story">' + story4(s).map(r => '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl></div>' + (TIMELINES[p.id] || ''), p.title);
  } else if (sceneFeatures.length >= 2 || p.evidenceImages.length) {
    // 구현 장면 (HelloDita) — 장면 2장 크게 + 증빙과 협업
    usedText = usedScenes = true;
    html += page('pg-scenes',
      head(no + esc(p.title), '구현 장면', true) +
      '<div class="scene-grid">' + sceneFeatures.slice(0, 2).map(sceneFig).join('') + '</div>' +
      '<div class="scene-foot">' + (p.evidenceImages[0] ? fig(p.evidenceImages[0][0], '<strong>결과 증빙</strong><span>' + esc(p.evidenceImages[0][1]) + '</span>', 'evidence') : '') +
      '<div class="scene-text">' + textBlock('역할과 협업', p.collaboration) + textBlock('개발 방식', p.method) + '</div></div>', p.title);
  }

  // 3-3. 코드
  const x = p.excerpt;
  if (!x) return;
  const notes = [];
  const rendered = x.blocks.map(b => { const from = notes.length, h = CODEVIEW.block(b, notes); return { h, from, notes: notes.slice(from) }; });
  const leftIdx = LEFT_BLOCKS[p.id] || [];
  const side = (!usedText ? textBlock('역할과 협업', p.collaboration) + textBlock('개발 방식', p.method) : '') +
    (!usedScenes && sceneFeatures[0] ? '<div class="side-shot">' + sceneFig(sceneFeatures[0]) + '</div>' : '');
  const commit = x.commit ? '<p class="commit">' + link(x.commit, 'GitHub에서 수정 커밋 보기 ↗') + '</p>' : '';
  if (x.blocks.length === 2 && p.story) {
    // 수정 전/후 비교 (PopCorn): 설명은 위, 두 코드를 나란히
    html += page('pg-code pair',
      head(no + esc(p.title), '코드 — 수정 전과 후', true) +
      '<p class="xnote wide">' + esc(x.note) + '</p>' +
      '<div class="pair-grid">' + rendered.map(r => '<div>' + r.h + CODEVIEW.noteList(r.notes, r.from) + '</div>').join('') + '</div>' + commit, p.title);
  } else {
    html += codePage(p, no, x, side + commit);
  }
  // 추가 코드 발췌(예: 커비 보스 패턴)는 쪽을 하나씩 더 만듭니다.
  (p.extraExcerpts || []).forEach(ex => { html += codePage(p, no, ex, ''); });
});

/* 코드 쪽: 왼쪽은 설명·번호 설명·짧은 블록, 오른쪽은 긴 블록 */
function codePage(p, no, x, sideHTML) {
  const notes = [];
  const rendered = x.blocks.map(b => CODEVIEW.block(b, notes));
  const leftIdx = x.leftBlocks || LEFT_BLOCKS[p.id] || [];
  return page('pg-code',
    head(no + esc(p.title), '코드 — ' + x.title.replace(/ — .*/, ''), true) +
    '<div class="code-grid"><div class="col-l"><p class="xnote">' + esc(x.note) + '</p>' + CODEVIEW.noteList(notes) +
      rendered.filter((h, i) => leftIdx.includes(i)).join('') + sideHTML + '</div>' +
    '<div class="col-r">' + rendered.filter((h, i) => !leftIdx.includes(i)).join('') + '</div></div>', p.title);
}

/* 4. 그 밖의 작품: 한 쪽에 두 작품 */
for (let i = 0; i < minorProjects.length; i += 2) {
  const pair = minorProjects.slice(i, i + 2);
  pair.forEach(p => { pageOf[p.id] = pageNo + 1; });
  html += page('minor',
    head('More works', '그 밖의 작품', true) + '<div class="minor-grid">' +
    pair.map(p => '<article><div class="frame"><img src="' + esc(p.image) + '" alt=""></div><h3>' + esc(p.title) + '<small>' + esc(p.subtitle) + '</small></h3>' + tags(p.tags) +
      meta(p) + features(p.features) + linkRow(p) + '</article>').join('') + '</div>');
}

/* 5. 교육·자격·연락 */
html += page('closing',
  head('About', '교육 · 자격 · 연락처') +
  '<div class="closing-grid"><dl class="about"><dt>교육</dt><dd>쥬신게임아카데미 C++/DirectX 과정<span class="dim">2026.04 – 재학 중</span><br>SBS아카데미게임학원 Unity 게임 프로그래밍 과정<span class="dim">2023.09 – 2024.09</span></dd>' +
  '<dt>학력</dt><dd>한신대학교 컴퓨터공학·수리금융 복수전공 졸업<span class="dim">2024.02</span></dd>' +
  '<dt>자격</dt><dd>정보처리기사<span class="dim">2025.09</span></dd>' +
  '<dt>이메일</dt><dd>' + link('mailto:' + CONTACT.email, CONTACT.email) + '</dd>' +
  '<dt>사이트</dt><dd>' + link(SITE, SITE_SHORT) + '<span class="dim">작품별 플레이 영상과 상세 설명</span></dd>' +
  '<dt>영상</dt><dd>' + link('https://youtube.com/@gninest1641', 'youtube.com/@gninest1641') + '</dd>' +
  '<dt>itch.io</dt><dd>' + link('https://gninest.itch.io', 'gninest.itch.io') + '</dd></dl>' +
  '<div class="closing-r">' + qrBox('qr2', QR_CAPTION) + '</div></div>' +
  '<p class="note">모작(별의 커비, 메탈슬러그, Delver)의 원작 리소스와 외부 에셋 저작권은 각 원저작자에게 있습니다.</p>');

document.getElementById('book').innerHTML = html;
// 가운뎃점(·) 앞뒤에서 줄이 바뀌지 않게 단어 결합 문자(U+2060)를 넣습니다. 코드 창 안은 건드리지 않습니다.
const walker = document.createTreeWalker(document.getElementById('book'), NodeFilter.SHOW_TEXT);
for (let t; (t = walker.nextNode());) if (t.nodeValue.includes('·') && !t.parentElement.closest('.cv-win')) t.nodeValue = t.nodeValue.replace(/(\S)·(?=\S)/g, '$1⁠·⁠');
// 2:1보다 넓은 이미지(커비 등)는 16:9 틀 대신 원본 비율 틀을 써서 위아래 검은 여백을 없앱니다.
document.querySelectorAll('.frame img').forEach(img => {
  const fit = () => { if (img.naturalWidth / img.naturalHeight > 2) img.parentElement.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight; };
  img.complete ? fit() : img.addEventListener('load', fit);
});
document.querySelectorAll('.plist .pg[data-for]').forEach(td => { td.textContent = pageOf[td.dataset.for] || ''; });
if (window.QRCode) ['qr', 'qr2'].forEach(id => { const el = document.getElementById(id); if (el) new QRCode(el, { text: SITE, width: 240, height: 240, correctLevel: QRCode.CorrectLevel.M }); });
