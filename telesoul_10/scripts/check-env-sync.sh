#!/usr/bin/env bash
# TeleSoul 環境變數同步性自動檢查腳本
# 版本: 1.0.0
# 最后更新: 2024-03-21
# 作用：比對 .env.example 與 ENVIRONMENT_VARIABLE_GUIDELINES.md 變數，檢查格式與安全性
# 參考: docs/dev/ENVIRONMENT_VARIABLE_GUIDELINES.md

set -euo pipefail

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
ENV_FILE=".env.example"
GUIDE="docs/dev/ENVIRONMENT_VARIABLE_GUIDELINES.md"
REQUIRED_PREFIXES=(
  "NODE_"      # 全域配置
  "DB_"        # 資料庫配置
  "REDIS_"     # 快取配置
  "MINIO_"     # 對象存儲配置
  "JWT_"       # 安全配置
  "TELEGRAM_"  # Telegram 配置
  "FIREBASE_"  # Firebase 配置
  "TON_"       # TON 配置
  "SUMSUB_"    # KYC 配置
  "VERIFF_"    # KYC 配置
  "GCP_"       # 雲端部署配置
  "SMTP_"      # 郵件配置
  "MAIL_"      # 郵件配置
  "SLACK_"     # Slack 配置
  "WEBHOOK_"   # Webhook 配置
  "LOG_"       # 日誌配置
  "AUTH_"      # 認證配置
  "API_"       # API 配置
  "CORS_"      # CORS 配置
  "BACKUP_"    # 備份配置
  "DR_"        # 災難恢復配置
  "DEPLOYMENT_" # 部署配置
  "NGINX_"     # Nginx 配置
  "PHP_"       # PHP 配置
  "ELK_"       # ELK 配置
  "DATA_"      # 數據配置
  "AUDIT_"     # 審計配置
  "GDPR_"      # GDPR 配置
  "CCPA_"      # CCPA 配置
  "MAINTENANCE_" # 維護配置
  "DOCKER_"    # Docker 配置
  "IMAGE_"     # 鏡像配置
  "K8S_"       # Kubernetes 配置
)

SENSITIVE_VARS=(
  "SECRET"
  "KEY"
  "PASSWORD"
  "TOKEN"
  "CREDENTIALS"
  "PRIVATE"
  "ACCESS"
)

