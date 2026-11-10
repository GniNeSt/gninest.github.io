/*
 * 코드 발췌 렌더러 — Visual Studio 다크 테마처럼 탭·탐색 막대·줄 번호·구문 색상으로 그립니다.
 * 사이트(portfolio.js)와 PDF(print.js)가 함께 씁니다. 데이터 형식은 excerpts.js 머리말 참고.
 */
const CODEVIEW = (() => {
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const words = s => new Set(s.split(' '));
  const KW = words('bool void int float double char auto const static public private protected internal override virtual abstract sealed readonly new this base true false null nullptr var in is as out ref get set event interface class struct enum using namespace typeof sizeof dynamic_cast static_cast delegate');
  const CTRL = words('if else for foreach while do switch case default break continue return yield goto throw try catch finally');
  const TYPES = words('RUNTIME_CHUNK _matrix _vec3 D3DXVECTOR4 KIRBY_ABILITY CObj CPlayer CUIMgr CStaticCubeMap CSceneMgr Action MinigameOutcome IMinigameOutcomeProvider IMinigameResult IMinigame RaycastHit2D BookType OrganizeBookCtrl ItemCardCtrlObj ItemManager ItemCtrlObj Animator Type SerializeField');
  const ENUMS = words('KIRBY_ABILITY MinigameOutcome BookType');
  const span = (cls, t) => '<span class="' + cls + '">' + esc(t) + '</span>';

  // 한 줄을 구문 색상 HTML로 바꿉니다(이 발췌들에는 여러 줄 주석이 없어 줄 단위로 충분합니다).
  function highlight(line) {
    const re = /(\/\/\/.*$)|(\/\/.*$)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)')|([A-Za-z_]\w*)|(\d+(?:\.\d*)?f?)|(\s+)|(::|.)/g;
    let out = '', m, prev = '', prevWord = '';
    while ((m = re.exec(line))) {
      const [t, doc, cmt, str, chr, id, num] = m;
      if (doc) out += span('c-doc', '///') + esc(t.slice(3)).replace(/&lt;\/?\w+&gt;/g, s => '<span class="c-tag">' + s + '</span>').replace(/^(.*)$/, '<span class="c-cmt">$1</span>');
      else if (cmt) out += span('c-cmt', t);
      else if (str || chr) out += span('c-str', t);
      else if (num) out += span('c-num', t);
      else if (id) {
        const rest = line.slice(re.lastIndex);
        let cls = '';
        if (CTRL.has(t)) cls = 'c-ctl';
        else if (KW.has(t)) cls = 'c-kw';
        else if ((prev === '.' || prev === '::') && ENUMS.has(prevWord)) cls = 'c-enum';
        else if (TYPES.has(t)) cls = 'c-type';
        else if (/^\s*(<[\w.,\s*]*>)?\s*\(/.test(rest)) cls = 'c-fn';
        out += cls ? span(cls, t) : esc(t);
        prevWord = t;
      } else out += esc(t);
      if (!/^\s+$/.test(t)) prev = t;
    }
    return out;
  }

  // 블록 하나를 그립니다. notes는 발췌 전체에서 이어지는 설명 번호 목록입니다.
  function block(b, notes) {
    let n = b.start, rows = '';
    b.code.split('\n').forEach(raw => {
      const fold = raw.match(/^(\s*)\/\/@fold (\d+) (.*)$/);
      if (fold) {
        const k = +fold[2];
        rows += '<div class="cv-row cv-foldrow"><span class="cv-n">+</span><span class="cv-c">' + esc(fold[1]) +
          '<span class="cv-fold">⋯</span> <span class="cv-foldtxt">' + esc(fold[3]) + ' · ' + n + '–' + (n + k - 1) + '행 생략</span></span></div>';
        n += k;
        return;
      }
      let code = raw, mark = '';
      const at = raw.indexOf(' // ▶ ');
      if (at >= 0) {
        notes.push(raw.slice(at + 6).trim());
        code = raw.slice(0, at).replace(/\s+$/, '');
        mark = '<i class="cv-m">' + notes.length + '</i>';
      }
      // 줄이 넘칠 때 이어지는 줄은 원래 들여쓰기 + 4칸에서 시작(VS 자동 줄 바꿈과 같은 모양)
      const hang = code.match(/^ */)[0].length + 4;
      rows += '<div class="cv-row' + (mark ? ' cv-hl' : '') + '"><span class="cv-n">' + n + '</span><span class="cv-c" style="padding-left:' + hang + 'ch;text-indent:-' + hang + 'ch">' + highlight(code) + mark + '</span></div>';
      n++;
    });
    const fileName = b.file.split('/').pop(), dir = b.file.slice(0, -fileName.length);
    const lang = b.lang === 'cpp' ? ['C++', 'cpp'] : ['C#', 'cs'];
    return '<figure class="cv">' +
      (b.caption ? '<figcaption class="cv-cap">' + esc(b.caption) + '</figcaption>' : '') +
      '<div class="cv-win"><div class="cv-tabs"><span class="cv-tab"><b class="cv-ico ' + lang[1] + '">' + lang[0] + '</b>' + esc(fileName) + '</span>' +
      '<span class="cv-path">' + esc(dir) + '</span></div>' +
      '<div class="cv-nav">' + (b.nav || [b.label]).map(x => '<span>' + esc(x) + '</span>').join('') + '</div>' +
      '<div class="cv-body">' + rows + '</div></div></figure>';
  }

  const range = b => {
    let n = b.start, last = b.start;
    b.code.split('\n').forEach(l => { const f = l.match(/^\s*\/\/@fold (\d+)/); last = n + (f ? +f[1] : 1) - 1; n = last + 1; });
    return b.start + '–' + last;
  };
  const noteList = (notes, from = 0) => notes.length ? '<ol class="cv-notes">' + notes.map((t, i) => '<li><i class="cv-m">' + (from + i + 1) + '</i>' + esc(t) + '</li>').join('') + '</ol>' : '';

  return { block, range, noteList, highlight };
})();
