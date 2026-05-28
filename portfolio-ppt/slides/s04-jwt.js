const { FONT, C } = require("../constants");
const { addBoxP1, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 01 · Autowing_car — 인증 설계",
    "WebSocket은 헤더를 못 써서 토큰이 URL에 드러난다 — 전용 1분 토큰으로 노출 시간을 줄였다",
    "JWT 3종 분리 · Spring Security · Redis Refresh Token Rotation");

  addBoxP1(sld);

  const tokens = [
    {
      name:"ACCESS TOKEN",  life:"15분",
      why:"REST API는 Authorization 헤더\n사용 가능 → 표준 방식으로 충분",
      use:"일반 API 요청 인증",
      color:C.brand, emphasis:false,
    },
    {
      name:"SOCKET TOKEN",  life:"1분",
      why:"WebSocket 핸드셰이크는 커스텀\n헤더 불가 → 토큰을 URL 파라미터에\n포함해야 함 → 노출 시간을 1분으로\n제한해 탈취 피해 범위를 줄임",
      use:"WebSocket 연결 1회 전용",
      color:C.brandDeep, emphasis:true,
    },
    {
      name:"REFRESH TOKEN", life:"7일",
      why:"장기 유효 → DB 대신 Redis에\nTTL로 저장. 이미 사용된 토큰이\n다시 들어오면 해당 계정 전체\n세션을 무효화하는 로직 구현",
      use:"토큰 갱신 전용",
      color:C.mute, emphasis:false,
    },
  ];

  tokens.forEach((t, i) => {
    const bx = 0.722 + i * 4.1;
    if (t.emphasis) addEmphasisCard(sld, bx - 0.10, 2.42, 3.95, 3.35);

    sld.addText(t.name, {
      x:bx, y:2.60, w:3.75, h:0.32,
      fontFace:FONT, fontSize:10, bold:true, color:t.color,
    });
    sld.addShape("roundRect", {
      x:bx, y:3.00, w:0.85, h:0.28,
      fill:{ color: t.emphasis ? C.brandPale : C.surface2 },
      line:{ color: t.emphasis ? C.brandT3 : C.containerLine, width:1 },
      rectRadius:0.05,
    });
    sld.addText(t.life, {
      x:bx, y:3.00, w:0.85, h:0.28,
      fontFace:FONT, fontSize:9, bold:true, color:t.color, align:"center", valign:"middle",
    });
    sld.addText(t.use, {
      x:bx, y:3.35, w:3.75, h:0.28,
      fontFace:FONT, fontSize:10, color:C.ink,
    });
    sld.addText(t.why, {
      x:bx, y:3.72, w:3.75, h:1.40,
      fontFace:FONT, fontSize:9.5, color:C.mute, lineSpacingMultiple:1.5,
    });
  });

  sld.addText("로그인 시 3종 토큰 동시 발급  ·  SOCKET 토큰은 WebSocket 연결 1회에만 사용, 이후 폐기", {
    x:0.722, y:5.38, w:11.89, h:0.30,
    fontFace:FONT, fontSize:9.5, color:C.mute, align:"center",
  });

  addSoWhat(sld, "WebSocket은 토큰을 URL에 실어야 하는 구조입니다. 수명을 1분으로 제한해 탈취 시 피해 범위를 줄였습니다.");
  addBottomStrip(sld, 4, "Source: Autowing_car — JWT 토큰 설계 커밋 (2026-01)");
};
