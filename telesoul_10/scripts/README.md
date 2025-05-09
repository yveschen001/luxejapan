# scripts/ 目錄說明

本目錄集中存放 TeleSoul 專案所有自動化腳本，涵蓋開發、部署、合規、監控、回滾等全鏈路自動化。

## 標準腳本列表
- run-playbook.js：執行 playbook.yaml 任務流（參見 playbook.yaml）
- deploy-gcp.sh：GCP 雲端部署腳本（參見 infra/README.md）
- deploy-local.sh：本地一鍵部署腳本（參見 QUICKSTART.md）
- rollback.sh：自動回滾腳本（參見 CI_CD_GUIDELINES.md）
- compliance-check.sh：合規自測入口腳本（參見 COMPLIANCE_GUIDELINES.md）
- metrics-healthcheck.sh：業務指標健康檢查（參見 OBSERVABILITY_GUIDELINES.md）
- check-elk.sh：ELK 日誌聚合健康檢查（參見 OBSERVABILITY_GUIDELINES.md）
- check-jaeger.sh：Jaeger 追蹤健康檢查（參見 OBSERVABILITY_GUIDELINES.md）
- check-prometheus.sh：Prometheus 指標健康檢查（參見 OBSERVABILITY_GUIDELINES.md）

## 維護規範
- 所有腳本必須加註引用文檔與用途說明
- 腳本變更需經審查並記錄於 CHANGELOG.md
- 具體參見 [DOCUMENTATION_GUIDELINES.md](../DOCUMENTATION_GUIDELINES.md) 