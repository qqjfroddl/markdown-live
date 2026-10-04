// 기호 카드를 눌렀을 때 입력창 글에 기호를 끼워 넣는 순수 함수.
// 화면(textarea)과 분리해 두어야 테스트할 수 있다.

import type { Syntax } from "./syntax.ts";

export type InsertResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export function insertSyntax(value: string, start: number, end: number, syntax: Syntax): InsertResult {
  const s = clamp(Math.min(start, end), 0, value.length);
  const e = clamp(Math.max(start, end), 0, value.length);
  return syntax.kind === "inline" ? insertInline(value, s, e, syntax) : insertBlock(value, s, e, syntax);
}

function insertInline(value: string, s: number, e: number, syntax: Extract<Syntax, { kind: "inline" }>): InsertResult {
  // 글자를 골라 두었으면 그 글자를 감싸고, 아니면 예시 글자를 넣어 선택해 둔다
  const selected = value.slice(s, e);
  const inner = selected || syntax.placeholder;
  const next = value.slice(0, s) + syntax.open + inner + syntax.close + value.slice(e);
  const innerStart = s + syntax.open.length;
  return { value: next, selectionStart: innerStart, selectionEnd: innerStart + inner.length };
}

function insertBlock(value: string, s: number, e: number, syntax: Extract<Syntax, { kind: "block" }>): InsertResult {
  const before = value.slice(0, s);
  const after = value.slice(e);

  // 줄 맨 앞에서 시작해야 기호로 인식된다. 앞 줄에 글이 있으면 빈 줄을 하나 둔다
  // (빈 줄 없이 붙이면 표·목록이 앞 문장에 섞여 보이는 경우가 있다)
  let prefix = "";
  if (before.length > 0) {
    if (before.endsWith("\n\n")) prefix = "";
    else if (before.endsWith("\n")) prefix = "\n";
    else prefix = "\n\n";
  }

  let suffix = "";
  if (after.length > 0) {
    if (after.startsWith("\n\n")) suffix = "";
    else if (after.startsWith("\n")) suffix = "\n";
    else suffix = "\n\n";
  }

  const blockStart = before.length + prefix.length;
  const next = before + prefix + syntax.template + suffix + after;

  const idx = syntax.placeholder ? syntax.template.indexOf(syntax.placeholder) : -1;
  if (idx >= 0) {
    const selStart = blockStart + idx;
    return { value: next, selectionStart: selStart, selectionEnd: selStart + syntax.placeholder.length };
  }
  const caret = blockStart + syntax.template.length;
  return { value: next, selectionStart: caret, selectionEnd: caret };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
