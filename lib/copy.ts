// 결과 화면 코드 블록의 「복사」 버튼.
// 버튼은 정화(DOMPurify)가 끝난 HTML에 덧붙인다 — 정화 전에 넣으면 버튼이 걸러진다.

const COPY_ICON =
  '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

export const COPY_LABEL = "복사";

// marked가 내는 코드 블록은 `<pre><code …>…</code></pre>` 형태이고, 코드 안의 `<`는 `&lt;`로
// 바뀌어 있으므로 `<pre>`·`</pre>` 문자열은 블록 경계에서만 나온다.
export function addCopyButtons(html: string, cls: { wrap: string; button: string }): string {
  return html
    .replace(
      /<pre>/g,
      `<div class="${cls.wrap}"><button type="button" class="${cls.button}" data-copy aria-label="코드 복사">${COPY_ICON}<span>${COPY_LABEL}</span></button><pre>`,
    )
    .replace(/<\/pre>/g, "</pre></div>");
}

// 클립보드 API는 https·localhost에서만 열린다. 막힌 환경(사내 http 미러 등)에서는 옛 방식으로 한 번 더 시도한다
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 아래 대체 방식으로 넘어간다
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
