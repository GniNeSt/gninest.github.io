/*
 * 기술 포트폴리오(PDF) 렌더링 — data.js·excerpts.js의 내용을 A4 가로 페이지로 배치합니다.
 * 내용을 고칠 때는 data.js / excerpts.js만 고치면 사이트와 PDF에 함께 반영됩니다.
 */
const SITE = 'https://gninest.github.io/';
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ordered = [...projects].sort((a, b) => a.order - b.order);
const mainProjects = ordered.filter(p => p.excerpt || p.story);     // 2쪽(소개 + 코드) 구성
const minorProjects = ordered.filter(p => !p.excerpt && !p.story);  // 반쪽 카드 구성
let pageNo = 0;

const page = (cls, inner, label) => {
  pageNo++;
  return '<section class="page ' + cls + '">' + inner +
    '<footer class="pfoot"><span>정효준 · 게임 클라이언트 프로그래머 기술 포트폴리오</span>' +
    '<span>' + (label ? esc(label) + ' · ' : '') + '<a href="' + SITE + '">' + SITE.replace('https://', '') + '</a> · ' + pageNo + '</span></footer></section>';
};
const link = (href, text) => '<a href="' + esc(href) + '">' + esc(text) + '</a>';
const tags = t => '<div class="tags">' + t.map(x => '<span>' + esc(x) + '</span>').join('') + '</div>';
const meta = p => '<dl class="meta">' +
  [['기간', p.period], ['팀', p.team], ['플랫폼', p.platform], ['담당', p.role]].filter(r => r[1]).map(r => '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl>';
const tldr = p => p.tldr ? '<dl class="tldr">' + p.tldr.map(t => '<dt>' + esc(t[0]) + '</dt><dd>' + esc(t[1]) + '</dd>').join('') + '</dl>' : '';
const linkRow = p => '<p class="links">' + link(SITE + '#' + p.id, '사이트에서 자세히 보기 ↗') +
  p.links.map(l => ' · ' + link(l[1], l[0] + ' ↗')).join('') + '</p>';
const features = (list, withShots) => '<ol class="features">' + list.map(f =>
  '<li><strong>' + esc(f[0]) + '</strong><span>' + esc(f[1]) + '</span></li>').join('') + '</ol>';
const shots = (list) => {
  const imgs = list.filter(f => f[2]).slice(0, 3);
  return imgs.length ? '<div class="shots">' + imgs.map(f => '<figure><img src="' + esc(f[2]) + '" alt="' + esc(f[3] || f[0]) + '"><figcaption>' + esc(f[3] || f[0]) + '</figcaption></figure>').join('') + '</div>' : '';
};
const xnote = x => x ? '<h3>코드 설명</h3><p class="xnote"><strong>' + esc(x.title) + '</strong> — ' + esc(x.note) + '</p>' : '';
const codeBlock = b => '<div class="code"><div class="code-h"><b>' + esc(b.label) + '</b><span>' + esc(b.file) + ' · ' + esc(b.lines) + '</span></div><pre><code>' + esc(b.code) + '</code></pre></div>';
const commitLink = x => x && x.commit ? '<p class="small">' + link(x.commit, 'GitHub 수정 커밋 ↗') + '</p>' : '';
const story = s => s ? '<dl class="story"><dt>문제</dt><dd>' + esc(s.problem) + '</dd><dt>원인</dt><dd>' + esc(s.cause) + '</dd><dt>해결</dt><dd>' + esc(s.fix) + '</dd><dt>검증</dt><dd>' + esc(s.result) + '</dd></dl>' +
  (s.images.length ? '<div class="shots two">' + s.images.map(i => '<figure><img src="' + esc(i[0]) + '" alt="' + esc(i[1]) + '"><figcaption>' + esc(i[1]) + '</figcaption></figure>').join('') + '</div>' : '') : '';

/* 1. 표지 */
let html = page('cover',
  '<div class="cover-l">' +
    '<p class="eyebrow">GAME CLIENT PROGRAMMER · TECHNICAL PORTFOLIO</p>' +
    '<h1>정효준 <span>Gninest</span></h1>' +
    '<p class="lead">규칙을 구현하고, 플레이로 연결합니다.</p>' +
    '<p class="sub">Unity/C# · C++/DirectX 9로 게임 7편을 만들었고, 팀 프로젝트 두 편이 공모전에서 입상했습니다.</p>' +
    '<dl class="contact"><dt>이메일</dt><dd>' + link('mailto:' + CONTACT.email, CONTACT.email) + '</dd>' +
    '<dt>포트폴리오 사이트</dt><dd>' + link(SITE, SITE) + '</dd>' +
    '<dt>YouTube</dt><dd>' + link('https://youtube.com/@gninest1641', 'youtube.com/@gninest1641') + '</dd></dl>' +
  '</div>' +
  '<div class="cover-r"><div id="qr"></div><p>QR · 사이트에서 플레이 영상과 상세 내용을 볼 수 있습니다</p></div>' +
  '<div class="cover-shots">' + ['assets/hellodita-feed.jpg', 'assets/delver-quest.jpg', 'assets/lyria-rules.jpg', 'assets/kirby-ability.jpg'].map(s => '<img src="' + s + '" alt="">').join('') + '</div>');

/* 2. 한눈에 보기 */
html += page('overview',
  '<header class="ph"><p class="eyebrow">AT A GLANCE</p><h2>한눈에 보기</h2></header>' +
  '<div class="ov-grid">' +
    '<div><h3>지원 분야</h3><p><strong>신입 게임 클라이언트 프로그래머</strong><br>Unity/C# · C++/DirectX 9</p>' +
    '<h3>핵심 기술</h3><ul class="chips">' + ['Unity · C#', 'C++ · STL', 'DirectX 9', 'WinAPI', 'ImGui', 'Git · GitHub PR'].map(c => '<li>' + c + '</li>').join('') + '</ul>' +
    '<h3>대표 성과</h3><ol class="hl">' +
      '<li><b>HelloDita</b> — 2인 팀 리더 · 게임핑 10분게임 콘테스트 <b>3등</b></li>' +
      '<li><b>리리아와 마법도서관</b> — 프로그래밍 전담 · BUD 게임 콘테스트 <b>최우수상(2등)</b></li>' +
      '<li><b>Delver 모작</b> — 3인 팀 리더 · 청크 절두체 컬링으로 프레임 시간 <b>약 74% 단축</b></li></ol></div>' +
    '<div><h3>작품 목록</h3><table class="plist"><thead><tr><th>작품</th><th>기간</th><th>형태</th><th>기술</th><th>쪽</th></tr></thead><tbody>' +
      ordered.map(p => '<tr><td>' + link(SITE + '#' + p.id, p.title) + (p.award ? '<br><small>' + esc(p.award.split(' · ')[0]) + '</small>' : '') + '</td><td>' + esc(p.period.replace(' (Git 기록 기준)', '')) + '</td><td>' + esc(p.team) + '</td><td>' + esc(p.tags.slice(0, 2).join(' · ')) + '</td><td class="pg" data-for="' + p.id + '"></td></tr>').join('') +
    '</tbody></table></div>' +
  '</div>');

/* 3. 대표·주요 작품: 소개 1쪽 + 코드·문제 해결 1쪽 */
const pageOf = {};
mainProjects.forEach(p => {
  pageOf[p.id] = pageNo + 1;
  html += page('proj',
    '<header class="ph"><p class="eyebrow">' + esc(p.subtitle) + '</p><h2>' + esc(p.title) + '</h2>' + tags(p.tags) +
      (p.award ? '<p class="award">' + esc(p.award) + '</p>' : '') + '</header>' +
    '<div class="proj-grid"><div class="col-l"><img class="hero" src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '">' + tldr(p) + linkRow(p) + '</div>' +
    '<div class="col-r">' + meta(p) + '<h3>핵심 구현</h3>' + features(p.features) + '</div></div>', p.title);
  const shotList = shots(p.features);
  const x = p.excerpt, blocks = x ? x.blocks : [];
  // 문제 해결 사례가 있고 코드 블록이 2개면(수정 전/후), 첫 블록은 왼쪽 열로 보내 한 쪽에 들어가게 합니다.
  const leftBlocks = p.story && blocks.length > 1 ? blocks.slice(0, 1) : [];
  const rightBlocks = blocks.slice(leftBlocks.length);
  const noteRight = rightBlocks.length <= 1; // 오른쪽에 여유가 있으면 코드 설명을 코드 위에 둡니다.
  const shotList2 = shots(p.features.filter(f => f[2]).slice(0, 2));
  html += page('proj code',
    '<header class="ph slim"><p class="eyebrow">' + esc(p.title) + '</p><h2>' + (p.story ? '문제 해결과 코드' : '구현 장면과 코드') + '</h2></header>' +
    '<div class="code-grid"><div class="col-l">' + (p.story ? story(p.story) : shotList2) + (noteRight ? '' : xnote(x)) + leftBlocks.map(codeBlock).join('') +
      (p.collaboration ? '<h3>역할과 협업</h3><p>' + esc(p.collaboration) + '</p>' : '') +
      (p.method ? '<h3>개발 방식</h3><p>' + esc(p.method) + '</p>' : '') +
      (p.evidenceImages.length ? '<div class="shots one">' + p.evidenceImages.map(i => '<figure><img src="' + esc(i[0]) + '" alt="' + esc(i[1]) + '"><figcaption>' + esc(i[1]) + '</figcaption></figure>').join('') + '</div>' : '') +
    '</div><div class="col-r">' + (noteRight ? xnote(x) : '') + rightBlocks.map(codeBlock).join('') + commitLink(x) + '</div></div>', p.title);
});

/* 4. 보조작: 한 쪽에 두 작품 */
for (let i = 0; i < minorProjects.length; i += 2) {
  const pair = minorProjects.slice(i, i + 2);
  pair.forEach((p, k) => { pageOf[p.id] = pageNo + 1; });
  html += page('minor',
    '<header class="ph slim"><p class="eyebrow">MORE WORKS</p><h2>그 밖의 작품</h2></header><div class="minor-grid">' +
    pair.map(p => '<article><img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '"><h3>' + esc(p.title) + ' <small>' + esc(p.subtitle) + '</small></h3>' + tags(p.tags) +
      meta(p) + features(p.features) + linkRow(p) + '</article>').join('') + '</div>');
}

/* 5. 교육·자격·연락 */
html += page('closing',
  '<header class="ph"><p class="eyebrow">ABOUT</p><h2>교육 · 자격 · 연락처</h2></header>' +
  '<dl class="about"><dt>교육</dt><dd>쥬신게임아카데미 C++/DirectX 과정 (2026.04 – 재학 중)<br>SBS아카데미게임학원 Unity 게임 프로그래밍 과정 (2023.09 – 2024.09)</dd>' +
  '<dt>학력</dt><dd>한신대학교 컴퓨터공학·수리금융 복수전공 졸업 (2024.02)</dd>' +
  '<dt>자격</dt><dd>정보처리기사 (2025.09)</dd>' +
  '<dt>이메일</dt><dd>' + link('mailto:' + CONTACT.email, CONTACT.email) + '</dd>' +
  '<dt>사이트</dt><dd>' + link(SITE, SITE) + ' — 작품별 플레이 영상과 상세 설명</dd>' +
  '<dt>영상</dt><dd>' + link('https://youtube.com/@gninest1641', 'youtube.com/@gninest1641') + '</dd>' +
  '<dt>itch.io</dt><dd>' + link('https://gninest.itch.io', 'gninest.itch.io') + '</dd></dl>' +
  '<p class="note">모작(별의 커비, 메탈슬러그, Delver)의 원작 리소스와 외부 에셋 저작권은 각 원저작자에게 있습니다.<br>코드 발췌는 원본 저장소에서 본인이 작성한 부분만 옮겼습니다. "// …"는 생략, "// ▶"는 설명용으로 덧붙인 주석입니다.</p>');

document.getElementById('book').innerHTML = html;
document.querySelectorAll('.pg').forEach(td => { td.textContent = pageOf[td.dataset.for] || ''; });
if (window.QRCode) new QRCode(document.getElementById('qr'), { text: SITE, width: 150, height: 150, correctLevel: QRCode.CorrectLevel.M });
