<!--
File: product-requirements.md
Version: 0.2.0
Last Modified: 2025-04-11
Author: TeleSoul Team
Description: TeleSoul 平台全模組開發需求與規格，供全端團隊依據執行。
WARNING: 本文件為唯一權威需求依據，任何修改必須經 PM/Tech Lead 審查並通過 Pull Request 流程，嚴禁未經審查隨意修改。
-->

# TeleSoul 平台 — Cursor 用開發需求規格

---

## 目錄

1. 概述與目標
2. 功能需求

   1. 用戶認證與綁定
   2. 音視頻匹配與計費
   3. 支付與提領
   4. KYC 驗證
   5. 後台管理
   6. 報表與快照模組
3. 非功能需求

   1. 日誌與審計
   2. 監控與告警
   3. 測試策略
   4. 性能與壓測
   5. 安全加固
   6. 合規與數據保留
4. 技術棧
5. 系統架構藍圖
6. 資料模型與表結構
7. API 端點設計
8. 開發迭代計劃
9. 部署與 DevOps
10. 文檔與知識庫
11. 附录：相关技术文档链接
12. 设计评审与潜在挑战
13. 用户行为监控（Firebase 集成）
14. 倉庫及文件夾結構
15. 指導文件規劃與關聯
16. 微服務架構與模塊化拆分建議
17. 需求追蹤矩陣（Traceability Matrix）
18. 版本與審核歷史（Version & Review History）
19. 典型用戶場景（User Scenarios）
20. 自動化與CI/CD規範
21. API/資料表變更管理
22. 國際化與多語言支持（i18n）
23. 附錄：常見問答（FAQ）

---

## 1. 概述與目標

**TeleSoul**旨在建立一個高可用、高擴展、可追溯的音視頻社交平台，支持Telegram Bot與手機Web多端啟動，結合秒級計費、USDT提領、及即時運營報表與快照。此需求文檔供Cursor團隊按模組開發。

---

## 2. 功能需求

### 2.1 用戶認證與綁定

* **自動識別啟動來源**：

  * Bot：入口URL帶`?auth=telegram` → 直用Telegram OAuth → 後端建立/映射用戶 → 返回JWT。
  * Web：首屏選擇「Google 登錄」或「Telegram 登錄」→ Firebase Auth JS SDK / Telegram Login Widget。
* **個人資料綁定**：

  * Endpoint `POST /api/user/bind`，body `{ type: 'google'|'telegram', oauth_token }`。
  * 資料寫入 `user_oauth_links(user_id,type,oauth_id)`。

### 2.2 音視頻匹配與計費

* **匹配流程**：

  1. `POST /api/match` → 加入 Redis queue。
  2. 匹配成功推送 `roomId`。
* **秒級計費**：

  * 事件：用戶進/出房間觸發計費事件。
  * 計費記錄表 `billing_events`，秒級匯總至 `call_charges`。

### 2.3 支付與提領

* **前端**：Ton Connect SDK 呼起錢包、發起USDT轉帳。
* **後端**：

  1. `POST /api/withdraw/apply`，記錄pending。
  2. 自動審核：24:00前未處理的pending批量標記 `approved_by_system`。
  3. 審核日誌記錄於 `withdrawal_audit_logs`。

### 2.4 KYC 驗證

* **前端**：集成SumSub/Veriff JS SDK。
* **後端**：Webhook接收 → 更新`user_kyc_status` → 失敗重試3次 → 通知客服界面。

### 2.5 後台管理

* **角色**：PlatformAdmin、AgentAdmin、Viewer。
* **功能**：

  * 用戶列表（脫敏）、通話/交易明細、提領審核、KYC批量審核。
  * RBAC驗證每個API。

### 2.6 報表與快照模組

* **排程**：每日 UTC16:00（台北0:00） via Bull + Redis。
* **快照內容**：

  * 金幣/鑽石流動、儲值/提領、活躍數據、審核行為、排行榜Top30。
* **存儲**：

  * 主表`daily_snapshots(id,date,version,payload JSONB)`
  * 分表：`metrics_transactions`、`metrics_user_activity`、`metrics_withdrawal_summary`、`metrics_agent_earnings`。
