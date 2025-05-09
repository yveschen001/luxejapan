#!/usr/bin/env bash
# TeleSoul 文檔引用完整性自動檢查腳本
# 作用：檢查 docs/ 下所有規範文檔是否被主文檔引用，並檢查文檔格式規範
# 參考: DOCUMENTATION_GUIDELINES.md

set -euo pipefail

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
DOCS_DIR="docs"
MAIN_DOCS="DOCUMENTATION_GUIDELINES.md product-requirements.md README.md"
REQUIRED_SECTIONS=("## 概述" "## 參考" "## 更新記錄")
MAX_LINE_LENGTH=100

# 檢查文檔引用
check_doc_references() {
  echo "檢查文檔引用..."
  local missing_refs=0
  
  for file in $(find "$DOCS_DIR" -type f -name '*.md' | grep -vE 'README.md|index.md'); do
    local fname=$(basename "$file")
    local found=0
    
    for main in $MAIN_DOCS; do
      if grep -q "$fname" "$main" 2>/dev/null; then
        found=1
        break
      fi
    done
    
    if [ $found -eq 0 ]; then
      echo -e "${RED}[錯誤] $fname 未被主文檔引用${NC}"
      missing_refs=$((missing_refs + 1))
    fi
  done
  
  return $missing_refs
}

# 檢查文檔格式
check_doc_format() {
  echo "檢查文檔格式..."
  local format_errors=0
  
  for file in $(find "$DOCS_DIR" -type f -name '*.md'); do
    # 檢查必需章節
    for section in "${REQUIRED_SECTIONS[@]}"; do
      if ! grep -q "^$section" "$file"; then
        echo -e "${RED}[錯誤] $file 缺少必需章節: $section${NC}"
        format_errors=$((format_errors + 1))
      fi
    done
    
    # 檢查行長度
    if grep -q ".\{$MAX_LINE_LENGTH,\}" "$file"; then
      echo -e "${YELLOW}[警告] $file 包含超過 $MAX_LINE_LENGTH 字符的行${NC}"
    fi
    
    # 檢查文件頭部元數據
    if ! grep -q "^---" "$file" || ! grep -q "^---" "$file" | tail -n 1; then
      echo -e "${YELLOW}[警告] $file 缺少 YAML 頭部元數據${NC}"
    fi
  done
  
  return $format_errors
}

# 檢查文檔更新時間
check_doc_freshness() {
  echo "檢查文檔更新時間..."
  local stale_docs=0
  local MAX_AGE_DAYS=90
  
  for file in $(find "$DOCS_DIR" -type f -name '*.md'); do
    local last_modified=$(stat -f "%m" "$file")
    local current_time=$(date +%s)
    local age_days=$(( (current_time - last_modified) / 86400 ))
    
    if [ $age_days -gt $MAX_AGE_DAYS ]; then
      echo -e "${YELLOW}[警告] $file 已 $age_days 天未更新${NC}"
      stale_docs=$((stale_docs + 1))
    fi
  done
  
  return $stale_docs
}

# 主函數
main() {
  echo "開始文檔檢查..."
  
  local total_errors=0
  
  check_doc_references
  total_errors=$((total_errors + $?))
cd "$DOCS_DIR"
for file in $(find . -type f -name '*.md' | grep -vE 'README.md|index.md'); do
  fname=$(basename "$file")
  found=0
  for main in $MAIN_DOCS; do
    if grep -q "$fname" "../$main" 2>/dev/null; then
      found=1
      break
    fi
  done
  if [ $found -eq 0 ]; then
    echo "[WARN] $fname 未被主文檔引用"
  fi
done 