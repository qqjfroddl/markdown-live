import { test } from "node:test";
import assert from "node:assert/strict";
import { insertSyntax } from "./insert.ts";
import { SYNTAXES } from "./syntax.ts";

const get = (id: string) => {
  const s = SYNTAXES.find((x) => x.id === id);
  if (!s) throw new Error(id);
  return s;
};

test("빈 글에 큰 제목을 넣으면 앞뒤 빈 줄 없이 들어가고 예시 글자가 선택된다", () => {
  const r = insertSyntax("", 0, 0, get("h1"));
  assert.equal(r.value, "# 큰 제목");
  assert.equal(r.value.slice(r.selectionStart, r.selectionEnd), "큰 제목");
});

test("문장 중간에서 제목을 누르면 새 줄(빈 줄 포함)로 떼어 넣는다 — 줄 맨 앞이어야 기호가 먹는다", () => {
  const r = insertSyntax("안녕하세요반갑습니다", 5, 5, get("h2"));
  assert.equal(r.value, "안녕하세요\n\n## 중간 제목\n\n반갑습니다");
});

test("이미 줄바꿈 뒤라면 빈 줄을 하나만 더한다", () => {
  const r = insertSyntax("첫 줄\n", 4, 4, get("ul"));
  assert.equal(r.value, "첫 줄\n\n- 첫 번째 항목\n- 두 번째 항목");
});

test("빈 줄 뒤라면 아무것도 더하지 않는다", () => {
  const r = insertSyntax("첫 줄\n\n", 5, 5, get("quote"));
  assert.equal(r.value, "첫 줄\n\n> 인용하는 문장");
});

test("글자를 골라 두고 굵게를 누르면 그 글자를 감싼다", () => {
  const r = insertSyntax("오늘은 중요한 날", 4, 7, get("bold"));
  assert.equal(r.value, "오늘은 **중요한** 날");
  assert.equal(r.value.slice(r.selectionStart, r.selectionEnd), "중요한");
});

test("고른 글자가 없으면 예시 글자를 넣어 선택해 둔다", () => {
  const r = insertSyntax("가나", 1, 1, get("italic"));
  assert.equal(r.value, "가*기울인 글씨*나");
  assert.equal(r.value.slice(r.selectionStart, r.selectionEnd), "기울인 글씨");
});

test("선택 방향이 거꾸로(끝<시작)여도 같은 결과", () => {
  const r = insertSyntax("오늘은 중요한 날", 7, 4, get("bold"));
  assert.equal(r.value, "오늘은 **중요한** 날");
});

test("범위를 벗어난 커서 값은 글 끝으로 보정한다", () => {
  const r = insertSyntax("abc", 99, 99, get("code"));
  assert.equal(r.value, "abc`코드`");
});

test("링크는 글자만 선택되고 주소는 그대로 남는다", () => {
  const r = insertSyntax("", 0, 0, get("link"));
  assert.equal(r.value, "[링크 글자](https://example.com)");
  assert.equal(r.value.slice(r.selectionStart, r.selectionEnd), "링크 글자");
});

test("구분선은 예시 글자가 없으니 커서를 기호 뒤에 둔다", () => {
  const r = insertSyntax("위", 1, 1, get("hr"));
  assert.equal(r.value, "위\n\n---");
  assert.equal(r.selectionStart, r.value.length);
  assert.equal(r.selectionEnd, r.value.length);
});

test("블록을 선택 영역 위에 넣으면 선택한 글자를 대신한다", () => {
  const r = insertSyntax("앞\n지울글\n뒤", 2, 5, get("hr"));
  assert.equal(r.value, "앞\n\n---\n\n뒤");
});

test("모든 블록 카드의 예시 글자는 템플릿 안에 실제로 있다", () => {
  for (const s of SYNTAXES) {
    if (s.kind === "block" && s.placeholder) assert.ok(s.template.includes(s.placeholder), s.id);
  }
});
