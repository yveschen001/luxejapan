#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys

def check_docs():
    """檢查文檔一致性"""
    docs_dir = "docs"
    errors = []
    warnings = []

    # 檢查 docs 目錄是否存在
    if not os.path.exists(docs_dir):
        errors.append(f"錯誤：{docs_dir} 目錄不存在")
        return errors, warnings

    # 檢查必需的文檔
    required_docs = [
        "FINAL_CHECKLIST.md",
        "NEXT_TASKS.md",
        "LocalTestPlan.md",
        "REQUIREMENTS.md",
        "ENVIRONMENT_CONFIG.md",
        "SECURITY_POLICY.md",
        "UI_GUIDELINES.md",
        "MODULE_MANAGEMENT.md",
        "STYLE_GUIDE.md",
        "SHORTCUTS.md",
        "PROJECT_SYNC_PLAN.md",
        "APPSTORE_NOTES.md",
        "DATA_SCHEMA.md",
        "CONTRIBUTING.md",
        "PROJECT_PLAN_TODO.md",
        "QA_AUTOCHECK.md",
        "IMAGE_RECOGNITION_RULES.md",
        "SPEC.md",
        "UI_TESTS_PLAN.md"
    ]

    for doc in required_docs:
        doc_path = os.path.join(docs_dir, doc)
        if not os.path.exists(doc_path):
            errors.append(f"錯誤：{doc} 不存在")
            continue

        # 檢查文檔內容
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()

            # 檢查自動化校驗要求區塊
            if "## 自動化校驗要求" not in content:
                warnings.append(f"警告：{doc} 未檢測到「自動化校驗要求」區塊")

    return errors, warnings

def main():
    """主函數"""
    errors, warnings = check_docs()

    # 輸出警告
    for warning in warnings:
        print(warning)

    # 輸出錯誤
    for error in errors:
        print(error)

    # 如果有錯誤，返回非零狀態碼
    if errors:
        sys.exit(1)

if __name__ == "__main__":
    main() 