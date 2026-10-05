// 카카오톡·노션·슬랙에 주소를 붙였을 때 뜨는 미리보기 카드(1200×630).
// 빌드 때 한 번 그려 정적 이미지로 나간다. 글꼴은 페이퍼로지 실물 파일(TTF)을 쓴다(Satori는 woff2를 못 읽는다).
//
// ⭐ 노션 북마크는 가운데 약 780px(x 211~989)만 잘라 보여준다 → 모든 내용을 정중앙 700px 안에 모은다.
//    (2026-10-05 왼쪽 정렬 판에서 제목 앞부분이 잘려 소장님 지적)

import { ImageResponse } from "next/og";

export const alt = "마크다운 바로보기 — 왼쪽에 쓰면 오른쪽에 결과가 바로 보입니다";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_BASE = "https://cdn.jsdelivr.net/gh/fonts-archive/Paperlogy";

async function loadFont(weight: string): Promise<ArrayBuffer> {
  const res = await fetch(`${FONT_BASE}/Paperlogy-${weight}.ttf`);
  if (!res.ok) throw new Error(`페이퍼로지 글꼴을 받지 못했습니다(${weight}): ${res.status}`);
  return res.arrayBuffer();
}

const box = {
  display: "flex",
  flexDirection: "column" as const,
  width: 290,
  height: 150,
  padding: "20px 24px",
  borderRadius: 14,
  background: "#fff",
};

export default async function Image() {
  const [bold, medium] = await Promise.all([loadFont("7Bold"), loadFont("5Medium")]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F2F1EF",
          fontFamily: "Paperlogy",
          color: "#2E3142",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: "#3C6D71",
            color: "#fff",
            fontSize: 46,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          #
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 22, letterSpacing: -1 }}>마크다운 바로보기</div>
        <div style={{ fontSize: 28, color: "#6B6E7C", marginTop: 8 }}>왼쪽에 쓰면, 오른쪽에 결과가 바로 보입니다</div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
          <div style={{ ...box, border: "2px solid #DDDBD6", fontSize: 24, lineHeight: 1.55, color: "#474A5A" }}>
            <div>{"# 오늘 배울 것"}</div>
            <div>{"- 제목 만들기"}</div>
            <div>{"- **굵게** 쓰기"}</div>
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#3C6D71", margin: "0 26px" }}>→</div>
          <div style={{ ...box, border: "2px solid #B9D2D0" }}>
            <div style={{ fontSize: 34, fontWeight: 700 }}>오늘 배울 것</div>
            <div style={{ display: "flex", fontSize: 24, marginTop: 10 }}>
              <span style={{ marginRight: 10 }}>•</span>제목 만들기
            </div>
            <div style={{ display: "flex", fontSize: 24, marginTop: 4 }}>
              <span style={{ marginRight: 10 }}>•</span>
              <span style={{ fontWeight: 700 }}>굵게</span>
              <span style={{ marginLeft: 6 }}>쓰기</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 36, fontSize: 22, color: "#6B6E7C" }}>
          <div style={{ width: 30, height: 4, background: "#3C6D71", marginRight: 12 }} />
          딥택트러닝
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Paperlogy", data: bold, weight: 700, style: "normal" },
        { name: "Paperlogy", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