* **API**：

  * `GET /admin/metrics/daily?date=&agentId=`
  * `GET /admin/snapshot/{date}?format=csv|json`
  * `GET /admin/withdrawals/summary?from=&to=`
  * `GET /admin/leaderboard?type=&date=&topN=`

---

## 3. 非功能需求

### 3.1 日誌與審計

* **API請求**：記錄`request_id,user_id,endpoint,status,latency`。
* **審計日誌**：關鍵操作（提領、KYC狀態、封禁）寫`reporting_audit_logs`，保留180天。
* **分布式追蹤**：使用 OpenTelemetry + Jaeger，采樣率 1%。
* **日誌聚合**：統一推送至 ELK/EFK，結構化 JSON 格式。

### 3.2 監控與告警

* **指標**：uptime、P50/P95/P99、錯誤率、匹配成功率、KYC通過率。
* **工具**：ELK/EFK 或 Grafana Loki + Prometheus。
* **告警**：ErrorRate>1%持續5min→Slack；提領失敗率>2%→PagerDuty。
* **可觀測性**：詳見 [OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md)

### 3.3 測試策略

* **單元測試**：覆蓋≥80%。
* **集成測試**：腳本化模擬完整流程。
* **E2E測試**：Cypress/Playwright 驅動MiniApp。
* **契約測試**：使用Pact。

### 3.4 性能與壓測

* **目標**：匹配<200ms；API P99<250ms；並發≥10k。
* **工具**：k6 / Locust。

### 3.5 安全加固

* **靜態掃描**：ESLint + SonarQube。
* **依賴管理**：Dependabot。
* **速率限制**：100rpm；敏感10rpm。
* **WAF**：防注入/XSS/CSRF。
* **加密**：PostgreSQL敏感欄位AES-256；備份上傳S3時加密。

### 3.6 合規與數據保留

* **保留策略**：KYC文件、通話錄音保留180天；到期自動清除。
* **用戶導出/刪除API**：`GET /user/export` & `DELETE /user/data`。
* **合規自測規範**：詳見 [ops/COMPLIANCE_GUIDELINES.md](../ops/COMPLIANCE_GUIDELINES.md)

### 3.3 合規自測

* **GDPR/CCPA 合規**：
  * 定期執行用戶數據刪除腳本，驗證 `/user/data` 接口
  * 自動化腳本：`scripts/compliance-check.sh`
  * 驗證腳本：`scripts/compliance-verify.js`
* **KYC 數據管理**：
  * 測試數據保留與自動清除邏輯
  * 確保過期記錄被脫敏或刪除
  * 詳見 [sop/DISASTER_RECOVERY_GUIDELINES.md](./sop/DISASTER_RECOVERY_GUIDELINES.md)

### 3.4 業務指標監控

* **數據收集**：
  * Firebase Analytics、Mixpanel 等埋點數據 ETL 到內部 BI
  * 自動化腳本：`scripts/metrics-ingest.sh`
* **KPI 監控**：
  * 次日留存率 ≥ 40%
  * 付費轉化率 ≥ 5%
  * 匹配成功率 ≥ 95%
* **健康檢查**：
  * 自動化腳本：`scripts/metrics-healthcheck.sh`
  * 驗證腳本：`scripts/metrics-verify.js`
* **詳見**：[OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md)

---

## 4. 技術棧

