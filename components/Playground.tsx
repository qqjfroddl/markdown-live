"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AArrowDown, AArrowUp, Eraser, Eye, EyeOff, Undo2 } from "lucide-react";
import { SYNTAXES, type Syntax } from "@/lib/syntax.ts";
import { insertSyntax } from "@/lib/insert.ts";
import { PRESETS } from "@/lib/presets.ts";
import { renderMarkdown } from "@/lib/render.ts";
import { addCopyButtons, copyText, COPY_LABEL } from "@/lib/copy.ts";
import styles from "./Playground.module.css";

// marks 키를 v2로 바꾼 이유: 예전 판은 처음 열 때 "on"을 저장해 버려서, 키를 그대로 두면 이미 열어 본 사람은 계속 켜진 채로 보인다
const STORE = { text: "mdlive:text", size: "mdlive:size", marks: "mdlive:marks-v2" };
const SIZE_MIN = 14;
const SIZE_MAX = 32;
const SIZE_STEP = 2;
const UNDO_MS = 15000;

// 브라우저 저장소는 사생활 보호 모드 등에서 막힐 수 있다 — 실패해도 화면은 돌아가야 한다
function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 저장 실패는 무시한다(다음 접속 때 예시 글로 시작할 뿐)
  }
}

type Undo = { text: string; message: string };

