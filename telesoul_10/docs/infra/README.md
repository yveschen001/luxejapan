# infra/ 目錄說明

本目錄為 TeleSoul 專案基礎設施即代碼（IaC）與部署自動化的唯一權威來源。

## 結構總覽

```
infra/
├── terraform/           # Terraform 配置與模組
│   ├── providers.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── modules/         # 可複用模組（VPC、GKE、CloudSQL、Redis、Storage）
│   └── envs/            # 各環境變數（dev、staging、prod）
├── helm-charts/         # Helm Chart 部署模板
│   ├── auth-service/    # 各微服務 Chart
│   └── umbrella/        # umbrella chart 匯總
├── k8s/                 # Kustomize/K8s manifests
│   ├── base/            # 公共資源
│   └── overlays/        # 各環境 patch
├── scripts/             # 基礎設施自動化腳本
│   ├── infra-bootstrap.sh
│   ├── deploy-terraform.sh
│   ├── helm-deploy.sh
│   └── rollback.sh
```

## 主要用途
- **Terraform**：GCP/VPC/GKE/CloudSQL/Redis/Storage 等資源自動化管理
- **Helm**：微服務應用部署、升級、回滾
- **Kustomize/K8s**：多環境部署差異化管理
- **scripts/**：一鍵初始化、部署、回滾、權限設置等

## 相關文檔引用
- 詳細規範請參見 [DOCUMENTATION_GUIDELINES.md](../../DOCUMENTATION_GUIDELINES.md)
- 快速上手指南請參見 [../QUICKSTART.md](../QUICKSTART.md)
- 產品需求與架構請參見 [../product-requirements.md](../product-requirements.md)
- Playbook 任務與自動化流程請參見 [../../playbook.yaml](../../playbook.yaml)

---

*本目錄所有資源、腳本、配置變更必須經審查並記錄於 CHANGELOG.md* 