* **前端**：Vue3/React + Vite + Telegram JS SDK v7+。
* **通話**：Agora Web SDK v4.x。
* **Auth**：Firebase Auth v9+。
* **後端**：NestJS v10 或 FastAPI v0.95。
* **DB**：PostgreSQL 14+。
* **緩存/隊列**：Redis 7.x + BullMQ。
* **CI/CD**：GitHub Actions。
* **部署**：Docker + Fly.io / AWS ECS。
* **可觀測性**：OpenTelemetry + Jaeger + ELK + Prometheus + Grafana。
* **代碼風格與提交規範**：詳見 [CODE_STYLE_GUIDELINES.md](./CODE_STYLE_GUIDELINES.md)
* **測試規範**：詳見 [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md)
* **自動修復規範**：詳見 [AUTO_FIX_GUIDELINES.md](./AUTO_FIX_GUIDELINES.md)
* **環境變數規範**：詳見 [ENVIRONMENT_VARIABLE_GUIDELINES.md](./ENVIRONMENT_VARIABLE_GUIDELINES.md)
* **可觀測性規範**：詳見 [OBSERVABILITY_GUIDELINES.md](./OBSERVABILITY_GUIDELINES.md)
* **災難恢復規範**：詳見 [sop/DISASTER_RECOVERY_GUIDELINES.md](./sop/DISASTER_RECOVERY_GUIDELINES.md)

---

## 5. 系統架構藍圖

> 本章為系統總覽，所有服務命名、責任、技術棧需與第14、16章保持一致。詳細職責與技術細節請參見後續章節。

```text
[Browser H5]
  ├─ Auth → Google/Firebase or Telegram Login
  ├─ WebRTC UI → Agora
  ├─ Ton Connect Wallet
  └─→ [API Gateway]
        ├─ AuthService
        ├─ UserService
        ├─ MatchService
        ├─ BillingService
        ├─ PaymentService
        ├─ KYCService
        ├─ ReportingService
        └─ AdminService
```

---

## 6. 資料模型與表結構

### 6.1 核心表設計

```sql
-- 用戶與 OAuth 綁定
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_user_id VARCHAR UNIQUE,
  google_uid VARCHAR UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_oauth_links (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(16) NOT NULL,           -- 'google' or 'telegram'
  oauth_id VARCHAR NOT NULL,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- 配對與通話計費
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user_a INT REFERENCES users(id),
  user_b INT REFERENCES users(id),
  room_id VARCHAR UNIQUE,
  matched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing_events (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches(id),
  timestamp TIMESTAMPTZ NOT NULL,
  billing_second INT NOT NULL
);

CREATE TABLE call_charges (
  id SERIAL PRIMARY KEY,
  match_id INT REFERENCES matches(id),
  user_id INT REFERENCES users(id),
  total_seconds INT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  charged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 提領與審核
CREATE TABLE withdrawals (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  amount_usd NUMERIC(12,4) NOT NULL,
  status VARCHAR(32) NOT NULL,         -- pending, approved_by_system, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE withdrawal_audit_logs (
  id SERIAL PRIMARY KEY,
  withdrawal_id INT REFERENCES withdrawals(id),
  action VARCHAR(32) NOT NULL,
  actor VARCHAR(64) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC 資料
CREATE TABLE user_kyc (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  provider VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,         -- pending, passed, failed
  result_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 報表快照
CREATE TABLE daily_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  version INT NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(snapshot_date, version)
);
```

### 6.2 分表與索引策略

* `metrics_transactions`、`metrics_user_activity`、`metrics_withdrawal_summary` 等按月分區。
* 在 `user_id`、`snapshot_date`、`agent_id` 上建立 B-Tree 索引。
* 對 JSONB payload 建立 GIN 索引以加速特定欄位查詢（如 coins.in、diamonds.gen）。

---

## 7. API 端點詳表

| 路徑                         | 方法   | 參數                          | 描述                               |          |
| -------------------------- | ---- | --------------------------- | -------------------------------- | -------- |
| /api/auth/telegram         | GET  | ?auth=telegram              | Bot 啟動入口，完成 Telegram OAuth → JWT |          |
| /api/auth/google           | GET  | -                           | Firebase Google OAuth → JWT      |          |
| /api/user/bind             | POST | { type, oauth_token }      | 綁定 Telegram/Google 帳號            |          |
| /api/match                 | POST | -                           | 發起匹配，加入 queue，返回 roomId          |          |
| /api/call/start            | POST | { roomId }                  | 通話開始觸發計費事件                       |          |
| /api/call/end              | POST | { roomId }                  | 通話結束，計算總時長與費用                    |          |
| /api/withdraw/apply        | POST | { amount_usd }             | 用戶申請提領，記錄 pending                |          |
| /api/withdraw/auto-approve | POST | -                           | Cron 任務：批量系統自動審核                 |          |
| /api/kyc/webhook           | POST | SumSub/Veriff Callback Body | 接收 KYC 結果，更新狀態                   |          |
| /admin/metrics/daily       | GET  | date, agentId               | 當日即時金幣／鑽石統計                      |          |
| /admin/snapshot/{date}     | GET  | format=csv                  | json                             | 指定日期快照報表 |
| /admin/withdrawals/summary | GET  | from, to                    | 提領統計                             |          |
| /admin/leaderboard         | GET  | type, date, topN            | 排行榜TopN（diamonds/gifts）          |          |

