#!/bin/bash

# 文檔時間戳更新腳本
# 用於更新所有文檔的最後修改時間

# 設置錯誤處理
set -e

# 更新時間
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

# 更新關鍵文檔
for doc in SPEC.md SHORTCUTS.md UI_GUIDELINES.md QA_AUTOCHECK.md APPSTORE_NOTES.md DATA_SCHEMA.md SECURITY_POLICY.md IMAGE_RECOGNITION_RULES.md STYLE_GUIDE.md CONTRIBUTING.md; do
    if [ -f "docs/$doc" ]; then
        # 更新文檔頭部時間戳
        sed -i '' "1s/^# 最後更新：.*$/# 最後更新：$TIMESTAMP\n/" "docs/$doc"
        echo "✅ 更新 $doc 時間戳"
    fi
done

# 更新其他文檔
for file in docs/*.md; do
    if [ -f "$file" ]; then
        # 更新文檔頭部時間戳
        sed -i '' "1s/^# 最後更新：.*$/# 最後更新：$TIMESTAMP\n/" "$file"
        echo "✅ 更新 $(basename "$file") 時間戳"
    fi
done

echo "✅ 所有文檔時間戳更新完成" 