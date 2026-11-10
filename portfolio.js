/* ---------- 렌더링 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tagsHTML = tags => '<div class="tags">' + tags.map(t => '<span>' + esc(t) + '</span>').join('') + '</div>';
/*
 * 직무별 보기: 주소에 ?track=cpp 또는 ?track=unity 를 붙이면 그 분야 작품이 먼저 나옵니다(다른 작품도 함께 표시).
 * 작품 바로가기: 주소 끝에 #delver 처럼 작품 id를 붙이면 그 작품 상세가 바로 열립니다.
 */
const TRACK = new URLSearchParams(location.search).get('track');
const sorted = [...projects].sort((a, b) =>
  ((TRACK && a.category !== TRACK) - (TRACK && b.category !== TRACK)) || a.order - b.order);

function renderWorks() {
  const featured = sorted.filter(p => p.tier === 'main');
  const rest = sorted.filter(p => p.tier !== 'main');
  $('#featured-list').innerHTML = featured.map((p, i) =>
    '<article class="featured project" data-category="' + p.category + '">' +
      '<div class="feature-visual">' + (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '" loading="lazy">' : '') +
        '<span class="visual-label">' + String(i + 1).padStart(2, '0') + ' — ' + esc(p.title.toUpperCase()) + '</span></div>' +
      '<div class="feature-copy">' + (p.award ? '<span class="award">' + esc(p.award) + '</span>' : '') + (p.activity ? '<span class="activity">' + esc(p.activity) + '</span>' : '') + tagsHTML(p.tags) +
        '<h3>' + esc(p.title) + '</h3><p class="feature-sub">' + esc(p.subtitle) + '</p><p>' + esc(p.summary) + '</p>' +
        '<dl class="feature-role"><dt>기간</dt><dd>' + esc(p.period) + '</dd><dt>담당</dt><dd>' + esc(p.role) + '</dd></dl>' +
        '<button class="text-button" data-project="' + p.id + '">구현과 담당 역할 보기 <span>↗</span></button></div></article>').join('');
  $('#project-list').innerHTML = rest.map((p, i) =>
    '<article class="project project-row" data-category="' + p.category + '">' +
      '<span class="project-number">' + String(featured.length + i + 1).padStart(2, '0') + '</span>' +
      '<button class="row-thumb" data-project="' + p.id + '" tabindex="-1" aria-hidden="true">' + (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '') + '</button>' +
      '<div class="project-title">' + tagsHTML(p.tags) + '<h3>' + esc(p.title) + '</h3><p>' + esc(p.subtitle) + '</p>' +
        (p.award ? '<span class="award small">' + esc(p.award) + '</span>' : '') + '</div>' +
      '<div class="project-desc"><p>' + esc(p.summary) + '</p><span class="caption">' + esc(p.period) + ' · ' + esc(p.team) + '</span></div>' +
      '<button class="round-button" data-project="' + p.id + '" aria-label="' + esc(p.title) + ' 상세 보기">↗</button></article>').join('');
  const count = projects.length;
  $('#count-all').textContent = count;
  $('#count-unity').textContent = projects.filter(p => p.category === 'unity').length;
  $('#count-cpp').textContent = projects.filter(p => p.category === 'cpp').length;
  const strip = $('#strip-count');
  if (strip) strip.textContent = 'SELECTED WORKS — ' + String(count).padStart(2, '0');
}

function renderContact() {
  const items = [['이메일', CONTACT.email, CONTACT.email ? 'mailto:' + CONTACT.email : ''], ['GitHub', CONTACT.github, CONTACT.github]];
  const html = items.filter(i => i[1]).map(i => '<div class="field"><span>' + i[0] + '</span><a href="' + esc(i[2]) + '" target="_blank" rel="noopener noreferrer">' + esc(i[1]) + '</a></div>').join('');
  $('#contact-extra').innerHTML = html || '<div class="field"><span>연락처</span><span>지원 서류(이력서)에 기재했습니다.</span></div>';
}

