const { FONT, C } = require("../constants");
const { addBoxP3, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "주요 프로젝트 03 · STICKER — 문제 해결",
    "DB-SQS 정합성 · Poison Pill · Refresh Token 탈취",
    "afterCommit() 훅 · ACK 전략 분리 · Refresh Token Rotation");

  addBoxP3(sld);

  const probs = [
    {
      title: "DB 커밋 전 SQS 발행\n→ 데이터 불일치",
      problem: "트랜잭션 안에서 SQS 메시지를 발행했더니 DB가 롤백되어도 메시지는 이미 큐에 들어간 상태가 됩니다. AI 서버가 메시지를 소비해 DB에 없는 데이터를 참조하면서 오류가 발생했습니다.",
      solution: "TransactionSynchronization.afterCommit() 훅에 SQS 발행 로직을 등록했습니다. DB 커밋이 완료된 이후에만 실행되므로 롤백 시에는 메시지가 발행되지 않습니다.",
      result: "DB 상태와 메시지 큐 상태의 일관성 보장",
      emphasis: true,
    },
    {
      title: "SQS 메시지 유실 vs\n무한 재시도 딜레마",
      problem: "처리 실패 메시지를 즉시 삭제하면 유실되고, 무조건 재시도하면 항상 실패하는 poison pill 메시지가 큐 전체를 블록합니다. 이 두 가지를 동시에 막아야 했습니다.",
      solution: "에러 종류를 두 가지로 분류해 ack 전략을 분리했습니다. 비즈니스 로직 오류는 즉시 삭제합니다. 인프라 오류는 ack를 보류해 visibility timeout 후 자동 재큐됩니다.",
      result: "메시지 유실 없이 poison pill 격리",
      emphasis: false,
    },
    {
      title: "Refresh Token\n탈취 대응",
      problem: "탈취된 Refresh Token이 재사용되어도 서버가 구분할 방법이 없습니다. 기존 토큰과 새 토큰이 동시에 유효한 상태가 유지되어 공격자가 계속 세션을 유지할 수 있었습니다.",
      solution: "토큰 교환 시 기존 토큰을 즉시 폐기합니다. 이미 폐기된 토큰으로 재시도가 들어오면 탈취로 판단하고 해당 사용자의 모든 세션을 강제 만료합니다.",
      result: "탈취 토큰으로 로그인 시도 시 전체 세션 강제 만료",
      emphasis: false,
    },
  ];

  const boxXs = [0.442, 4.645, 8.868];
  const innerXs = [0.622, 4.825, 9.048];
  const innerW = 3.643;

  probs.forEach((p, i) => {
    if (p.emphasis) {
      addEmphasisCard(sld, boxXs[i], 2.22, 4.003, 3.81);
    }

    sld.addText(p.title, {
      x:innerXs[i], y:2.38, w:innerW, h:0.60,
      fontFace:FONT, fontSize:10.5, bold:true,
      color: p.emphasis ? C.brand : C.ink, lineSpacingMultiple:1.2,
    });

    sld.addShape("line", { x:innerXs[i], y:3.04, w:innerW - 0.10, h:0.01, line:{ color: p.emphasis ? C.brandT4 : C.containerLine, width:0.7 } });

    sld.addText("문제", {
      x:innerXs[i], y:3.12, w:0.50, h:0.22,
      fontFace:FONT, fontSize:8.5, bold:true, color:C.mute,
    });
    sld.addText(p.problem, {
      x:innerXs[i], y:3.36, w:innerW, h:1.08,
      fontFace:FONT, fontSize:9, color:C.ink, lineSpacingMultiple:1.45,
    });

    sld.addText("해결", {
      x:innerXs[i], y:4.50, w:0.50, h:0.22,
      fontFace:FONT, fontSize:8.5, bold:true, color: p.emphasis ? C.brand : C.mute,
    });
    sld.addText(p.solution, {
      x:innerXs[i], y:4.74, w:innerW, h:0.78,
      fontFace:FONT, fontSize:9, color: p.emphasis ? C.brand : C.ink,
      bold: p.emphasis, lineSpacingMultiple:1.45,
    });

    sld.addShape("roundRect", {
      x:innerXs[i], y:5.58, w:innerW, h:0.26,
      fill:{ color: p.emphasis ? C.brandPale : C.surface2 },
      line:{ color: p.emphasis ? C.brandT3 : C.containerLine, width:1 },
      rectRadius:0.05,
    });
    sld.addText(p.result, {
      x:innerXs[i] + 0.08, y:5.58, w:innerW - 0.16, h:0.26,
      fontFace:FONT, fontSize:8.5, color: p.emphasis ? C.brand : C.mute, valign:"middle",
    });
  });

  addSoWhat(sld, "SQS는 같은 메시지를 두 번 이상 전달할 수 있습니다. 언제 삭제하고 언제 보류할지 오류 분류가 핵심입니다.");
  addBottomStrip(sld, 8, "Source: STICKER — afterCommit · SmartLifecycle · TokenRotationService.java (2026-05)");
};
