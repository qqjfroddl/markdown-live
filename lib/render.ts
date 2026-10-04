// 마크다운 → 화면에 넣을 HTML. 브라우저에서만 부른다(DOMPurify가 window를 쓴다).
// 학습자가 아무 글이나 붙여 넣을 수 있으므로 스크립트 등은 반드시 걸러낸다.

import { marked } from "marked";
import DOMPurify from "dompurify";

// breaks: 메모장처럼 엔터 한 번이 줄바꿈으로 보이게 한다 (ChatGPT 등 AI 화면과 같은 방식)
marked.setOptions({ gfm: true, breaks: true });

let hooked = false;

export function renderMarkdown(text: string): string {
  if (!hooked) {
    // 결과 화면의 링크를 눌러도 연습 화면이 사라지지 않게 새 탭으로 연다
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
    hooked = true;
  }
  const html = marked.parse(text, { async: false });
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
}
