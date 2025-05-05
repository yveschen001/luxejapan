#!/bin/bash

# 設置錯誤處理
set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 檢查代碼
check_code() {
    echo -e "\n🔍 檢查代碼..."
    
    # 運行 SwiftLint
    if ! swiftlint; then
        echo -e "${RED}❌ SwiftLint 檢查失敗${NC}"
        exit 1
    fi
    
    # 檢查 Actor 隔離
    if ! ./scripts/check_actor_isolation.sh; then
        echo -e "${RED}❌ Actor 隔離檢查失敗${NC}"
        exit 1
    fi
    
    # 檢查數據結構
    if ! python3 ./scripts/check_data_schema.py; then
        echo -e "${RED}❌ 數據結構檢查失敗${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 代碼檢查完成${NC}"
}

# 檢查文檔
check_docs() {
    echo -e "\n🔍 檢查文檔..."
    
    # 檢查文檔完整性
    if ! python3 ./scripts/check_docs.py; then
        echo -e "${RED}❌ 文檔完整性檢查失敗${NC}"
        exit 1
    fi
    
    # 檢查快捷鍵
    if ! python3 ./scripts/check_shortcuts.py; then
        echo -e "${RED}❌ 快捷鍵檢查失敗${NC}"
        exit 1
    fi
    
    # 檢查項目結構
    if ! ./scripts/check_project_structure.sh; then
        echo -e "${RED}❌ 項目結構檢查失敗${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 文檔檢查完成${NC}"
}

# 主函數
main() {
    check_code
    check_docs
}

main 