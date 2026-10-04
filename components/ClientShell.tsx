"use client";

// 연습 화면은 브라우저 저장소(마지막 글)와 HTML 정화(DOMPurify)를 쓰므로 브라우저에서만 그린다.
// 서버에서 그리면 저장된 글과 첫 화면이 달라 깜빡인다.

import dynamic from "next/dynamic";
import styles from "./Playground.module.css";

const Playground = dynamic(() => import("./Playground"), {
  ssr: false,
  loading: () => (
    <div className={styles.loading} role="status">
      연습 화면을 준비하고 있습니다…
    </div>
  ),
});

export default function ClientShell() {
  return <Playground />;
}