> **回應格式**：統一 JSON Envelope `{ code, message, data }`，並包含 `request_id`。

---

## 8. 開發迭代計劃

| Sprint | 目標 & 驗收標準                                            |
| ------ | ---------------------------------------------------- |
| 1      | 用戶認證 & 綁定 (Bot/Web)，測試覆蓋率 ≥ 80%                      |
| 2      | KYC 流程：上傳 + Webhook 回寫，完整通過/失敗測試                     |
| 3      | 匹配 & 通話計費：Redis Queue → 房間建立 → 秒級計費事件                |
| 4      | TON USDT 提領：SDK 集成、pending 流程、系統自動審核                 |
| 5      | 後台管理初版：用戶列表、通話 / 提領 / KYC 审核                         |
| 6      | 報表快照：排程任務 → 寫入 `daily_snapshots` → Redis 快取 → API 驗證 |
| 7      | 非功能驗收：API P99 < 200ms；ErrorRate < 1%；安全測試通過          |
| 8      | 部署 & 文檔：OpenAPI Spec、ER 圖、運維手冊；上線 Fly.io 或 AWS ECS   |

---

## 9. 部署與 DevOps

* **容器化**：使用 Dockerfile（Node / Python Slim），並推至私有 Registry。
* **CI/CD**：GitHub Actions multi-workflow：

  * PR lint / test / build
  * main 分支自動部署 staging
  * tagged release → 部署 production
* **Secrets 管理**：Vault 或 GitHub Secrets 存放 API Key、DB 密碼。
* **環境**：`staging`、`preprod`、`prod`，配合各自配置文件。
* **部署策略**：
  * 金絲雀發布：詳見 [ci-cd/PLAYBOOK_CI_CD.md](./ci-cd/PLAYBOOK_CI_CD.md)
  * 藍綠部署：詳見 [ci-cd/PLAYBOOK_CI_CD.md](./ci-cd/PLAYBOOK_CI_CD.md)
  * 自動回滾：詳見 [ci-cd/PLAYBOOK_CI_CD.md](./ci-cd/PLAYBOOK_CI_CD.md)

## 10. 文檔與知識庫

* **API 文檔**：OpenAPI 3.0 + Swagger UI
* **架構圖 & ER 圖**：存儲於 Wiki，定期更新
* **測試報告**：覆蓋率、壓測結果匯總
* **運維手冊**：包含日常運維、故障排查、DR 演練流程
* **快速上手指南**：詳見 [QUICKSTART.md](./QUICKSTART.md)
* **API 文檔生成**：詳見 [api-spec/GENERATE_DOCS.md](./api-spec/GENERATE_DOCS.md)
* **國際化規範**：詳見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md)
* **合規自測規範**：詳見 [ops/COMPLIANCE_GUIDELINES.md](../ops/COMPLIANCE_GUIDELINES.md)

---

## 11. 附录：相关技术文档链接

