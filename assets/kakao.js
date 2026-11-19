/* 카카오톡 상담 버튼
 * - LINK 가 비어 있으면: 버튼 클릭 시 ID 를 복사하고 친구 추가 안내 창을 띄웁니다.
 * - 카카오톡 채널(https://pf.kakao.com/_xxxx/chat) 또는 오픈채팅(https://open.kakao.com/o/xxxx)
 *   링크가 생기면 LINK 에 넣기만 하면 버튼이 바로 채팅으로 연결됩니다.
 */
(function () {
  var ID = 'skatjdduq21';
  var LINK = '';
  var TEL = '01029283614';

  var ICON = '<svg class="kk-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.32 4.66 6.74l-.98 3.6c-.09.33.28.6.57.41l4.27-2.84c.49.06.98.09 1.48.09 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>';

  var css = ''
    + '.kk-ic{width:1.15em;height:1.15em;flex:0 0 auto}'
    + '.kk-ov{position:fixed;inset:0;z-index:100;background:rgba(13,22,43,.6);display:none;align-items:center;justify-content:center;padding:16px}'
    + '.kk-ov.on{display:flex}'
    + '.kk-box{position:relative;background:#fff;color:#1d2433;border-radius:22px;max-width:400px;width:100%;padding:30px 26px 24px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.3);font-family:inherit}'
    + '.kk-x{position:absolute;right:12px;top:10px;border:0;background:none;font-size:28px;line-height:1;color:#8a93a5;cursor:pointer;padding:6px}'
    + '.kk-logo{width:58px;height:58px;border-radius:16px;background:#FEE500;color:#191919;display:grid;place-items:center;margin:0 auto 12px}'
    + '.kk-logo .kk-ic{width:32px;height:32px}'
    + '.kk-box h3{font-size:20px;font-weight:900;color:#14213d;margin:0 0 14px}'
    + '.kk-label{font-size:13px;color:#5f6b7f;margin:0 0 6px}'
    + '.kk-id{display:flex;align-items:center;justify-content:center;gap:10px;background:#f6f7fb;border:1.5px solid #e3e7ef;border-radius:14px;padding:12px 14px;font-size:22px;font-weight:900;color:#14213d;letter-spacing:.02em}'
    + '.kk-copy{border:0;background:#14213d;color:#fff;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}'
    + '.kk-done{font-size:13px;color:#1a9d5c;font-weight:700;margin:8px 0 0;min-height:18px}'
    + '.kk-qr{display:flex;align-items:center;gap:14px;margin-top:12px;padding:12px;border:1.5px solid #e3e7ef;border-radius:14px;text-align:left}'
    + '.kk-qr img{width:110px;height:110px;flex:0 0 110px;display:block}'
    + '.kk-qr p{margin:0;font-size:13px;color:#5f6b7f;line-height:1.6}.kk-qr b{color:#14213d}'
    + '.kk-box{max-height:calc(100vh - 32px);overflow-y:auto}'
    + '.kk-steps{text-align:left;margin:16px 0 0;padding:14px 16px 14px 34px;background:#fff8d6;border-radius:14px;font-size:14px;line-height:1.7}'
    + '.kk-steps b{color:#14213d}'
    + '.kk-open{display:none;margin-top:16px;background:#FEE500;color:#191919;border-radius:999px;padding:14px;font-weight:900;font-size:16px;text-decoration:none}'
    + '.kk-mobile .kk-open{display:block}'
    + '.kk-alt{font-size:13px;color:#5f6b7f;margin:14px 0 0}'
    + '.kk-alt a{color:#e85d75;font-weight:700;text-decoration:none}';

  function addStyle() {
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacy(text); });
      }
    } catch (e) {}
    return Promise.resolve(legacy(text));
  }
  function legacy(text) {
    try {
      var t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(t);
      return ok;
    } catch (e) { return false; }
  }

  var ov;
  function buildModal() {
    ov = document.createElement('div');
    ov.className = 'kk-ov';
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) ov.className += ' kk-mobile';
    ov.innerHTML = ''
      + '<div class="kk-box" role="dialog" aria-modal="true" aria-label="카카오톡 상담">'
      + '<button class="kk-x" type="button" aria-label="닫기">×</button>'
      + '<div class="kk-logo">' + ICON + '</div>'
      + '<h3>카카오톡으로 상담하기</h3>'
      + '<p class="kk-label">튜터러브 카카오톡 ID</p>'
      + '<div class="kk-id"><span>' + ID + '</span><button class="kk-copy" type="button">복사</button></div>'
      + '<p class="kk-done" aria-live="polite"></p>'
      + '<div class="kk-qr"><img src="/assets/kakao-qr.png" alt="튜터러브 카카오톡 친구 추가 QR 코드" width="140" height="140"><p><b>휴대폰 카메라로 QR을 스캔</b>하면<br>바로 친구 추가할 수 있어요</p></div>'
      + '<ol class="kk-steps">'
      + '<li>카카오톡 <b>친구 탭</b> → 오른쪽 위 <b>친구 추가</b></li>'
      + '<li><b>ID</b> 선택 → <b>' + ID + '</b> 붙여넣고 검색</li>'
      + '<li>친구 추가 후 <b>학년 · 학교 · 희망 과목</b>을 보내주세요</li>'
      + '</ol>'
      + '<a class="kk-open" href="kakaotalk://launch">카카오톡 열기</a>'
      + '<p class="kk-alt">카톡이 어려우시면 <a href="tel:' + TEL + '">전화</a> · <a href="sms:' + TEL + '">문자</a>로도 상담 가능합니다.</p>'
      + '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.kk-x').addEventListener('click', close);
    ov.querySelector('.kk-copy').addEventListener('click', function () { doCopy(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
  function doCopy() {
    var msg = ov.querySelector('.kk-done');
    copy(ID).then(function (ok) {
      msg.textContent = ok ? '✓ 아이디가 복사되었습니다' : '아이디를 길게 눌러 복사해 주세요';
    });
  }
  function open() {
    if (!ov) buildModal();
    ov.classList.add('on');
    doCopy();
  }
  function close() { if (ov) ov.classList.remove('on'); }

  function init() {
    addStyle();
    var els = document.querySelectorAll('[data-kakao]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.hasAttribute('data-kakao-icon')) el.insertAdjacentHTML('afterbegin', ICON);
      if (LINK) { el.setAttribute('href', LINK); el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); continue; }
      el.addEventListener('click', function (e) { e.preventDefault(); open(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
