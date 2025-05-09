#!/usr/bin/env bash
# TeleSoul 目錄樹索引自動生成腳本
# 作用：生成 docs/、infra/、scripts/ 目錄樹索引，便於審查與 onboarding
# 參考: DOCUMENTATION_GUIDELINES.md

set -euo pipefail

echo "==== docs/ 目錄樹 ===="
tree -L 2 docs/
echo

echo "==== infra/ 目錄樹 ===="
tree -L 3 infra/
echo

echo "==== scripts/ 目錄樹 ===="
tree -L 2 scripts/
echo 