# Documentation Guidelines

> 本文件為 TeleSoul 專案文檔管理唯一指導規範，任何修改必須經資深工程師審查並通過 PR 流程，嚴禁未經審查隨意修改。

> Purpose: Ensure all project documentation is clear, consistent, maintainable, and professional.

## 1. Structure & Organization
- Only keep global, cross-module files in the root (e.g., CHANGELOG.md, product-requirements.md, .cursorrules).
- **全專案僅允許根目錄有一份 .cursorrules，嚴禁子目錄或自動化流程生成多餘副本，發現即自動刪除。**
- All code, modules, and documentation must be organized in their respective subfolders (e.g., telesoul-v2/).
- Documentation folders (e.g., docs/) must be further divided by topic (design, api, deployment, development, etc.).

## 2. Naming Conventions
- All files must use English, lowercase, kebab-case (e.g., api-spec.md, deployment-guide.md).
- File names must clearly reflect the content (no "final", "new", "v2", etc.).
- Use version control for history, not in file names.

## 3. File Header Standard
Each document must start with:
- File name
- Version
- Last modified date
- Author
- Brief description

## 4. Content Standards
- Use structured Markdown: headings, subheadings, lists, tables.
- Assign clear responsibility and review process for each document.
- 代碼風格請參見 [CODE_STYLE_GUIDELINES.md](./CODE_STYLE_GUIDELINES.md)
- 測試規範請參見 [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md)
- 自動修復規範請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)
- 環境變數規範請參見 [ENVIRONMENT_VARIABLE_GUIDELINES.md](./ENVIRONMENT_VARIABLE_GUIDELINES.md)
- 可觀測性規範請參見 [OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md)
- 合規自測規範請參見 [ops/COMPLIANCE_GUIDELINES.md](./ops/COMPLIANCE_GUIDELINES.md)
- 災難恢復規範請參見 [sop/DISASTER_RECOVERY_GUIDELINES.md](./sop/DISASTER_RECOVERY_GUIDELINES.md)
- CI/CD 規範請參見 [ci-cd/PLAYBOOK_CI_CD.md](./ci-cd/PLAYBOOK_CI_CD.md)
- 快速上手指南請參見 [QUICKSTART.md](./QUICKSTART.md)
- API 文檔生成規範請參見 [api-spec/GENERATE_DOCS.md](./api-spec/GENERATE_DOCS.md)
- 國際化規範請參見 [INTERNATIONALIZATION_GUIDELINES.md](./INTERNATIONALIZATION_GUIDELINES.md)
- **所有 DB/Redis/MinIO 相關文檔、腳本、compose 必須交叉引用，並於 README.md、MAINTENANCE_GUIDELINES.md、DOCKER_DEVELOPMENT_GUIDELINES.md 補充引用**
- **所有自動化入口腳本（如 dev-init.sh、clean-docker.sh）必須在 README.md、MAINTENANCE_GUIDELINES.md、CONTRIBUTING.md 交叉引用**

## 5. Maintenance & Versioning
- All changes must be logged in CHANGELOG.md with a summary and reason.
- Major changes require team review, version, and effective date.
- Deprecated/obsolete docs must be removed or archived, and referenced in main docs.
- **CI/CD pipeline 必須自動檢查並清理多餘 .cursorrules，只保留根目錄一份。**

## 6. Cross-Referencing
- Use relative Markdown links for all cross-document references.
- List and link all key docs in the main README or index file.
- 國際化相關文檔請務必交叉引用 [INTERNATIONALIZATION_GUIDELINES.md](./INTERNATIONALIZATION_GUIDELINES.md)
- 快速上手指南請參見 [QUICKSTART.md](./QUICKSTART.md)

## 7. Review & Collaboration
- New or major changes require PR and review by a senior engineer.
- Review for: accuracy, clarity, naming, professionalism.
- 國際化/i18n 相關內容須參考 [INTERNATIONALIZATION_GUIDELINES.md](./INTERNATIONALIZATION_GUIDELINES.md) 並經專人審查。
- Team should regularly review and update docs.

## 8. Automation & Tools
- Use Markdown linter, spell checker, etc. for quality.
- Consider CI checks for documentation quality.
- 自動化腳本需遵循 [OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md) 中的日誌與追蹤規範。
- API 文檔自動生成與發布流程請參見 [api-spec/GENERATE_DOCS.md](./api-spec/GENERATE_DOCS.md)。

## 9. Consistency Across Architecture, Directory, and Microservices

- All service names, responsibilities, and tech stacks must be consistent across the architecture blueprint, directory structure, and microservices split sections.
- Maintain a "service naming mapping table" in the main requirements doc; update all related sections when adding or changing services.
- The main requirements doc should provide an overview; detailed specs should be in dedicated sub-docs and referenced via links.
- Regularly review documentation for consistency across architecture, directory, microservices, and API specs.

## 10. 部署與回滾策略

- 金絲雀發布與藍綠部署策略請參見 [ci-cd/PLAYBOOK_CI_CD.md](./ci-cd/PLAYBOOK_CI_CD.md)。
- 回滾策略與自動化腳本請參見 [ci-cd/PLAYBOOK_CI_CD.md](./ci-cd/PLAYBOOK_CI_CD.md)。
- 部署相關的環境變數與配置請參見 [ENVIRONMENT_VARIABLE_GUIDELINES.md](./ENVIRONMENT_VARIABLE_GUIDELINES.md)。

## 11. 合規自測與業務指標

- 合規自測規範請參見 [ops/COMPLIANCE_GUIDELINES.md](./ops/COMPLIANCE_GUIDELINES.md)。
- 合規自測規範請參見 [sop/DISASTER_RECOVERY_GUIDELINES.md](./sop/DISASTER_RECOVERY_GUIDELINES.md)。
- 業務指標監控規範請參見 [OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md)。
- 自動化腳本與驗證流程請參見 [playbook.yaml](./playbook.yaml)。

## 12. Docker 環境檢查

- Docker 環境檢查請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md) 及 `scripts/check-docker.sh`

## 13. Ansible Playbook

- **如有 Ansible Playbook，請優先使用 `ansible-playbook playbook.yaml` 進行全自動化流程。**
- `ansible/` 目錄用於存放 Ansible Playbook、roles、inventory、group_vars 等自動化資產，所有自動化流程建議優先以 Ansible Playbook 實現，並於主文檔、維護、貢獻文檔交叉引用。

---

維護規範與自動化自審請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)

**Documentation is as important as code. Follow these guidelines for every new file, reference, and PR.** 