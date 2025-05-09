#!/usr/bin/env bash
# TeleSoul 系統健康檢查腳本
# 作用：檢查系統各項指標，包括 API 可用性、數據庫連接、緩存狀態等
# 參考: OBSERVABILITY_GUIDELINES.md

set -euo pipefail

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
API_URL="http://localhost:3000"
DB_HOST="localhost"
DB_PORT="5432"
CACHE_HOST="localhost"
CACHE_PORT="6379"
MAX_RESPONSE_TIME=1000  # 毫秒

# 檢查 API 健康狀態
check_api_health() {
  echo "檢查 API 健康狀態..."
  local start_time=$(date +%s%N)
  local response=$(curl -s -w "\n%{http_code}" "$API_URL/health")
  local end_time=$(date +%s%N)
  local response_time=$(( (end_time - start_time) / 1000000 ))
  local status_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | sed '$d')
  
  if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}[通過] API 健康檢查${NC}"
    echo "響應時間: ${response_time}ms"
    echo "響應內容: $body"
  else
    echo -e "${RED}[錯誤] API 健康檢查失敗${NC}"
    echo "狀態碼: $status_code"
    echo "響應內容: $body"
    return 1
  fi
  
  if [ $response_time -gt $MAX_RESPONSE_TIME ]; then
    echo -e "${YELLOW}[警告] API 響應時間過長: ${response_time}ms${NC}"
  fi
}

# 檢查數據庫連接
check_database() {
  echo "檢查數據庫連接..."
  if pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1; then
    echo -e "${GREEN}[通過] 數據庫連接正常${NC}"
  else
    echo -e "${RED}[錯誤] 數據庫連接失敗${NC}"
    return 1
  fi
}

# 檢查緩存服務
check_cache() {
  echo "檢查緩存服務..."
  if redis-cli -h "$CACHE_HOST" -p "$CACHE_PORT" ping >/dev/null 2>&1; then
    echo -e "${GREEN}[通過] 緩存服務正常${NC}"
  else
    echo -e "${RED}[錯誤] 緩存服務異常${NC}"
    return 1
  fi
}

# 檢查磁盤空間
check_disk_space() {
  echo "檢查磁盤空間..."
  local threshold=90
  local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
  
  if [ "$usage" -lt "$threshold" ]; then
    echo -e "${GREEN}[通過] 磁盤空間充足: ${usage}%${NC}"
  else
    echo -e "${RED}[錯誤] 磁盤空間不足: ${usage}%${NC}"
    return 1
  fi
}

# 檢查內存使用
check_memory() {
  echo "檢查內存使用..."
  local threshold=90
  local usage=$(free | awk '/Mem:/ {print int($3/$2 * 100)}')
  
  if [ "$usage" -lt "$threshold" ]; then
    echo -e "${GREEN}[通過] 內存使用正常: ${usage}%${NC}"
  else
    echo -e "${RED}[錯誤] 內存使用過高: ${usage}%${NC}"
    return 1
  fi
}

# 檢查系統負載
check_load() {
  echo "檢查系統負載..."
  local threshold=$(nproc)
  local load=$(uptime | awk -F'load average:' '{ print $2 }' | awk -F',' '{ print $1 }' | tr -d ' ')
  
  if (( $(echo "$load < $threshold" | bc -l) )); then
    echo -e "${GREEN}[通過] 系統負載正常: $load${NC}"
  else
    echo -e "${RED}[錯誤] 系統負載過高: $load${NC}"
    return 1
  fi
}

# 生成 JSON 格式報告
generate_json_report() {
  local report="{
    \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"api\": {
      \"status\": \"$([ $? -eq 0 ] && echo "healthy" || echo "unhealthy")\",
      \"response_time\": ${response_time:-0}
    },
    \"database\": {
      \"status\": \"$([ $? -eq 0 ] && echo "healthy" || echo "unhealthy")\"
    },
    \"cache\": {
      \"status\": \"$([ $? -eq 0 ] && echo "healthy" || echo "unhealthy")\"
    },
    \"system\": {
      \"disk_usage\": ${usage:-0},
      \"memory_usage\": ${memory_usage:-0},
      \"load_average\": ${load:-0}
    }
  }"
  
  echo "$report"
}

# 主函數
main() {
  echo "開始系統健康檢查..."
  
  local total_errors=0
  
  check_api_health
  total_errors=$((total_errors + $?))
  
  check_database
  total_errors=$((total_errors + $?))
  
  check_cache
  total_errors=$((total_errors + $?))
  
  check_disk_space
  total_errors=$((total_errors + $?))
  
  check_memory
  total_errors=$((total_errors + $?))
  
  check_load
  total_errors=$((total_errors + $?))
  
  if [ "${1:-}" = "--json" ]; then
    generate_json_report
  fi
  
  if [ $total_errors -eq 0 ]; then
    echo -e "${GREEN}所有檢查通過！${NC}"
    exit 0
  else
    echo -e "${RED}發現 $total_errors 個問題${NC}"
    exit 1
  fi
}

main "$@" 