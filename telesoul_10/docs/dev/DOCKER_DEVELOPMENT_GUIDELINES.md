# Docker 開發指南

> 本文件為 TeleSoul 專案 Docker 開發環境的唯一指導規範，任何修改必須經資深工程師審查並通過 PR 流程，嚴禁未經審查隨意修改。

## 1. Docker Compose 配置

```yaml
# docker-compose.yml (項目根目錄)
version: '3.8'
services:
  postgres:
    image: postgres:14
    container_name: telesoul-postgres
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    container_name: telesoul-redis
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}"]
    ports:
      - "${REDIS_PORT}:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio
    container_name: telesoul-minio
    command: server /data
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    ports:
      - "${MINIO_PORT}:9000"
    healthcheck:
      test: ["CMD", "mc", "alias", "set", "local", "http://localhost:9000", "${MINIO_ACCESS_KEY}", "${MINIO_SECRET_KEY}"]
      interval: 15s
      timeout: 5s
      retries: 3

  auth-service:
    build: ./services/auth-service
    container_name: telesoul-auth
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: ${DB_USER}
      DB_PASS: ${DB_PASS}
      DB_NAME: ${DB_NAME}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
    ports:
      - "${AUTH_SERVICE_PORT}:4000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  gateway:
    build: ./services/gateway
    container_name: telesoul-gateway
    depends_on:
      auth-service:
        condition: service_healthy
    environment:
      API_BASE_URL: http://auth-service:4000
      FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID}
      TON_NETWORK: ${TON_NETWORK}
    ports:
      - "${GATEWAY_PORT}:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

## 2. 環境變數配置

請確保 `.env.example` 包含以下配置：

```ini
# Database
DB_USER=postgres
DB_PASS=changeme
DB_NAME=telesoul_dev
DB_PORT=5432

# Redis
REDIS_PASSWORD=changeme
REDIS_PORT=6379

# MinIO
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
MINIO_PORT=9000

# Services
AUTH_SERVICE_PORT=4000
GATEWAY_PORT=3000
```

## 3. 自動化腳本

### 3.1 啟動腳本

```bash
#!/usr/bin/env bash
# scripts/start-containers.sh
# 用途: 啟動所有 Docker 容器
# 參考: docs/dev/DOCKER_DEVELOPMENT_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

log "啟動 Docker 容器..."
docker-compose up -d --build

log "等待容器健康檢查..."
./scripts/check-containers.sh

log "執行 Playbook..."
node scripts/run-playbook.js playbook.yaml --env local
```

### 3.2 健康檢查腳本

```bash
#!/usr/bin/env bash
# scripts/check-containers.sh
# 用途: 檢查所有容器健康狀態
# 參考: docs/dev/DOCKER_DEVELOPMENT_GUIDELINES.md
# 負責人: TeleSoul Team

set -euo pipefail

log()   { echo "[INFO]    $1"; }
error() { echo "[ERROR]   $1" >&2; }

services=(postgres redis minio telesoul-auth telesoul-gateway)
for svc in "${services[@]}"; do
  log "檢查 $svc 狀態..."
  if ! docker inspect --format='{{.State.Health.Status}}' "$svc" | grep -q healthy; then
    error "$svc 未就緒"
    exit 1
  fi
done
log "所有容器均已健康啟動"
```

## 4. 使用說明

1. 首次啟動：
   ```bash
   chmod +x scripts/start-containers.sh scripts/check-containers.sh
   ./scripts/start-containers.sh
   ```

2. 重啟特定服務：
   ```bash
   docker-compose restart <service-name>
   ```

3. 查看日誌：
   ```bash
   docker-compose logs -f <service-name>
   ```

4. 停止所有服務：
   ```bash
   docker-compose down
   ```

## 5. 故障排除

1. 端口衝突：
   - 檢查 `.env` 中的端口配置
   - 使用 `lsof -i :<PORT>` 查看占用
   - 必要時修改端口配置

2. 容器未啟動：
   - 檢查 `docker-compose logs`
   - 確認環境變數配置
   - 驗證健康檢查配置

3. 數據持久化：
   - PostgreSQL 數據存儲在 `postgres-data` 卷
   - 重置數據：`docker-compose down -v`

## 6. 最佳實踐

1. 開發前檢查：
   - 執行 `./scripts/check-containers.sh`
   - 確認所有服務健康狀態
   - 檢查環境變數配置

2. 提交前檢查：
   - 確保 `docker-compose.yml` 更新
   - 同步更新 `.env.example`
   - 更新相關文檔引用

3. 性能優化：
   - 使用 `docker-compose up -d` 後台運行
   - 合理配置資源限制
   - 定期清理未使用資源

## 7. 文檔引用

- 環境變數規範：詳見 [ENVIRONMENT_VARIABLE_GUIDELINES.md](../ENVIRONMENT_VARIABLE_GUIDELINES.md)
- 維護規範：詳見 [MAINTENANCE_GUIDELINES.md](../MAINTENANCE_GUIDELINES.md)
- 快速上手指南：詳見 [QUICKSTART.md](../QUICKSTART.md) 