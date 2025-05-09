# ENVIRONMENT_VARIABLE_GUIDELINES.md

> 本文件為 TeleSoul 專案環境變數管理唯一權威規範，任何新增/修改必須經審查並記錄於 ADR 或本文件。

## 1. 目的

集中管理所有環境變數，確保各服務在不同環境（本地、測試、正式）正確加載配置，避免敏感資訊洩漏。規範命名、範例、審查、審核責任與自動化校驗，支援 CI/CD、AI、審查流程。

## 2. 文件結構

* **.env.example**：所有必填變數範例，不含真值，提交版本庫。
* **.env.local**：本地開發，加入 `.gitignore`。
* **.env.test**：測試環境（CI/CD），存放於安全倉庫或 CI secrets。
* **.env.production**：正式環境，存放於 Vault 或雲端 Secrets 管理。

```
TeleSoul/
├── .env.example
├── .env.local      # 本地開發 (gitignored)
├── .env.test       # CI / 測試 (secure)
├── .env.production # 正式 (secure)
```

## 3. 命名規範

* 全大寫，單詞用底線分隔：`SERVICE_NAME_KEY`。
* 按功能/模組前綴：
  * **全域**：`NODE_ENV`, `LOG_LEVEL`, `PORT`, `DEBUG`
  * **資料庫**：`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_SSL`
  * **快取**：`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASS`, `REDIS_DB`
  * **對象存儲**：`MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_PORT`
  * **第三方服務**：
    * Telegram：`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
    * Firebase：`FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`
    * TON：`TON_NETWORK`, `TON_WALLET_URL`
    * KYC：`SUMSUB_API_KEY`, `VERIFF_API_SECRET`
  * **安全**：`JWT_SECRET`, `JWT_EXPIRES_IN`, `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`
  * **雲端部署**：`GCP_PROJECT_ID`, `GCP_CREDENTIALS_JSON`
  * **郵件**：`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
  * **通知**：`SLACK_WEBHOOK_URL`, `WEBHOOK_URL`, `WEBHOOK_SECRET`
  * **監控**：`GRAFANA_ADMIN_PASSWORD`, `KIBANA_PORT`
  * **備份**：`BACKUP_LOCATION`, `BACKUP_RETENTION`
  * **災難恢復**：`DR_BACKUP_RETENTION`, `DR_RESTORE_TIMEOUT`, `DR_FAILOVER_TIMEOUT`, `DR_TEST_TIMEOUT`
  * **部署**：`DEPLOYMENT_STRATEGY`, `DEPLOYMENT_MAX_PARALLEL`, `DEPLOYMENT_ROLLBACK`
  * **性能**：`NGINX_WORKER_PROCESSES`, `NGINX_WORKER_CONNECTIONS`, `PHP_MEMORY_LIMIT`, `NODE_MAX_OLD_SPACE_SIZE`
  * **日誌**：`LOG_RETENTION`, `ELK_INDEX_PREFIX`
  * **合規**：`DATA_RETENTION_PERIOD`, `AUDIT_RETENTION`, `GDPR_ENABLED`, `CCPA_ENABLED`
  * **維護**：`MAINTENANCE_ALLOWED_IPS`
  * **CI/CD**：`DOCKER_REGISTRY`, `IMAGE_PREFIX`, `K8S_NAMESPACE`

## 4. 範例 `.env.example`