* **Telegram Login Widget & Bot API**

  * 登录组件：[https://core.telegram.org/widgets/login](https://core.telegram.org/widgets/login)
  * Bot API：[https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

* **Google OAuth / Firebase Auth**

  * Google Identity Platform：[https://developers.google.com/identity](https://developers.google.com/identity)
  * Firebase Auth 文档：[https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)

* **TON SDK & Jetton API**

  * Ton Connect SDK：[https://github.com/tonlabs/tonconnect](https://github.com/tonlabs/tonconnect)
  * TON 开发者文档：[https://docs.ton.dev](https://docs.ton.dev)

* **KYC 供应商**

  * SumSub 开发者文档：[https://developers.sumsub.com](https://developers.sumsub.com)
  * Veriff API 参考：[https://developer.veriff.com](https://developer.veriff.com)
  * Passbase 文档：[https://developers.passbase.com](https://developers.passbase.com)

## 12. 设计评审与潜在挑战

### 12.1 实时秒级计费与匹配稳定性

* **挑战**：高并发下 WebRTC 连接与计费事件落库会产生高 I/O 压力，可能导致超时或消息丢失。
* **建议**：

  * 使用 Redis Cluster + 持久化队列（BullMQ），确保事件可靠投递；
  * 对计费事件进行批量写入或多级缓存汇总，减少单条写入压力；
  * 匹配服务水平扩展，基于 Kubernetes HPA 或 Fly.io 自动伸缩。

### 12.2 KYC & 提领合规风险

* **挑战**：不同区域合规要求不同，KYC 供应商回调延时或失败。
* **建议**：

  * 实现 Webhook 重试策略并记录失败原因；
  * 支持多家 KYC 供应商切换备援；
  * 提领流程中加入人工二次审核阈值（大额或异常）。

### 12.3 用户登录与身份关联复杂性

* **挑战**：同时支持 Telegram Bot、Telegram Web、Google 登录，需维护多源身份映射；
* **建议**：

  * 统一 Identity UID 层，将多种 OAuth provider 映射到同一内部用户 ID；
  * 在登录流程中增强幂等性校验，避免重复账户创建；
  * 在个人中心 UI 清晰展示已绑定的各登录方式，方便用户管理。

### 12.4 数据一致性与快照延迟

* **挑战**：实时 API 与每日快照数据可能出现短暂不一致；
* **建议**：

  * 文档中明确标注：实时指标基于 OLTP 读，快照指标基于 ETL 刷新；
  * 在 API 返回中增加 `data_source` 字段，提示调用方时效性差异；
  * 若有强一致性需求，提供强制刷新或细粒度即时报表接口。

## 13. 用户行为监控（Firebase 集成）

### 13.1 埋点设计与数据流

* **前端事件**：页面浏览、匹配按钮点击、聊天消息发送、提现发起、礼物送出、KYC 提交。
* **工具**：Firebase Analytics + Firebase Performance。
* **流程**：

  1. 前端集成 `@firebase/analytics`，按模块分类埋点函数；
  2. 关键业务事件上报 `logEvent(eventName, params)`；
  3. 后端可通过 Cloud Functions 订阅 Analytics 数据，进行实时用户分群或异常告警；

### 13.2 留存与漏斗分析

* **指标**：次日留存、7 日留存、用户激活–匹配–付费转化漏斗。
* **导出**：在报表模块中新增留存与转化报表视图（CSV/图表），支持自定义时间窗口。

### 13.3 监控与优化闭环

* **报警**：若新用户 1 日内留存率 < 40%，通过 Firebase Cloud Messaging 推送测试任务或优惠券。
* **A/B 测试**：结合 Firebase Remote Config 推送不同配对算法或 UI 变体，评估对留存的影响。

---

## 14. 倉庫及文件夾結構

---
相關章節：16. 微服務架構與模塊化拆分建議、15. 指導文件規劃與關聯
---

```
/TeleSoul
├── docs/                      # 所有設計與規範文檔
│   ├── ADR/                   # 架構決策記錄
│   ├── api-spec/              # OpenAPI 3.0 定義
│   ├── er-diagrams/           # ER 圖與資料庫模式圖
│   ├── ui-style-guide/        # UI 元件庫文檔與範例
│   └── sop/                   # 運維 SOP 與故障排查手冊
├── services/                  # 微服務原始碼目錄
│   ├── auth-service/
│   ├── user-service/
│   ├── match-service/
│   ├── billing-service/
│   ├── payment-service/
│   ├── kyc-service/
│   ├── reporting-service/
│   └── admin-service/
├── gateway/                   # API Gateway 入口
├── infra/                     # 基礎設施即代碼（Terraform / Helm）
├── ci-cd/                     # CI/CD pipeline 定義
├── tests/                     # 集成測試與 E2E 測試腳本
├── scripts/                   # 工具腳本（遷移、數據導入等）
└── README.md                  # 專案概覽與快速啟動指南
```

- `docs/`：集中存放所有文檔，保持與代碼分離。
- `services/`：各微服務獨立目錄，內部遵循相同專案結構。
- `ci-cd/`：定義 GitHub Actions/workflow 文件。
- `infra/`：存放 Kubernetes Helm Chart 或 Terraform 腳本。

---

### 服務命名對應表

| 架構藍圖名稱   | 目錄名稱         | 微服務部署單元 |
|----------------|------------------|---------------|
| AuthService    | auth-service     | auth-svc      |
| UserService    | user-service     | user-svc      |
| MatchService   | match-service    | match-svc     |
| BillingService | billing-service  | billing-svc   |
| PaymentService | payment-service  | payment-svc   |
| KYCService     | kyc-service      | kyc-svc       |
| ReportingService| reporting-service| report-svc    |
| AdminService   | admin-service    | admin-svc     |
| GatewayService | gateway          | gateway-svc   |

> 若有新服務，請同步更新本表、架構藍圖、目錄結構與微服務拆分章節。

---

## 16. 微服務架構與模塊化拆分建議

---
相關章節：14. 倉庫及文件夾結構、15. 指導文件規劃與關聯
---

為提升系統可維護性、可擴展性與獨立部署能力，建議將主要功能按微服務拆分：

| 服務名稱         | 負責範圍                           | 技術棧                | 部署單元      |
|------------------|------------------------------------|----------------------|--------------|
| AuthService      | 處理所有 OAuth 登录、JWT 生成與驗證 | Node.js/NestJS 或 FastAPI | auth-svc     |
| UserService      | 用戶資料、綁定關係管理              | 同上                 | user-svc     |
| MatchService     | 用戶配對邏輯、房間管理              | 同上                 | match-svc    |
| BillingService   | 秒級計費事件收集、批量匯總至 call_charges | 同上                 | billing-svc  |
| PaymentService   | Ton Connect SDK 調用、USDT 提領流程 | 同上                 | payment-svc  |
| KYCService       | KYC SDK 集成、Webhook 處理、狀態管理 | 同上                 | kyc-svc      |
| ReportingService | ETL 任務排程、快照寫入、即時 API 提供 | 同上                 | report-svc   |
| AdminService     | 管理後台界面 API、RBAC 驗證         | 同上                 | admin-svc    |
| GatewayService   | 集中 API 路由、流量控制、限流與安全責任分離 | Node.js + Express    | gateway-svc  |

### 拆分優勢
- **責任分離**：各服務專注單一功能，迭代影響範圍小。
- **獨立伸縮**：針對匹配、計費、報表等性能敏感服務可獨立擴容。
- **隔離故障**：某一服務故障不影響整體平台可用。
- **技術多樣性**：可根據服務特性選擇最適技術棧。

### 協作與依賴
- 各微服務公開 REST / gRPC 接口；共享 API 規範文檔。
- 使用 API Gateway 做統一路由、認證、限流。
- 事件驅動：MatchService、BillingService 可通過消息隊列（Kafka / RabbitMQ）解耦。
- 日誌與監控：統一輸出到集中 ELK/Prometheus，標籤標註服務名。

---

## 17. 需求追蹤矩陣（Traceability Matrix）

| 需求編號 | 需求描述         | 功能模組      | API 端點           | 測試用例         | 狀態 |
|----------|------------------|---------------|--------------------|------------------|------|
| RQ-001   | 用戶註冊與認證   | AuthService   | /api/auth/telegram | TC-001, TC-002   | 已驗證 |
| RQ-002   | KYC 驗證         | KYCService    | /api/kyc/webhook   | TC-010, TC-011   | 進行中 |
| ...      | ...              | ...           | ...                | ...              | ...  |

> 請於每次需求、API、測試用例變更時同步更新本表。**如需補充新需求，請先經審查流程再更新本表。**

---

## 18. 版本與審核歷史（Version & Review History）

| 版本號 | 日期        | 修改人   | 審核人   | 主要變更說明                 |
|--------|-------------|----------|----------|------------------------------|
| 0.1.0  | 2025-04-11  | Yichen   | TeleSoul Team | 初始版本                     |
| 0.2.0  | 2025-04-15  | Yichen   | PM        | 新增微服務拆分、CI/CD章節     |
| ...    | ...         | ...      | ...      | ...                          |

---

## 19. 典型用戶場景（User Scenarios）

### 場景1：新用戶註冊與首次配對
1. 用戶通過 Telegram Bot 掃碼進入平台
2. 完成 Telegram OAuth 登錄，系統自動建立帳號
3. 用戶進入 KYC 流程，通過後可進行配對
4. 發起配對，進入房間，開始語音/視頻互動
5. 通話結束後，收到計費與餘額通知

### 場景2：用戶提領流程
1. 用戶在個人中心發起 USDT 提領申請
2. 系統自動審核，若超額則進入人工審核
3. 提領成功後，系統推送通知

---

## 20. 自動化與CI/CD規範

- 所有服務必須通過自動化單元測試、集成測試、E2E 測試，測試覆蓋率≥80%
- Pull Request 必須經過自動化 Lint、Build、Test 檢查
- 主分支合併自動部署至 Staging，Tag 釋出自動部署 Production
- 部署流程需包含自動回滾、健康檢查、性能監控
- 參考 ci-cd/ 目錄下的 workflow 定義與腳本

---

## 21. API/資料表變更管理

- API/資料表變更需遵循版本管理（如 v1, v2），避免破壞性修改
- 重大變更需提前公告並提供遷移方案
- 廢棄 API/欄位需標註 Deprecated 並保留兼容期
- 變更記錄需同步於 CHANGELOG.md 與本文件
- 參考 docs/api-spec/ 與 docs/er-diagrams/ 內詳細規範

---

## 22. 國際化與多語言支持（i18n）

- 前端所有用戶可見文字必須通過 i18n 機制管理，支持多語言切換
- 後端錯誤訊息、通知等需支持多語言模板
- 新增語言需同步測試 UI 排版與內容完整性
- 參考 docs/ui-style-guide/ 內 i18n 實作細節
- 國際化規範詳見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md)

---

## 23. 附錄：常見問答（FAQ）

**Q1：如何新增一個微服務？**
A：請參考第14章倉庫結構與第16章微服務拆分，並同步更新服務命名對應表。

**Q2：API 變更如何通知前端？**
A：所有 API 變更需於 docs/api-spec/ 更新，並在 Slack #dev 通知前端負責人。

**Q3：如何查詢某個需求的落地情況？**
A：請查閱第17章需求追蹤矩陣，對應功能模組、API 與測試用例。

**Q4：CI/CD pipeline 失敗怎麼辦？**
A：請先檢查 ci-cd/ 內 workflow log，若無法解決請聯繫 DevOps。

**Q5：如何申請新語言支持？**
A：請於 docs/ui-style-guide/ 提交需求，並聯繫前端負責人協助導入。詳見 [INTERNATIONALIZATION_GUIDELINES.md](../INTERNATIONALIZATION_GUIDELINES.md)

**Q6：如何進行合規自測？**
A：請參見 [ops/COMPLIANCE_GUIDELINES.md](../ops/COMPLIANCE_GUIDELINES.md) 並依照 Playbook 任務執行。

**Q7：如何一鍵啟動本地開發環境？**
A：請參見 [QUICKSTART.md](./QUICKSTART.md) 並依照指南執行。

**Q8：如何確保專案維護與自動化自審？**
A：請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)

**Q9：如何自動修復常見錯誤？**
A：請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)

---

自動修復規範請參見 [MAINTENANCE_GUIDELINES.md](./MAINTENANCE_GUIDELINES.md)

*End of TeleSoul Cursor 開發需求規格*
