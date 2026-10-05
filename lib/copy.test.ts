import { test } from "node:test";
import assert from "node:assert/strict";
import { marked } from "marked";
import { addCopyButtons } from "./copy.ts";

const cls = { wrap: "W", button: "B" };
const render = (md: string) => addCopyButtons(marked.parse(md, { async: false, gfm: true }), cls);
const count = (s: string, sub: string) => s.split(sub).length - 1;

test("코드 블록마다 복사 버튼이 하나씩 붙는다", () => {
  const html = render("```\n하나\n```\n\n문장\n\n```js\nconst a = 1;\n```");
  assert.equal(count(html, "data-copy"), 2);
  assert.equal(count(html, '<div class="W">'), 2);
  assert.equal(count(html, "</pre></div>"), 2);
});

test("짧은 코드(`코드`)에는 버튼이 붙지 않는다", () => {
  const html = render("본문 `코드` 입니다");
  assert.equal(count(html, "data-copy"), 0);
});

test("코드 안에 <pre> 글자가 있어도 블록이 깨지지 않는다 — 코드 안의 <는 &lt;로 바뀐다", () => {
  const html = render("```html\n<pre>안쪽</pre>\n```");
  assert.equal(count(html, "data-copy"), 1);
  assert.ok(html.includes("&lt;pre&gt;안쪽&lt;/pre&gt;"));
});

test("코드 블록이 없으면 HTML이 그대로다", () => {
  const raw = marked.parse("# 제목\n\n- 목록", { async: false });
  assert.equal(addCopyButtons(raw, cls), raw);
});
