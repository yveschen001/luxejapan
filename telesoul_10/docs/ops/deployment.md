# TeleSoul 部署指南

## 环境要求

- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- Docker >= 20
- Docker Compose >= 2
- pnpm >= 8

## 部署步骤

### 1. 环境准备

```bash
# 克隆代码
git clone https://github.com/your-org/telesoul.git
cd telesoul

# 安装依赖
pnpm install
```

### 2. 配置环境变量

```bash
# 后端环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，填写必要的配置

# 前端环境变量
cp frontend/.env.example frontend/.env
# 编辑 frontend/.env 文件，填写必要的配置
```

### 3. 数据库迁移

```bash
# 启动数据库
docker-compose up -d postgres

# 执行迁移
cd backend
pnpm prisma migrate deploy
pnpm prisma generate
```

### 4. 构建应用

```bash
# 构建后端
cd backend
pnpm build

# 构建前端
cd ../frontend
pnpm build
```

### 5. 启动服务

```bash
# 启动所有服务
docker-compose up -d
```

## 服务健康检查

### 后端服务

```bash
# 检查用户服务
curl http://localhost:3000/health

# 检查匹配服务
curl http://localhost:3001/health

# 检查支付服务
curl http://localhost:3002/health

# 检查 KYC 服务
curl http://localhost:3003/health
```

### 前端服务

```bash
# 检查前端服务
curl http://localhost:5173/health
```

## 监控告警

### Prometheus

- 访问 http://localhost:9090
- 检查服务指标
- 验证告警规则

### Grafana

- 访问 http://localhost:3000
- 检查仪表板
- 验证数据源

## 日志管理

### ELK Stack

- 访问 http://localhost:5601
- 检查日志索引
- 验证日志收集

## 备份策略

### 数据库备份

```bash
# 执行备份
./scripts/backup-db.sh

# 恢复备份
./scripts/restore-db.sh <backup-file>
```

### 文件备份

```bash
# 执行备份
./scripts/backup-files.sh

# 恢复备份
./scripts/restore-files.sh <backup-file>
```

## 故障恢复

### 服务恢复

```bash
# 重启服务
docker-compose restart <service-name>

# 查看日志
docker-compose logs -f <service-name>
```

### 数据恢复

```bash
# 恢复数据库
./scripts/restore-db.sh <backup-file>

# 恢复文件
./scripts/restore-files.sh <backup-file>
```

## 安全配置

### SSL 配置

```bash
# 生成证书
./scripts/generate-ssl.sh

# 配置 Nginx
./scripts/configure-nginx.sh
```

### 防火墙配置

```bash
# 配置防火墙
./scripts/configure-firewall.sh
```

## 性能优化

### 数据库优化

```bash
# 优化数据库
./scripts/optimize-db.sh
```

### 缓存优化

```bash
# 优化 Redis
./scripts/optimize-redis.sh
```

## 维护计划

### 日常维护

- 每日备份
- 日志轮转
- 性能监控

### 定期维护

- 每周安全更新
- 每月性能优化
- 每季度安全审计

## 故障排除

### 常见问题

1. 服务无法启动
   - 检查环境变量
   - 检查端口占用
   - 检查日志

2. 数据库连接失败
   - 检查数据库状态
   - 检查连接配置
   - 检查网络连接

3. 性能问题
   - 检查资源使用
   - 检查慢查询
   - 检查缓存命中率

### 联系支持

- 技术支持：support@telesoul.com
- 紧急联系：emergency@telesoul.com
- 问题跟踪：https://github.com/your-org/telesoul/issues 