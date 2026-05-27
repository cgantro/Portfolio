#!/bin/bash
# Brandlogy PPT Build Pipeline v11
#
# pptx 빌드 → PDF 변환 → 슬라이드별 JPG 추출 → 컬러 grep 검사
# 페이퍼로지 표준 빌드 파이프라인.
#
# 사용:
#   bash build-pipeline.sh [build_script.js] [output_dir]
#
#   기본: build-pipeline.sh index.js .
#
# 환경 요구:
#   - Node.js + pptxgenjs (전역 또는 로컬)
#   - LibreOffice (soffice)
#   - poppler-utils (pdftoppm)

set -e  # 에러 시 즉시 중단

BUILD_SCRIPT="${1:-index.js}"
OUTPUT_DIR="${2:-.}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Color codes for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}══ Brandlogy PPT Build Pipeline v11 ══${NC}"
echo "Build script: $BUILD_SCRIPT"
echo "Output dir:   $OUTPUT_DIR"
echo ""

# ────────────────────────────────────────────────────────────
# Step 0: 사전 점검
# ────────────────────────────────────────────────────────────

if [ ! -f "$BUILD_SCRIPT" ]; then
  echo -e "${RED}✗ Build script not found: $BUILD_SCRIPT${NC}"
  exit 1
fi

# ────────────────────────────────────────────────────────────
# Step 1: 컬러 grep 사전 검사 (빌드 전)
# ────────────────────────────────────────────────────────────

echo -e "${YELLOW}[1/4] Pre-build color check...${NC}"
if [ -f "$SCRIPT_DIR/color-grep.sh" ]; then
  bash "$SCRIPT_DIR/color-grep.sh" "$BUILD_SCRIPT" || {
    echo -e "${RED}✗ 금지 컬러 발견. 빌드 중단.${NC}"
    exit 1
  }
else
  echo "  (color-grep.sh not found, skipping pre-check)"
fi

# ────────────────────────────────────────────────────────────
# Step 2: PPTX 빌드
# ────────────────────────────────────────────────────────────

echo -e "${YELLOW}[2/4] Building PPTX...${NC}"
export NODE_PATH=$(npm root -g)
node "$BUILD_SCRIPT" || {
  echo -e "${RED}✗ pptxgenjs build failed${NC}"
  exit 1
}

# 빌드된 pptx 파일 찾기 (가장 최신 .pptx)
PPTX_FILE=$(ls -t *.pptx 2>/dev/null | head -1)
if [ -z "$PPTX_FILE" ]; then
  echo -e "${RED}✗ No .pptx file generated${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓ Generated: $PPTX_FILE${NC}"

# ────────────────────────────────────────────────────────────
# Step 3: PDF 변환 (LibreOffice headless)
# ────────────────────────────────────────────────────────────

echo -e "${YELLOW}[3/4] Converting to PDF...${NC}"

# Claude 환경에 있는 soffice.py 우선 사용
SOFFICE_SCRIPT="/mnt/skills/public/pptx/scripts/office/soffice.py"
if [ -f "$SOFFICE_SCRIPT" ]; then
  python3 "$SOFFICE_SCRIPT" --headless --convert-to pdf "$PPTX_FILE" --outdir "$OUTPUT_DIR"
else
  # 로컬 환경 fallback
  libreoffice --headless --convert-to pdf "$PPTX_FILE" --outdir "$OUTPUT_DIR"
fi

PDF_FILE="${PPTX_FILE%.pptx}.pdf"
if [ ! -f "$OUTPUT_DIR/$PDF_FILE" ]; then
  echo -e "${RED}✗ PDF conversion failed${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓ Generated: $PDF_FILE${NC}"

# ────────────────────────────────────────────────────────────
# Step 4: 슬라이드별 JPG 추출 (시각 검수용)
# ────────────────────────────────────────────────────────────

echo -e "${YELLOW}[4/4] Extracting slide JPGs (r=100)...${NC}"
rm -f slide-*.jpg
pdftoppm -jpeg -r 100 "$OUTPUT_DIR/$PDF_FILE" slide || {
  echo -e "${RED}✗ JPG extraction failed${NC}"
  exit 1
}

SLIDE_COUNT=$(ls slide-*.jpg 2>/dev/null | wc -l)
echo -e "${GREEN}  ✓ Extracted $SLIDE_COUNT slides${NC}"

# ────────────────────────────────────────────────────────────
# 완료
# ────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}══ Build complete ══${NC}"
echo "PPTX: $PPTX_FILE"
echo "PDF:  $OUTPUT_DIR/$PDF_FILE"
echo "JPGs: slide-*.jpg ($SLIDE_COUNT files)"
echo ""
echo "다음 단계: 슬라이드 JPG 시각 검수 (페이퍼로지 표준 루프)"
