#!/bin/bash
set -e

PROJECT_PATH="/Users/yichen/Downloads/cursor/autoclickxcode/AutoClicker"
PROJECT_FILE="$PROJECT_PATH/AutoClicker.xcodeproj/project.pbxproj"
SCHEME="AutoClicker"

cd "$PROJECT_PATH"

function clean_all() {
    echo "🧹 清理 DerivedData..."
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    xcodebuild clean -project AutoClicker.xcodeproj -scheme $SCHEME
}

function build_project() {
    echo "🚀 開始編譯..."
    xcodebuild -project AutoClicker.xcodeproj -scheme $SCHEME -configuration Release build | tee build.log
}

function fix_multiple_commands() {
    echo "🔍 嘗試自動修復 Multiple commands produce 問題..."
    # 取得重複資源名稱
    local duplicate=$(grep -oE "Multiple commands produce '[^']+'" build.log | head -1 | sed "s/Multiple commands produce '//;s/'//")
    if [[ -z "$duplicate" ]]; then
        echo "❌ 未發現重複資源，無法自動修復。"
        return 1
    fi
    echo "⚠️ 發現重複資源：$duplicate"
    # 備份 project.pbxproj
    cp "$PROJECT_FILE" "$PROJECT_FILE.bak"
    # 自動移除重複 entry（僅移除一個，保留一份）
    local count=$(grep -c "$duplicate" "$PROJECT_FILE")
    if [[ $count -le 1 ]]; then
        echo "⚠️ 專案檔案中僅有一份，無需修復。"
        return 1
    fi
    # 只保留第一個，移除後續
    awk -v file="$duplicate" '
    BEGIN{found=0}
    {
        if(index($0, file)>0){
            if(found==0){found=1; print $0}
            else{print "// [AutoFix] Removed duplicate: " $0}
        }else{
            print $0
        }
    }' "$PROJECT_FILE" > "$PROJECT_FILE.tmp"
    mv "$PROJECT_FILE.tmp" "$PROJECT_FILE"
    echo "✅ 已自動移除重複 entry，請重新編譯。"
    return 0
}

# 主流程
clean_all
build_project || {
    if grep -q "Multiple commands produce" build.log; then
        fix_multiple_commands && {
            echo "🔄 重新嘗試編譯..."
            build_project
        }
    else
        echo "❌ 編譯失敗，請檢查 build.log"
        exit 1
    fi
}

echo "🎉 編譯成功！" 