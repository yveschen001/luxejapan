#!/usr/bin/env bash
# TeleSoul 國際化覆蓋率自動檢查腳本
# 作用：檢查多語言翻譯文件的完整性和一致性
# 參考: INTERNATIONALIZATION_GUIDELINES.md

set -euo pipefail

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
I18N_DIR="frontend/telesoul-app/src/locales"
DEFAULT_LANG="zh-TW"
REQUIRED_LANGS=("zh-TW" "en-US" "ja-JP")
MIN_COVERAGE=95

# 檢查語言文件完整性
check_lang_files() {
  echo "檢查語言文件完整性..."
  local missing_files=0
  
  for lang in "${REQUIRED_LANGS[@]}"; do
    if [ ! -f "$I18N_DIR/$lang.json" ]; then
      echo -e "${RED}[錯誤] 缺少語言文件: $lang.json${NC}"
      missing_files=$((missing_files + 1))
    fi
  done
  
  return $missing_files
}

# 檢查翻譯鍵值完整性
check_translation_keys() {
  echo "檢查翻譯鍵值完整性..."
  local missing_keys=0
  local default_keys=$(jq -r 'keys[]' "$I18N_DIR/$DEFAULT_LANG.json")
  
  for lang in "${REQUIRED_LANGS[@]}"; do
    if [ "$lang" = "$DEFAULT_LANG" ]; then
      continue
    fi
    
    local lang_keys=$(jq -r 'keys[]' "$I18N_DIR/$lang.json")
    local missing=$(comm -23 <(echo "$default_keys") <(echo "$lang_keys"))
    
    if [ ! -z "$missing" ]; then
      echo -e "${RED}[錯誤] $lang.json 缺少以下鍵值:${NC}"
      echo "$missing"
      missing_keys=$((missing_keys + $(echo "$missing" | wc -l)))
    fi
  done
  
  return $missing_keys
}

# 檢查翻譯覆蓋率
check_coverage() {
  echo "檢查翻譯覆蓋率..."
  local total_keys=$(jq -r 'keys[]' "$I18N_DIR/$DEFAULT_LANG.json" | wc -l)
  local coverage_errors=0
  
  for lang in "${REQUIRED_LANGS[@]}"; do
    if [ "$lang" = "$DEFAULT_LANG" ]; then
      continue
    fi
    
    local lang_keys=$(jq -r 'keys[]' "$I18N_DIR/$lang.json" | wc -l)
    local coverage=$((lang_keys * 100 / total_keys))
    
    if [ $coverage -lt $MIN_COVERAGE ]; then
      echo -e "${RED}[錯誤] $lang.json 覆蓋率過低: $coverage%${NC}"
      coverage_errors=$((coverage_errors + 1))
    else
      echo -e "${GREEN}[通過] $lang.json 覆蓋率: $coverage%${NC}"
    fi
  done
  
  return $coverage_errors
}

# 檢查翻譯格式
check_translation_format() {
  echo "檢查翻譯格式..."
  local format_errors=0
  
  for lang in "${REQUIRED_LANGS[@]}"; do
    # 檢查 JSON 格式
    if ! jq . "$I18N_DIR/$lang.json" >/dev/null 2>&1; then
      echo -e "${RED}[錯誤] $lang.json 格式錯誤${NC}"
      format_errors=$((format_errors + 1))
      continue
    fi
    
    # 檢查空值
    local empty_values=$(jq -r 'to_entries[] | select(.value == "") | .key' "$I18N_DIR/$lang.json")
    if [ ! -z "$empty_values" ]; then
      echo -e "${YELLOW}[警告] $lang.json 包含空值:${NC}"
      echo "$empty_values"
    fi
    
    # 檢查特殊字符
    local special_chars=$(jq -r 'to_entries[] | select(.value | test("[<>]")) | .key' "$I18N_DIR/$lang.json")
    if [ ! -z "$special_chars" ]; then
      echo -e "${YELLOW}[警告] $lang.json 包含特殊字符:${NC}"
      echo "$special_chars"
    fi
  done
  
  return $format_errors
}

# 生成覆蓋率報告
generate_coverage_report() {
  echo "生成覆蓋率報告..."
  local report_file="i18n-coverage-report.md"
  
  {
    echo "# 國際化覆蓋率報告"
    echo "生成時間: $(date)"
    echo
    echo "## 語言覆蓋率"
    for lang in "${REQUIRED_LANGS[@]}"; do
      if [ "$lang" = "$DEFAULT_LANG" ]; then
        continue
      fi
      local total_keys=$(jq -r 'keys[]' "$I18N_DIR/$DEFAULT_LANG.json" | wc -l)
      local lang_keys=$(jq -r 'keys[]' "$I18N_DIR/$lang.json" | wc -l)
      local coverage=$((lang_keys * 100 / total_keys))
      echo "- $lang: $coverage%"
    done
    echo
    echo "## 缺失鍵值"
    for lang in "${REQUIRED_LANGS[@]}"; do
      if [ "$lang" = "$DEFAULT_LANG" ]; then
        continue
      fi
      echo "### $lang"
      comm -23 <(jq -r 'keys[]' "$I18N_DIR/$DEFAULT_LANG.json") <(jq -r 'keys[]' "$I18N_DIR/$lang.json")
      echo
    done
  } > "$report_file"
  
  echo -e "${GREEN}報告已生成: $report_file${NC}"
}

# 主函數
main() {
  echo "開始國際化檢查..."
  
  local total_errors=0
  
  check_lang_files
  total_errors=$((total_errors + $?))
  
  check_translation_keys
  total_errors=$((total_errors + $?))
  
  check_coverage
  total_errors=$((total_errors + $?))
  
  check_translation_format
  total_errors=$((total_errors + $?))
  
  generate_coverage_report
  
  if [ $total_errors -eq 0 ]; then
    echo -e "${GREEN}所有檢查通過！${NC}"
    exit 0
  else
    echo -e "${RED}發現 $total_errors 個問題${NC}"
    exit 1
  fi
}

main 