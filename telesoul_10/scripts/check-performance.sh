#!/usr/bin/env bash
# TeleSoul 性能檢查腳本
# 作用：檢查系統性能指標，包括 API 響應時間、數據庫查詢性能、緩存命中率等
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
MAX_DB_QUERY_TIME=500   # 毫秒
MIN_CACHE_HIT_RATE=80   # 百分比

# 檢查 API 性能
check_api_performance() {
  echo "檢查 API 性能..."
  local total_time=0
  local requests=10
  
  for i in $(seq 1 $requests); do
    local start_time=$(date +%s%N)
    curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" > /dev/null
    local end_time=$(date +%s%N)
    local request_time=$(( (end_time - start_time) / 1000000 ))
    total_time=$((total_time + request_time))
  done
  
  local avg_time=$((total_time / requests))
  
  if [ $avg_time -le $MAX_RESPONSE_TIME ]; then
    echo -e "${GREEN}[通過] API 平均響應時間: ${avg_time}ms${NC}"
  else
    echo -e "${RED}[錯誤] API 響應時間過長: ${avg_time}ms${NC}"
    return 1
  fi
}

# 檢查數據庫性能
check_database_performance() {
  echo "檢查數據庫性能..."
  local start_time=$(date +%s%N)
  PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null
  local end_time=$(date +%s%N)
  local query_time=$(( (end_time - start_time) / 1000000 ))
  
  if [ $query_time -le $MAX_DB_QUERY_TIME ]; then
    echo -e "${GREEN}[通過] 數據庫查詢時間: ${query_time}ms${NC}"
  else
    echo -e "${RED}[錯誤] 數據庫查詢時間過長: ${query_time}ms${NC}"
    return 1
  fi
}

# 檢查緩存性能
check_cache_performance() {
  echo "檢查緩存性能..."
  local hits=0
  local misses=0
  local total=10
  
  for i in $(seq 1 $total); do
    local key="test_key_$i"
    redis-cli -h "$CACHE_HOST" -p "$CACHE_PORT" set "$key" "test_value" > /dev/null
    if redis-cli -h "$CACHE_HOST" -p "$CACHE_PORT" get "$key" > /dev/null; then
      hits=$((hits + 1))
    else
      misses=$((misses + 1))
    fi
  done
  
  local hit_rate=$((hits * 100 / total))
  
  if [ $hit_rate -ge $MIN_CACHE_HIT_RATE ]; then
    echo -e "${GREEN}[通過] 緩存命中率: ${hit_rate}%${NC}"
  else
    echo -e "${RED}[錯誤] 緩存命中率過低: ${hit_rate}%${NC}"
    return 1
  fi
}

# 檢查內存使用
check_memory_performance() {
  echo "檢查內存使用..."
  local total_mem=$(free -m | awk '/Mem:/ {print $2}')
  local used_mem=$(free -m | awk '/Mem:/ {print $3}')
  local free_mem=$(free -m | awk '/Mem:/ {print $4}')
  local usage_percent=$((used_mem * 100 / total_mem))
  
  if [ $usage_percent -lt 90 ]; then
    echo -e "${GREEN}[通過] 內存使用率: ${usage_percent}%${NC}"
    echo "總內存: ${total_mem}MB"
    echo "已用內存: ${used_mem}MB"
    echo "可用內存: ${free_mem}MB"
  else
    echo -e "${RED}[錯誤] 內存使用率過高: ${usage_percent}%${NC}"
    return 1
  fi
}

# 檢查 CPU 使用
check_cpu_performance() {
  echo "檢查 CPU 使用..."
  local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
  
  if (( $(echo "$cpu_usage < 80" | bc -l) )); then
    echo -e "${GREEN}[通過] CPU 使用率: ${cpu_usage}%${NC}"
  else
    echo -e "${RED}[錯誤] CPU 使用率過高: ${cpu_usage}%${NC}"
    return 1
  fi
}

# 檢查磁盤 I/O
check_disk_io() {
  echo "檢查磁盤 I/O..."
  local io_stats=$(iostat -d -x 1 1 | grep -v "Device" | grep -v "^$")
  local read_ops=$(echo "$io_stats" | awk '{print $4}')
  local write_ops=$(echo "$io_stats" | awk '{print $5}')
  
  if [ "$read_ops" -lt 1000 ] && [ "$write_ops" -lt 1000 ]; then
    echo -e "${GREEN}[通過] 磁盤 I/O 正常${NC}"
    echo "讀取操作: ${read_ops}/s"
    echo "寫入操作: ${write_ops}/s"
  else
    echo -e "${RED}[錯誤] 磁盤 I/O 過高${NC}"
    return 1
  fi
}

# 生成 JSON 格式報告
generate_json_report() {
  local report="{
    \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
    \"api\": {
      \"avg_response_time\": ${avg_time:-0}
    },
    \"database\": {
      \"query_time\": ${query_time:-0}
    },
    \"cache\": {
      \"hit_rate\": ${hit_rate:-0}
    },
    \"system\": {
      \"memory_usage\": ${usage_percent:-0},
      \"cpu_usage\": ${cpu_usage:-0},
      \"disk_io\": {
        \"read_ops\": ${read_ops:-0},
        \"write_ops\": ${write_ops:-0}
      }
    }
  }"
  
  echo "$report"
}

# 主函數
main() {
  echo "開始性能檢查..."
  
  local total_errors=0
  
  check_api_performance
  total_errors=$((total_errors + $?))
  
  check_database_performance
  total_errors=$((total_errors + $?))
  
  check_cache_performance
  total_errors=$((total_errors + $?))
  
  check_memory_performance
  total_errors=$((total_errors + $?))
  
  check_cpu_performance
  total_errors=$((total_errors + $?))
  
  check_disk_io
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