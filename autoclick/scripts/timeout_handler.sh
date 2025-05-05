#!/bin/bash

# 設置錯誤處理
set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 超時處理函數
handle_timeout() {
    local command=$1
    local timeout=$2
    local pid
    
    # 啟動命令
    eval "$command" &
    pid=$!
    
    # 設置超時
    (
        sleep $timeout
        if kill -0 $pid 2>/dev/null; then
            echo -e "${RED}❌ 命令超時：$command${NC}"
            kill $pid 2>/dev/null
        fi
    ) &
    
    # 等待命令完成
    wait $pid
    local exit_code=$?
    
    # 記錄超時日誌
    if [ $exit_code -eq 124 ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 命令超時：$command, 超時時間：$timeout 秒" >> timeout.log
    fi
    
    return $exit_code
}

# 主函數
main() {
    echo -e "${GREEN}✅ 超時處理系統已啟動${NC}"
}

main 