export default function Playground() {
  const [text, setText] = useState(() => readStore(STORE.text) ?? PRESETS[0].text);
  const [size, setSize] = useState(() => {
    const n = Number(readStore(STORE.size));
    return n >= SIZE_MIN && n <= SIZE_MAX ? n : 18;
  });
  // 기본은 꺼짐 — 결과 화면은 노션처럼 깔끔하게 시작하고, 설명이 필요할 때만 켠다(2026-10-05 소장님 결정)
  const [showMarks, setShowMarks] = useState(() => readStore(STORE.marks) === "on");
  const [undo, setUndo] = useState<Undo | null>(null);
  const [presetValue, setPresetValue] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const pendingSelection = useRef<[number, number] | null>(null);

  const html = useMemo(
    () => addCopyButtons(renderMarkdown(text), { wrap: styles.codeWrap, button: styles.copyBtn }),
    [text],
  );
  const isEmpty = text.trim().length === 0;
  const lineCount = text.length === 0 ? 0 : text.split("\n").length;

  useEffect(() => writeStore(STORE.text, text), [text]);
  useEffect(() => writeStore(STORE.size, String(size)), [size]);
  useEffect(() => writeStore(STORE.marks, showMarks ? "on" : "off"), [showMarks]);

  useEffect(() => {
    if (!undo) return;
    const t = window.setTimeout(() => setUndo(null), UNDO_MS);
    return () => window.clearTimeout(t);
  }, [undo]);

  function replaceAll(next: string, message: string) {
    if (text.trim() && text !== next) setUndo({ text, message });
    setText(next);
  }

  function applySyntax(syntax: Syntax) {
    const el = editorRef.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const r = insertSyntax(text, start, end, syntax);
    pendingSelection.current = [r.selectionStart, r.selectionEnd];
    setText(r.value);
  }

  // 카드로 기호를 넣은 직후, 화면에 새 글이 반영된 다음에 선택 영역을 잡는다
  // (먼저 잡으면 React가 값을 다시 넣으면서 커서가 글 끝으로 튄다)
  useLayoutEffect(() => {
    const sel = pendingSelection.current;
    const node = editorRef.current;
    if (!sel || !node) return;
    pendingSelection.current = null;
    node.focus();
    node.setSelectionRange(sel[0], sel[1]);
  }, [text]);

  function loadPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    replaceAll(preset.text, `「${preset.label}」 예시로 바꿨습니다.`);
    setPresetValue("");
  }

  function clearAll() {
    if (!text) return;
    replaceAll("", "글을 모두 지웠습니다.");
    editorRef.current?.focus();
  }

  // 코드 블록 복사 — 버튼은 HTML 문자열로 들어가므로 결과 칸 하나에서 위임 처리한다
  async function onPreviewClick(e: React.MouseEvent<HTMLElement>) {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]");
    if (!btn) return;
    const code = btn.parentElement?.querySelector("pre")?.textContent ?? "";
    // marked는 코드 끝에 줄바꿈을 하나 붙인다 — 붙여 넣을 때 빈 줄이 생기지 않게 뗀다
    const ok = await copyText(code.replace(/\n$/, ""));
    const label = btn.querySelector("span");
    if (!label) return;
    label.textContent = ok ? "복사됨" : "복사 실패";
    btn.dataset.state = ok ? "done" : "fail";
    window.setTimeout(() => {
      label.textContent = COPY_LABEL;
      delete btn.dataset.state;
    }, 1500);
  }

  function restore() {
    if (!undo) return;
    setText(undo.text);
    setUndo(null);
  }

  return (
    <div className={styles.app} style={{ "--fs": `${size}px` } as React.CSSProperties}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden>
            #
          </span>
          <div>
            <h1 className={styles.title}>마크다운 바로보기</h1>
            <p className={styles.subtitle}>왼쪽에 기호를 넣어 쓰면, 오른쪽에 결과가 바로 보입니다.</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.selectWrap}>
            <span className="sr-only">예시 불러오기</span>
            <select
              className={styles.select}
              value={presetValue}
              onChange={(e) => loadPreset(e.target.value)}
              aria-label="예시 불러오기"
            >
              <option value="" disabled>
                예시 불러오기
              </option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.sizeGroup} role="group" aria-label="글자 크기">
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setSize((s) => Math.max(SIZE_MIN, s - SIZE_STEP))}
              disabled={size <= SIZE_MIN}
              aria-label="글자 작게"
              title="글자 작게"
            >
              <AArrowDown size={18} aria-hidden />
            </button>
            <span className={styles.sizeValue} aria-live="polite">
              {size}
            </span>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setSize((s) => Math.min(SIZE_MAX, s + SIZE_STEP))}
              disabled={size >= SIZE_MAX}
              aria-label="글자 크게"
              title="글자 크게 — 빔프로젝터로 보여줄 때"
            >
              <AArrowUp size={18} aria-hidden />
            </button>
          </div>

          <button type="button" className={styles.toolBtn} onClick={clearAll} disabled={!text}>
            <Eraser size={18} aria-hidden />
            지우기
          </button>
        </div>
      </header>

      <section className={styles.cards} aria-label="기호 카드">
        <span className={styles.cardsLabel}>기호 카드 — 눌러서 넣어 보세요</span>
        <div className={styles.cardRow}>
          {SYNTAXES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.card}
              // 마우스로 눌러도 입력창의 커서·선택이 사라지지 않게 포커스를 옮기지 않는다
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applySyntax(s)}
              title={s.kind === "inline" ? "글자를 골라 두고 누르면 그 글자를 감쌉니다" : "새 줄에 넣습니다"}
            >
              <code className={styles.cardSymbol}>{s.symbol}</code>
              <span className={styles.cardLabel}>{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      <main className={styles.panes}>
        <section className={styles.pane} aria-labelledby="pane-input">
          <div className={styles.paneHead}>
            <h2 id="pane-input" className={styles.paneTitle}>
              <span className={styles.step}>1</span> 내가 쓰는 글
              <span className={styles.paneHint}>일반 텍스트 · 메모장처럼</span>
            </h2>
          </div>
          <textarea
            ref={editorRef}
            className={styles.editor}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"여기에 써 보세요.\n\n예) # 안녕하세요\n- 첫 번째 항목"}
            spellCheck={false}
            aria-label="마크다운 입력"
          />
          <div className={styles.paneFoot}>
            {text.length.toLocaleString()}자 · {lineCount}줄
          </div>
        </section>

        <section className={`${styles.pane} ${styles.previewPane}`} aria-labelledby="pane-output">
          <div className={`${styles.paneHead} ${styles.paneHeadRow}`}>
            <h2 id="pane-output" className={styles.paneTitle}>
              <span className={`${styles.step} ${styles.stepAccent}`}>2</span> 마크다운으로 보이는 모습
              {showMarks && <span className={styles.paneHint}>초록 표시 = 그 모양을 만든 기호</span>}
            </h2>
            {/* 결과를 보다가 "이건 어떤 기호로 만든 거지?" 싶을 때 바로 옆에서 누르도록 결과 칸 머리에 둔다 */}
            <button
              type="button"
              role="switch"
              aria-checked={showMarks}
              className={`${styles.marksSwitch} ${showMarks ? styles.marksSwitchOn : ""}`}
              onClick={() => setShowMarks((v) => !v)}
              title="결과 옆에 그 모양을 만든 기호를 함께 보여줍니다"
            >
              {showMarks ? <Eye size={16} aria-hidden /> : <EyeOff size={16} aria-hidden />}
              기호 같이 보기
              <span className={styles.switchTrack} aria-hidden>
                <span className={styles.switchThumb} />
              </span>
            </button>
          </div>
          {isEmpty ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>아직 쓴 글이 없습니다</p>
              <p>
                왼쪽에 <code>#</code> 한 칸 띄우고 글을 써 보세요.
                <br />큰 제목으로 바뀌는 게 바로 보입니다.
              </p>
            </div>
          ) : (
            <article
              className={`${styles.preview} ${showMarks ? styles.marks : ""}`}
              onClick={onPreviewClick}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </section>
      </main>

      {undo && (
        <div className={styles.toast} role="status">
          <span>{undo.message}</span>
          <button type="button" className={styles.toastBtn} onClick={restore}>
            <Undo2 size={16} aria-hidden />
            되돌리기
          </button>
        </div>
      )}
    </div>
  );
}
