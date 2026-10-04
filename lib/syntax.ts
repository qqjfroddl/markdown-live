// 기호 카드 목록 — 화면의 카드와 「기호 표시」 설명이 이 한 곳을 기준으로 삼는다.
// block: 줄 맨 앞에 쓰는 기호(제목·목록 등) / inline: 글자 앞뒤를 감싸는 기호(굵게 등)

export type BlockSyntax = {
  id: string;
  label: string;
  symbol: string;
  kind: "block";
  template: string;
  placeholder: string; // 넣은 뒤 선택해 둘 글자 — 학습자가 바로 덮어쓰게
};

export type InlineSyntax = {
  id: string;
  label: string;
  symbol: string;
  kind: "inline";
  open: string;
  close: string;
  placeholder: string;
};

export type Syntax = BlockSyntax | InlineSyntax;

export const SYNTAXES: Syntax[] = [
  { id: "h1", label: "큰 제목", symbol: "#", kind: "block", template: "# 큰 제목", placeholder: "큰 제목" },
  { id: "h2", label: "중간 제목", symbol: "##", kind: "block", template: "## 중간 제목", placeholder: "중간 제목" },
  { id: "h3", label: "작은 제목", symbol: "###", kind: "block", template: "### 작은 제목", placeholder: "작은 제목" },
  { id: "bold", label: "굵게", symbol: "**", kind: "inline", open: "**", close: "**", placeholder: "굵은 글씨" },
  { id: "italic", label: "기울임", symbol: "*", kind: "inline", open: "*", close: "*", placeholder: "기울인 글씨" },
  { id: "ul", label: "목록", symbol: "-", kind: "block", template: "- 첫 번째 항목\n- 두 번째 항목", placeholder: "첫 번째 항목" },
  { id: "ol", label: "번호 목록", symbol: "1.", kind: "block", template: "1. 첫 번째\n2. 두 번째", placeholder: "첫 번째" },
  { id: "task", label: "체크리스트", symbol: "- [ ]", kind: "block", template: "- [ ] 할 일\n- [x] 끝낸 일", placeholder: "할 일" },
  { id: "quote", label: "인용", symbol: ">", kind: "block", template: "> 인용하는 문장", placeholder: "인용하는 문장" },
  { id: "code", label: "코드", symbol: "`", kind: "inline", open: "`", close: "`", placeholder: "코드" },
  { id: "codeblock", label: "코드 블록", symbol: "```", kind: "block", template: "```\n여러 줄 코드\n```", placeholder: "여러 줄 코드" },
  { id: "table", label: "표", symbol: "| |", kind: "block", template: "| 항목 | 내용 |\n| --- | --- |\n| 일시 | 10월 15일 |\n| 장소 | 교육장 |", placeholder: "항목" },
  { id: "link", label: "링크", symbol: "[ ]( )", kind: "inline", open: "[", close: "](https://example.com)", placeholder: "링크 글자" },
  { id: "hr", label: "구분선", symbol: "---", kind: "block", template: "---", placeholder: "" },
];
