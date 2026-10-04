// 카카오톡·노션·슬랙에 주소를 붙였을 때 뜨는 미리보기 카드(1200×630).
// 빌드 때 한 번 그려 정적 이미지로 나간다. 글꼴은 페이퍼로지 실물 파일(TTF)을 쓴다.

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

const mark = {
  background: "#DCEBEA",
  color: "#2C5A5E",
  borderRadius: 6,
  padding: "2px 10px",
  marginRight: 14,
  fontWeight: 700,
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
          background: "#F2F1EF",
          padding: "56px 64px",
          fontFamily: "Paperlogy",
          color: "#2E3142",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#3C6D71",
              color: "#fff",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 22,
            }}
          >
            #
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 54, fontWeight: 700 }}>마크다운 바로보기</div>
            <div style={{ fontSize: 26, color: "#6B6E7C", marginTop: 4 }}>왼쪽에 쓰면, 오른쪽에 결과가 바로 보입니다</div>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 44, flex: 1 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "2px solid #DDDBD6",
              borderRadius: 18,
              padding: "28px 32px",
              fontSize: 30,
              lineHeight: 1.6,
              color: "#474A5A",
            }}
          >
            <div>{"# 오늘 배울 것"}</div>
            <div>{"- 제목 만들기"}</div>
            <div>{"- **굵게** 쓰기"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 48, color: "#3C6D71", margin: "0 24px" }}>→</div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#fff",
              border: "2px solid #B9D2D0",
              borderRadius: 18,
              padding: "24px 32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", fontSize: 46, fontWeight: 700, paddingBottom: 8, borderBottom: "3px solid #2E3142" }}>
              <span style={{ ...mark, fontSize: 26 }}>#</span>오늘 배울 것
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 30, marginTop: 16 }}>
              <span style={{ ...mark, fontSize: 22 }}>-</span>제목 만들기
            </div>
            <div style={{ display: "flex", alignItems: "center", fontSize: 30, marginTop: 8 }}>
              <span style={{ ...mark, fontSize: 22 }}>-</span>
              <span style={{ fontWeight: 700 }}>굵게</span>
              <span style={{ marginLeft: 8 }}>쓰기</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginTop: 28, fontSize: 24, color: "#6B6E7C" }}>
          <div style={{ width: 36, height: 5, background: "#3C6D71", marginRight: 14 }} />
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
