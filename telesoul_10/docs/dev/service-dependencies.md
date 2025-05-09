# TeleSoul 服务依赖关系

## 核心服务

### 用户服务 (User Service)
- 依赖：
  - Prisma (数据库)
  - Redis (缓存)
  - JWT (认证)
- 被依赖：
  - 认证服务
  - 匹配服务
  - 支付服务
  - KYC 服务

### 匹配服务 (Match Service)
- 依赖：
  - 用户服务
  - Redis (实时匹配)
  - WebSocket (实时通信)
- 被依赖：
  - 支付服务
  - 报表服务

### 支付服务 (Payment Service)
- 依赖：
  - 用户服务
  - 匹配服务
  - TON Connect
  - Redis (交易状态)
- 被依赖：
  - 报表服务

### KYC 服务 (KYC Service)
- 依赖：
  - 用户服务
  - SumSub/Veriff API
  - MinIO (文件存储)
- 被依赖：
  - 支付服务

## 基础设施服务

### 认证服务 (Auth Service)
- 依赖：
  - 用户服务
  - Firebase Auth
  - JWT
- 被依赖：
  - API 网关

### API 网关 (Gateway)
- 依赖：
  - 所有微服务
  - Redis (限流)
  - Prometheus (监控)
- 被依赖：
  - 前端应用

### 报表服务 (Reporting Service)
- 依赖：
  - 所有业务服务
  - PostgreSQL (数据仓库)
  - Redis (缓存)
- 被依赖：
  - 管理后台

### 管理服务 (Admin Service)
- 依赖：
  - 所有业务服务
  - 报表服务
  - RBAC
- 被依赖：
  - 管理后台

## 数据流

1. 用户认证流程：
   ```
   前端 -> API网关 -> 认证服务 -> 用户服务
   ```

2. 匹配流程：
   ```
   前端 -> API网关 -> 匹配服务 -> 用户服务
   ```

3. 支付流程：
   ```
   前端 -> API网关 -> 支付服务 -> 用户服务 -> KYC服务
   ```

4. 报表流程：
   ```
   管理后台 -> API网关 -> 报表服务 -> 各业务服务
   ```

## 注意事项

1. 服务间通信：
   - 使用 HTTP/REST 进行同步通信
   - 使用 Redis Pub/Sub 进行异步通信
   - 使用 WebSocket 进行实时通信

2. 数据一致性：
   - 使用事务确保数据一致性
   - 使用事件溯源处理分布式事务
   - 使用补偿机制处理失败情况

3. 性能优化：
   - 使用 Redis 缓存热点数据
   - 使用连接池优化数据库连接
   - 使用批量处理优化大量数据操作

4. 监控告警：
   - 使用 Prometheus 收集指标
   - 使用 Grafana 展示监控数据
   - 使用 AlertManager 处理告警 