# 變量類型正則表達式
TYPE_PATTERNS=(
  "string:^[a-zA-Z0-9_\-\.]+$"
  "number:^[0-9]+$"
  "boolean:^(true|false)$"
  "duration:^[0-9]+[smhd]$"
  "ip:^([0-9]{1,3}\.){3}[0-9]{1,3}(/[0-9]{1,2})?$"
  "url:^https?://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(/[a-zA-Z0-9\-\._~:/?#[\]@!$&'()*+,;=]*)?$"
  "email:^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)

# 檢查變數同步性
check_var_sync() {
  echo "檢查環境變數同步性..."
  local sync_errors=0
  
  # 獲取變數列表
  local env_vars=$(grep -E '^[A-Z0-9_]+=' "$ENV_FILE" | cut -d= -f1 | sort | uniq)
  local guide_vars=$(grep -E '^[A-Z0-9_]+:' "$GUIDE" | cut -d: -f1 | sort | uniq)
  
  # 檢查只在 .env.example 中出現的變數
  echo -e "\n${YELLOW}只在 .env.example 中出現的變數:${NC}"
  comm -23 <(echo "$env_vars") <(echo "$guide_vars") || true
  
  # 檢查只在指南中出現的變數
  echo -e "\n${YELLOW}只在 ENVIRONMENT_VARIABLE_GUIDELINES.md 中出現的變數:${NC}"
  comm -13 <(echo "$env_vars") <(echo "$guide_vars") || true
  
  # 檢查變數命名規範
  echo -e "\n${YELLOW}檢查變數命名規範...${NC}"
  for var in $env_vars; do
    local valid_prefix=0
    for prefix in "${REQUIRED_PREFIXES[@]}"; do
      if [[ $var == $prefix* ]]; then
        valid_prefix=1
        break
      fi
    done
    
    if [ $valid_prefix -eq 0 ]; then
      echo -e "${RED}[錯誤] 變數 $var 不符合命名規範${NC}"
      sync_errors=$((sync_errors + 1))
    fi
  done
  
  return $sync_errors
}

# 檢查敏感變數
check_sensitive_vars() {
  echo "檢查敏感變數..."
  local sensitive_errors=0
  
  for var in $(grep -E '^[A-Z0-9_]+=' "$ENV_FILE" | cut -d= -f1); do
    for sensitive in "${SENSITIVE_VARS[@]}"; do
      if [[ $var == *$sensitive* ]]; then
        if ! grep -q "^\s*$var:" "$GUIDE"; then
          echo -e "${RED}[錯誤] 敏感變數 $var 未在指南中標記${NC}"
          sensitive_errors=$((sensitive_errors + 1))
        fi
        
        # 檢查敏感變數的默認值
        local value=$(grep -E "^$var=" "$ENV_FILE" | cut -d= -f2)
        if [[ $value != "changeme" && $value != "your-*" && $value != "xxx" && $value != "yyy" ]]; then
          echo -e "${RED}[錯誤] 敏感變數 $var 的默認值不符合規範${NC}"
          sensitive_errors=$((sensitive_errors + 1))
        fi
      fi
    done
  done
  
  return $sensitive_errors
}

# 檢查變數格式
check_var_format() {
  echo "檢查變數格式..."
  local format_errors=0
  
  while IFS= read -r line; do
    if [[ $line =~ ^[A-Z0-9_]+= ]]; then
      local var=${line%%=*}
      local value=${line#*=}
      
      # 檢查值是否為空
      if [ -z "$value" ]; then
        echo -e "${YELLOW}[警告] 變數 $var 的值為空${NC}"
      fi
      
      # 檢查值是否包含特殊字符
      if [[ $value =~ [^a-zA-Z0-9_\-\.] ]]; then
        echo -e "${YELLOW}[警告] 變數 $var 的值包含特殊字符${NC}"
      fi
      
      # 檢查布爾值
      if [[ $value == "true" || $value == "false" ]]; then
        if ! grep -q "^\s*$var:.*boolean" "$GUIDE"; then
          echo -e "${YELLOW}[警告] 布爾變數 $var 未在指南中標記類型${NC}"
        fi
      fi
      
      # 檢查數字值
      if [[ $value =~ ^[0-9]+$ ]]; then
        if ! grep -q "^\s*$var:.*number" "$GUIDE"; then
          echo -e "${YELLOW}[警告] 數字變數 $var 未在指南中標記類型${NC}"
        fi
      fi
      
      # 檢查時間值
      if [[ $value =~ ^[0-9]+[smhd]$ ]]; then
        if ! grep -q "^\s*$var:.*duration" "$GUIDE"; then
          echo -e "${YELLOW}[警告] 時間變數 $var 未在指南中標記類型${NC}"
        fi
      fi
      
      # 檢查 IP 地址
      if [[ $value =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}(/[0-9]{1,2})?$ ]]; then
        if ! grep -q "^\s*$var:.*ip" "$GUIDE"; then
          echo -e "${YELLOW}[警告] IP 地址變數 $var 未在指南中標記類型${NC}"
        fi
      fi
      
      # 檢查 URL
      if [[ $value =~ ^https?://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(/[a-zA-Z0-9\-\._~:/?#[\]@!$&'()*+,;=]*)?$ ]]; then
        if ! grep -q "^\s*$var:.*url" "$GUIDE"; then
          echo -e "${YELLOW}[警告] URL 變數 $var 未在指南中標記類型${NC}"
        fi
      fi
      
      # 檢查郵箱
      if [[ $value =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        if ! grep -q "^\s*$var:.*email" "$GUIDE"; then
          echo -e "${YELLOW}[警告] 郵箱變數 $var 未在指南中標記類型${NC}"
        fi
      fi
    fi
  done < "$ENV_FILE"
  
  return $format_errors
}

# 檢查文件頭部
check_file_header() {
  echo "檢查文件頭部..."
  local header_errors=0
  
  # 檢查 .env.example
  if ! grep -q "^# TeleSoul 环境变量配置示例" "$ENV_FILE"; then
    echo -e "${RED}[錯誤] .env.example 缺少標準文件頭部${NC}"
    header_errors=$((header_errors + 1))
  fi
  
  # 檢查指南文件
  if ! grep -q "^# ENVIRONMENT_VARIABLE_GUIDELINES.md" "$GUIDE"; then
    echo -e "${RED}[錯誤] ENVIRONMENT_VARIABLE_GUIDELINES.md 缺少標準文件頭部${NC}"
    header_errors=$((header_errors + 1))
  fi
  
  return $header_errors
}

# 檢查變量分組
check_var_groups() {
  echo "檢查變量分組..."
  local group_errors=0
  
  # 檢查每個分組是否都有對應的變量
  local groups=(
    "全域"
    "資料庫"
    "快取"
    "對象存儲"
    "第三方服務"
    "安全"
    "雲端部署"
    "郵件"
    "通知"
    "監控"
    "備份"
    "災難恢復"
    "部署"
    "性能"
    "日誌"
    "合規"
    "維護"
    "CI/CD"
  )
  
  for group in "${groups[@]}"; do
    if ! grep -q "^\* \*\*$group\*\*" "$GUIDE"; then
      echo -e "${YELLOW}[警告] 指南中缺少 $group 分組${NC}"
      group_errors=$((group_errors + 1))
    fi
  done
  
  return $group_errors
}

# 主函數
main() {
  echo "開始環境變數檢查..."
  
  local total_errors=0
  
  check_file_header
  total_errors=$((total_errors + $?))
  
  check_var_sync
  total_errors=$((total_errors + $?))
  
  check_sensitive_vars
  total_errors=$((total_errors + $?))
  
  check_var_format
  total_errors=$((total_errors + $?))
  
  check_var_groups
  total_errors=$((total_errors + $?))
  
  if [ $total_errors -eq 0 ]; then
    echo -e "${GREEN}所有檢查通過！${NC}"
    exit 0
  else
    echo -e "${RED}發現 $total_errors 個問題${NC}"
    exit 1
  fi
}

main 