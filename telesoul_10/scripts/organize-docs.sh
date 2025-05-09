#!/usr/bin/env bash
# TeleSoul 文檔自動整理腳本
# 作用：自動整理 docs/ 目錄下的文檔，按類別移動到子目錄，並自動刪除多餘 .cursorrules
# 參考: DOCUMENTATION_GUIDELINES.md
# 使用方法：
#   chmod +x scripts/organize-docs.sh
#   ./scripts/organize-docs.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$ROOT_DIR/docs"

echo "整理 docs/ 目錄..."
cd "$DOCS_DIR"

for file in *.md; do
  case "$file" in
    AUTO_FIX_GUIDELINES.md|CODE_STYLE_GUIDELINES.md|ENVIRONMENT_VARIABLE_GUIDELINES.md|TESTING_GUIDELINES.md)
      target_dir="dev" ;;
    CI_CD_GUIDELINES.md|COMPLIANCE_GUIDELINES.md|OBSERVABILITY_GUIDELINES.md|DISASTER_RECOVERY_GUIDELINES.md)
      target_dir="ops" ;;
    UI_DESIGN_GUIDELINES.md|USER_EXPERIENCE_GUIDELINES.md|COMPONENT_LIBRARY.md|DESIGN_SYSTEM.md|INTERNATIONALIZATION_GUIDELINES.md)
      target_dir="ui" ;;
    USER_RESEARCH.md)
      target_dir="research" ;;
    QUICKSTART.md)
      target_dir="quickstart" ;;
    *)
      continue ;;
  esac
  mkdir -p "$target_dir"
  mv "$file" "$target_dir/"
  echo "Moved $file -> docs/$target_dir/"
done

# 自動刪除多餘 .cursorrules，只保留根目錄一份
find "$ROOT_DIR" -name '.cursorrules' ! -path "$ROOT_DIR/.cursorrules" -exec rm -f {} + 2>/dev/null || true

echo "整理完成。請檢查 docs/ 目錄結構："
tree -L 2 "$DOCS_DIR" 