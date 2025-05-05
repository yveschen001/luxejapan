#!/bin/bash
# 檢查所有 Service/Manager/單例類別 static let shared 或 class 是否有 @MainActor 標註
# 若有違規，則輸出錯誤並返回非零 exit code

violations=$(grep -r -E '@MainActor.*(class|static let shared)' AutoClicker/Services AutoClicker/ViewModels AutoClicker/Models AutoClicker/Views)

if [[ ! -z "$violations" ]]; then
  echo "[ERROR] 禁止在 Service/Manager/單例類別 static let shared 或 class 上加 @MainActor："
  echo "$violations"
  exit 1
else
  echo "[PASS] 無 @MainActor 標註於單例 class 或 shared，符合規範。"
  exit 0
fi 