const { FONT, C } = require("../constants");
const { addBoxP3, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "주요 프로젝트 02 · 영묘 (Mausoleum) — 문제 해결",
    "UE5 API 함정 · 백그라운드 버퍼 누적 · 두 시계 혼용",
    "DirectSound ID 불일치 · 버퍼 폐기 + 코덱 리셋 · 카운트 기반 페이즈 전환");

  // P3: 3개 박스 (문제당 1박스)
  addBoxP3(sld);

  const probs = [
    {
      title: "캡처 디바이스 null —\n보이스 전혀 전송 안 됨",
      problem: "마이크의 표시 이름('마이크(Realtek Audio)')을 그대로 UE5 캡처 API에 전달했더니 null을 반환했습니다. 내부에서 DirectSound 디바이스 ID와 매칭을 시도하는데, Friendly Name은 매칭에 실패합니다. 결과적으로 캡처 객체가 없어 빈 데이터만 전송되었습니다.",
      solution: "빈 문자열을 전달하면 OS 기본 장치를 선택하고 항상 유효한 캡처 객체를 반환한다는 것을 확인했습니다. 장치 이름 대신 빈 문자열로 초기화하는 것으로 수정했습니다.",
      result: "보이스 채팅 프로토타입 완료 (Day 10)",
      emphasis: true,
    },
    {
      title: "백그라운드 복귀 시\n오래된 음성 한꺼번에 재생",
      problem: "게임을 백그라운드로 전환하는 동안 마이크 캡처 버퍼가 계속 쌓입니다. 다시 포커스를 되찾으면 쌓인 버퍼가 한꺼번에 전송·재생되어 오래된 음성이 뭉쳐서 들렸습니다.",
      solution: "포커스가 복귀하는 시점에 캡처 버퍼를 전량 폐기하고 코덱 상태를 리셋했습니다. 이전 버퍼가 남아있지 않으므로 복귀 직후부터 깨끗한 음성이 전송됩니다.",
      result: "포커스 복귀 직후 깨짐 현상 해소",
      emphasis: false,
    },
    {
      title: "두 시계 혼용으로\n페이즈 타이머 오작동",
      problem: "렌더 프레임 시계와 게임 월드 시계를 목적 구분 없이 혼용했습니다. 게임이 일시정지되면 게임 시계는 멈추지만 렌더 시계는 계속 흘러, 페이즈 타이머가 멈추지 않고 진행되는 버그가 발생했습니다.",
      solution: "페이즈 전환 조건을 시간 기반에서 조각상 완료 횟수(count) 기반으로 변경했습니다. 렌더 시계는 렌더 전용, 게임 시계는 게임 로직 전용으로 사용처를 명확히 분리했습니다.",
      result: "페이즈 전환 타이밍 정확성 확보, 일시정지 연동 버그 해소",
      emphasis: false,
    },
  ];

  // P3 box X positions: 0.442 / 4.645 / 8.868
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
      x:innerXs[i], y:3.36, w:innerW, h:1.10,
      fontFace:FONT, fontSize:9, color:C.ink, lineSpacingMultiple:1.45,
    });

    sld.addText("해결", {
      x:innerXs[i], y:4.52, w:0.50, h:0.22,
      fontFace:FONT, fontSize:8.5, bold:true, color: p.emphasis ? C.brand : C.mute,
    });
    sld.addText(p.solution, {
      x:innerXs[i], y:4.76, w:innerW, h:0.75,
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

  addSoWhat(sld, "백그라운드 복귀 시 버퍼를 그대로 재생하면 사용자가 가장 먼저 체감합니다. 복귀 시 폐기가 기본값이어야 합니다.");
  addBottomStrip(sld, 6, "Source: Mausoleum — VoiceCapture 코덱 리셋 · PhaseManager 카운트 기반 전환 (2026-03)");
};