```ini
# 全域
NODE_ENV=development
LOG_LEVEL=info
PORT=4000
DEBUG=false

# 資料庫 (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=changeme
DB_NAME=telesoul_dev
DB_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=changeme
REDIS_DB=0

# MinIO
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
MINIO_PORT=9000

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=3600s

# Telegram Bot
TELEGRAM_BOT_TOKEN=xxxx:yyyy
TELEGRAM_CHAT_ID=your_chat_id

# OAuth Google
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

# TON
TON_NETWORK=testnet
TON_WALLET_URL=https://testnet.tonwallet.com

# KYC (SumSub/Veriff)
SUMSUB_API_KEY=xxx
VERIFF_API_SECRET=yyy

# GCP Deploy
GCP_PROJECT_ID=your-gcp-project
GCP_CREDENTIALS_JSON="{ ... }"

# 郵件
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASS=your_smtp_password
MAIL_FROM=notifications@example.com
MAIL_TO=admin@example.com

# 通知
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
WEBHOOK_URL=https://example.com/webhook
WEBHOOK_SECRET=your_webhook_secret

# 監控
GRAFANA_ADMIN_PASSWORD=changeme
KIBANA_PORT=5601

# 備份
BACKUP_LOCATION=s3://telesoul-backups
BACKUP_RETENTION=30

# 災難恢復
DR_BACKUP_RETENTION=30
DR_RESTORE_TIMEOUT=1800
DR_FAILOVER_TIMEOUT=300
DR_TEST_TIMEOUT=3600

# 部署
DEPLOYMENT_STRATEGY=rolling
DEPLOYMENT_MAX_PARALLEL=2
DEPLOYMENT_ROLLBACK=true

# 性能
NGINX_WORKER_PROCESSES=auto
NGINX_WORKER_CONNECTIONS=1024
PHP_MEMORY_LIMIT=256M
NODE_MAX_OLD_SPACE_SIZE=2048

# 日誌
LOG_RETENTION=30d
ELK_INDEX_PREFIX=telesoul

# 合規
DATA_RETENTION_PERIOD=365
AUDIT_RETENTION=365
GDPR_ENABLED=true
CCPA_ENABLED=true

# 維護
MAINTENANCE_ALLOWED_IPS=127.0.0.1,192.168.1.0/24

# CI/CD
DOCKER_REGISTRY=docker.io
IMAGE_PREFIX=telesoul
K8S_NAMESPACE=telesoul
```

## 5. 加載與校驗機制

1. **dotenv-safe**：應用啟動前校驗 `.env.example` 所有變數是否存在。
2. **配置庫**：
   * Node.js/NestJS：`@nestjs/config` + Joi Schema 校驗。
   * Python/FastAPI：`pydantic.BaseSettings` + 校驗。
3. **失敗策略**：缺少必填變數時應用啟動失敗並記錄錯誤，避免運行時異常。

## 6. Secrets 管理

* **開發**：本地 `.env.local`，不存正式憑證。
* **CI/CD**：GitHub Actions / GitLab CI 設定 Secrets，代替 `.env.test`。
* **正式**：Vault、AWS/GCP Secret Manager 管理，部署管線注入。

## 7. 審查與追溯

* 所有變數於 `docs/env-vars.md` 有對應說明。
* 新增/修改變數必須記錄於本文件或 ADR，並標註審核人。
* Pull Request 必須經審查人員確認環境變數合規。

## 8. 自動化校驗與審查流程

* CI/CD pipeline 應自動校驗 `.env.example` 與實際環境一致。
* 變數缺失、命名不符、敏感資訊外洩等自動阻斷部署。
* AI/自動化工具須依據本規範生成、審查、修復環境變數。

## 9. 程式碼實踐範例

**Node.js (NestJS) + Joi**

```ts
// config.schema.ts
import * as Joi from 'joi';
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','production','test').required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  JWT_SECRET: Joi.string().required(),
  // ...
});

// app.module.ts
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config.schema';

ConfigModule.forRoot({
  isGlobal: true,
  validationSchema,
});
```

**Python (FastAPI) + Pydantic**

```py
# config.py
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    NODE_ENV: str = Field(..., env='NODE_ENV')
    DB_HOST: str
    DB_PORT: int = 5432
    JWT_SECRET: str
    # ...

    class Config:
        env_file = '.env'
        case_sensitive = True

settings = Settings()
```

## 10. 新增環境變量流程

1. 在 `ENVIRONMENT_VARIABLE_GUIDELINES.md` 中添加新變量說明
2. 更新 `.env.example` 添加新變量
3. 更新 `check-env-sync.sh` 腳本（如需要）
4. 更新相關配置文件（`docker-compose.yml`, `group_vars/*.yml`）
5. 提交 PR 並等待審查
6. 審查通過後合併到主分支

## 11. 變量類型說明

* **字符串**：`string`
* **數字**：`number`
* **布爾值**：`boolean`
* **數組**：`array`
* **對象**：`object`
* **時間**：`duration`（如 `24h`, `30d`）
* **IP地址**：`ip`
* **URL**：`url`
* **郵箱**：`email`
* **密碼**：`password`
* **密鑰**：`secret`
* **令牌**：`token`

---

*End of ENVIRONMENT_VARIABLE_GUIDELINES.md* 