function videoEmbed(ids, start) {
  // 영상이 여러 개면 순서대로 이어서 재생하고, 끝나면 처음부터 반복합니다.
  // 영상이 하나면 YouTube 기본 플레이어로 재생합니다(start가 있으면 그 지점부터).
  const multi = ids.length > 1;
  const params = multi ? '?playlist=' + ids.join(',') + '&loop=1&rel=0&playsinline=1' : '?rel=0&playsinline=1' + (start ? '&start=' + start : '');
  const src = 'https://www.youtube-nocookie.com/embed/' + ids[0] + params;
  // 파일을 더블클릭해 연(file://) 경우 YouTube가 재생을 막으므로(오류 153), 썸네일 + YouTube 링크로 대신 보여 줍니다.
  if (location.protocol === 'file:') {
    return ids.map(id => '<a class="video-frame video-fallback" href="https://youtu.be/' + id + (start && ids.length === 1 ? '?t=' + start : '') + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="https://img.youtube.com/vi/' + id + '/hqdefault.jpg" alt="플레이 영상 썸네일"><span>▶ YouTube에서 재생</span></a>').join('') +
      '<p class="detail-note">로컬 파일로 열어서 영상을 바로 재생할 수 없습니다. 웹에 올린 사이트에서는 이 자리에서 재생됩니다.</p>';
  }
  return '<div class="video-frame"><iframe src="' + src + '" title="' + (multi ? '플레이 영상 (연속 반복 재생)' : '플레이 영상') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' +
    (multi ? '<p class="detail-note">영상 ' + ids.length + '개가 이어서 재생되고 끝나면 처음부터 반복됩니다.</p>' : '');
}

function field(label, value, wide) {
  return value ? '<div class="field' + (wide ? ' wide' : '') + '"><span>' + label + '</span><span>' + esc(value) + '</span></div>' : '';
}
function figures(list) {
  return list.length ? '<div class="figure-grid">' + list.map(f => '<figure class="detail-figure"><img src="' + esc(f[0]) + '" alt="' + esc(f[1]) + '" loading="lazy"><figcaption>' + esc(f[1]) + '</figcaption></figure>').join('') + '</div>' : '';
}
function block(title, inner) { return inner ? '<section class="detail-block"><h4>' + title + '</h4>' + inner + '</section>' : ''; }
// 코드 발췌: 사이트에서는 접힌 상태(<details>)로 보여 줍니다. (인쇄용 print.js에는 펼친 상태로 같은 내용을 그립니다)
function excerptHTML(x, open) {
  if (!x) return '';
  // 코드 창은 codeview.js가 그립니다(VS 다크 테마·원본 줄 번호). ▶ 설명은 블록마다 아래에 번호 목록으로 붙습니다.
  const notes = [];
  return '<p class="excerpt-note"><strong>' + esc(x.title) + '</strong> — ' + esc(x.note) + '</p>' +
    x.blocks.map(b => {
      const from = notes.length, view = CODEVIEW.block(b, notes);
      return '<details class="code-block"' + (open ? ' open' : '') + '><summary><span>' + esc(b.label) + '</span><small>' + esc(b.file.split('/').pop()) + ' · ' + CODEVIEW.range(b) + '행</small></summary>' +
        view + CODEVIEW.noteList(notes.slice(from), from) + '</details>';
    }).join('') +
    (x.commit ? '<p class="detail-note"><a href="' + esc(x.commit) + '" target="_blank" rel="noopener noreferrer">GitHub에서 수정 커밋 보기 ↗</a></p>' : '');
}

function detailHTML(p) {
  const s = p.story;
  return tagsHTML(p.tags) +
    '<h2 class="detail-title" id="detail-title">' + esc(p.title) + '</h2><p class="detail-intro">' + esc(p.summary) + '</p>' +
    (p.award ? '<p class="award">' + esc(p.award) + '</p>' : '') + (p.activity ? '<p class="activity">' + esc(p.activity) + '</p>' : '') +
    (p.tldr ? '<dl class="tldr">' + p.tldr.map(t => '<dt>' + esc(t[0]) + '</dt><dd>' + esc(t[1]) + '</dd>').join('') + '</dl>' : '') +
    '<div class="detail-meta">' + field('개발 기간', p.period) + field('팀 구성', p.team) + field('플랫폼', p.platform) + field('담당 범위', p.role, true) + '</div>' +
    (p.videos ? videoEmbed(p.videos, p.videoStart) : (p.image ? figures([[p.image, p.imageAlt]]) : '')) +
    (p.links.length ? '<div class="detail-links">' + p.links.map(l => '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(l[0]) + ' ↗</a>').join('') + '</div>' : '') +
    block('핵심 구현', '<ul class="feature-list">' + p.features.map(f => '<li><strong>' + esc(f[0]) + '</strong><br>' + esc(f[1]) +
      (f[2] ? '<figure class="detail-figure feature-shot"><img src="' + esc(f[2]) + '" alt="' + esc(f[3] || f[0]) + '" loading="lazy"><figcaption>' + esc(f[3] || '') + '</figcaption></figure>' : '') + '</li>').join('') + '</ul>') +
    (s ? block('문제 해결 사례', '<dl class="story"><dt>문제</dt><dd>' + esc(s.problem) + '</dd><dt>원인</dt><dd>' + esc(s.cause) + '</dd><dt>해결</dt><dd>' + esc(s.fix) + '</dd><dt>검증</dt><dd>' + esc(s.result) + '</dd></dl>' + figures(s.images)) : '') +
    block('역할과 협업', p.collaboration ? '<p>' + esc(p.collaboration) + '</p>' : '') +
    block('구현 구조', p.code.length ? '<ul class="code-list">' + p.code.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul>' : '') +
    block('코드 발췌', excerptHTML(p.excerpt, false) + (p.extraExcerpts || []).map(x => excerptHTML(x, false)).join('')) +
    block('결과 증빙', figures(p.evidenceImages)) +
    block('개발 방식', p.method ? '<p>' + esc(p.method) + '</p>' : '') +
    block('회고 · 다음 개선', p.next ? '<p>' + esc(p.next) + '</p>' : '');
}

/* ---------- 상호작용 ---------- */
const dialog = $('#project-dialog');
const content = $('#detail-content');
let opener, currentId = null;
function openProject(id, trigger) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  if (trigger) opener = trigger;
  currentId = id;
  content.innerHTML = detailHTML(p);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0; document.body.style.overflow = 'hidden'; $('#close-dialog').focus();
  history.replaceState(null, '', '#' + id); // 작품별 주소(공유용)
}
// 이전·다음 작품 (화면에 보이는 순서 기준)
function stepProject(dir) {
  const order = sorted.map(p => p.id);
  const i = order.indexOf(currentId);
  openProject(order[(i + dir + order.length) % order.length]);
}
$('#prev-project').addEventListener('click', () => stepProject(-1));
$('#next-project').addEventListener('click', () => stepProject(1));
$('#copy-link').addEventListener('click', async e => {
  const btn = e.currentTarget, url = location.origin + location.pathname + location.search + '#' + currentId;
  try { await navigator.clipboard.writeText(url); btn.textContent = '복사됨 ✓'; }
  catch { prompt('이 주소를 복사하세요', url); }
  setTimeout(() => { btn.textContent = '링크 복사'; }, 1500);
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-project]');
  if (t) openProject(t.dataset.project, t);
});
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  if (!dialog.open) {
    content.innerHTML = ''; // 영상 재생을 멈추기 위해 내용을 비웁니다(바로 다시 연 경우는 제외).
    history.replaceState(null, '', location.pathname + location.search);
  }
  document.body.style.overflow = '';
  if (opener) opener.focus();
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  document.querySelectorAll('.project').forEach(p => { p.hidden = filter !== 'all' && p.dataset.category !== filter; });
}));

renderWorks();
renderContact();
// 주소에 #작품id 가 있으면 해당 작품 상세를 바로 엽니다.
const startId = location.hash.slice(1);
if (projects.some(p => p.id === startId)) openProject(startId);
