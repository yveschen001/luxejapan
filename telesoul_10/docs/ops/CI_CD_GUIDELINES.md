# CI/CD 指南 (CI_CD_GUIDELINES.md)

## 1. 架構概覽
- 使用 GitHub Actions + Docker + Terraform/Helm
- 分支策略：
  - `feature/*` → PR 到 `develop`
  - `release/*` → tag → `main` → 觸發部署

## 2. 流水線階段
1. **Lint & Format** (`prettier`, `eslint`)
2. **單元 & 集成測試** (`npm test`, `pytest`)
3. **契約測試** (`pact:verify`)
4. **E2E & 回歸測試** (`cypress`, `storybook:build + chromatic`)
5. **性能 & 安全掃描** (`k6`, `snyk`, `sonar-scanner`)
6. **構建 & 鏡像推送** (`docker build`, `docker push`)

## 3. 環境變數注入
- CI 從 GitHub Secrets / Vault 拉取：
  - `.env.test` 用於測試
  - `.env.production` 用於生產
- Playbook 與部署腳本自動注入相應 ENV

## 4. 金絲雀 & 藍綠部署
- **金絲雀**：
  - 在 `deploy-canary.sh` 中，用 Cloud Run/ArgoCD 發布金絲雀版本
  - 通過 `scripts/canary-healthcheck.sh` 驗證新版本健康後再全量
- **藍綠**：
  - `deploy-bluegreen.sh` 切換流量：先部署 Green，驗證後切流量到 Green

## 5. 回滾策略
- `scripts/rollback.sh`：
  - 檢查上一個成功的鏡像或 Helm Release
  - 恢復到上一個穩定版本
- 自動觸發：健康檢查失敗或監控告警時執行

## 6. Playbook 集成
- CI 在 `playbook.yaml` 執行結束後，再執行部署階段：
  ```yaml
  - name: Run Cursor Playbook
    run: node scripts/run-playbook.js playbook.yaml --env ${ENV}
  - name: Deploy to Env
    run: scripts/deploy-${{ env }}.sh
  ```
- Playbook 支持自動化初始化、微服務腳手架、資料庫遷移、API、健康檢查、Bot、前後端、報表、UI 測試、壓測、安全、契約、Analytics、端到端部署等全鏈路自動化。
- 參見 `playbook.yaml` 及 `.cursor-todo.yaml` 詳細任務定義。

## 7. 參考與最佳實踐
- 詳細環境變數規範請參見 [../dev/ENVIRONMENT_VARIABLE_GUIDELINES.md](../dev/ENVIRONMENT_VARIABLE_GUIDELINES.md)
- 可觀測性與健康檢查請參見 [OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md)
- 災難恢復與合規請參見 [DISASTER_RECOVERY_GUIDELINES.md](./DISASTER_RECOVERY_GUIDELINES.md)
- 其他自動化腳本與規範請參見 [playbook.yaml](../../playbook.yaml)

---

*End of CI_CD_GUIDELINES.md* 