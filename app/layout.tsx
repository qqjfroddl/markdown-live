import type { Metadata, Viewport } from "next";
import "./globals.css";

// 링크 미리보기(og:image)는 절대 주소가 필요하다. Vercel이 빌드 때 넣어 주는 운영 주소를 쓴다
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description = "왼쪽에 글을 쓰면 오른쪽에 마크다운 결과가 바로 보입니다. 기호 하나가 글의 모양을 어떻게 바꾸는지 직접 경험해 보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "마크다운 바로보기 — 딥택트러닝",
  description,
  openGraph: {
    title: "마크다운 바로보기",
    description,
    siteName: "딥택트러닝",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2E3142",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        {/* 페이퍼로지 실물 폰트 — 대체 폰트 금지(2026-07-18 소장님 지시) */}
        <link rel="stylesheet" href="https://deeptactlearning-fonts.netlify.app/fonts.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
