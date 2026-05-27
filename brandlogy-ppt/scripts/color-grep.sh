#!/bin/bash
# Brandlogy PPT Color Guard v11
#
# 빌드 스크립트에서 v11 금지 컬러를 검출합니다.
# 발견 시 exit code 1 → 빌드 파이프라인 자동 중단.
#
# 검출 대상:
#   - 핑크 계열: ea5ec1, FFEAF6, ec4899, f472b6, db2777
#   - 녹색 계열: 16a34a, 22c55e, 10b981, 14b8a6, 84cc16
#   - 빨강 계열: ef4444, dc2626, f87171
#   - 주황 계열: f97316, fb923c, ea580c
#   - 노랑 계열: eab308, fbbf24, facc15
#   - 보라 계열: 8b5cf6, a855f7, c084fc, 7c3aed
#
# 사용:
#   bash color-grep.sh [target_file]
#   기본: build_deck.js

TARGET="${1:-build_deck.js}"

if [ ! -f "$TARGET" ]; then
  echo "✗ Target file not found: $TARGET"
  exit 1
fi

# Brandlogy v11 금지 컬러 패턴 (대소문자 무관)
FORBIDDEN_PATTERN="ea5ec1|FFEAF6|ec4899|f472b6|db2777|16a34a|22c55e|10b981|14b8a6|84cc16|ef4444|dc2626|f87171|f97316|fb923c|ea580c|eab308|fbbf24|facc15|8b5cf6|a855f7|c084fc|7c3aed"

# 결과 캡처
RESULT=$(grep -nEi "$FORBIDDEN_PATTERN" "$TARGET" 2>/dev/null || true)

if [ -n "$RESULT" ]; then
  echo "✗ 금지 컬러 발견 ($TARGET):"
  echo ""
  echo "$RESULT"
  echo ""
  echo "v11 컬러 정책: 블루(brand 4F6EF1 계열) + 그레이만 사용."
  echo "시멘틱: 상승=brand/brandDeep, 하락=mute/caption"
  exit 1
fi

echo "✓ 컬러 검사 통과: 금지 컬러 0개 ($TARGET)"
exit 0
