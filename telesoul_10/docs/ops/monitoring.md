# TeleSoul 监控告警配置

## 监控架构

### 1. 指标收集
- Prometheus 收集系统指标
- Node Exporter 收集主机指标
- cAdvisor 收集容器指标
- 自定义指标收集器

### 2. 日志管理
- ELK Stack 收集和分析日志
- Filebeat 收集应用日志
- Logstash 处理和转换日志
- Elasticsearch 存储和索引日志
- Kibana 可视化日志

### 3. 分布式追踪
- Jaeger 收集追踪数据
- OpenTelemetry 集成
- 自定义追踪器

## 告警规则

### 1. 系统告警
```yaml
groups:
  - name: system
    rules:
      - alert: HighCPUUsage
        expr: rate(process_cpu_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "CPU 使用率过高"
          description: "CPU 使用率超过 80% 持续 5 分钟"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "内存使用率过高"
          description: "内存使用率超过 90% 持续 5 分钟"

      - alert: HighDiskUsage
        expr: (node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "磁盘使用率过高"
          description: "磁盘使用率超过 85% 持续 5 分钟"
```

### 2. 应用告警
```yaml
groups:
  - name: application
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "错误率过高"
          description: "HTTP 5xx 错误率超过 5% 持续 5 分钟"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "响应时间过长"
          description: "95% 的请求响应时间超过 1 秒持续 5 分钟"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "服务不可用"
          description: "服务 {{ $labels.service }} 已停止运行"
```

### 3. 业务告警
```yaml
groups:
  - name: business
    rules:
      - alert: LowMatchRate
        expr: rate(match_requests_total[1h]) / rate(match_attempts_total[1h]) < 0.3
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "匹配成功率过低"
          description: "匹配成功率低于 30% 持续 1 小时"

      - alert: HighPaymentFailure
        expr: rate(payment_failures_total[1h]) / rate(payment_attempts_total[1h]) > 0.1
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "支付失败率过高"
          description: "支付失败率超过 10% 持续 1 小时"

      - alert: LowUserActivity
        expr: rate(active_users_total[1h]) < 100
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "用户活跃度低"
          description: "活跃用户数低于 100 持续 1 小时"

      - alert: HighKycRejectionRate
        expr: rate(kyc_rejections_total[1h]) / rate(kyc_submissions_total[1h]) > 0.2
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "KYC 拒绝率过高"
          description: "KYC 拒绝率超过 20% 持续 1 小时"

      - alert: SlowKycProcessing
        expr: histogram_quantile(0.95, rate(kyc_processing_duration_seconds_bucket[1h])) > 300
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "KYC 处理时间过长"
          description: "95% 的 KYC 处理时间超过 5 分钟持续 1 小时"

      - alert: HighPaymentLatency
        expr: histogram_quantile(0.95, rate(payment_processing_duration_seconds_bucket[1h])) > 10
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "支付处理时间过长"
          description: "95% 的支付处理时间超过 10 秒持续 1 小时"

      - alert: LowUserRetention
        expr: rate(returning_users_total[24h]) / rate(new_users_total[24h]) < 0.3
        for: 24h
        labels:
          severity: warning
        annotations:
          summary: "用户留存率过低"
          description: "24 小时用户留存率低于 30%"

      - alert: HighUserChurn
        expr: rate(inactive_users_total[7d]) / rate(active_users_total[7d]) > 0.5
        for: 7d
        labels:
          severity: warning
        annotations:
          summary: "用户流失率过高"
          description: "7 天用户流失率超过 50%"
```

## 告警通知

### 1. 通知渠道
- Slack
- 邮件
- 短信
- 电话

### 2. 通知规则
```yaml
receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true
        title: '{{ template "slack.default.title" . }}'
        text: '{{ template "slack.default.text" . }}'

  - name: 'email-notifications'
    email_configs:
      - to: 'ops@telesoul.com'
        send_resolved: true
        headers:
          subject: '{{ template "email.default.subject" . }}'

  - name: 'sms-notifications'
    webhook_configs:
      - url: 'http://sms-gateway/send'
        send_resolved: true

  - name: 'phone-notifications'
    webhook_configs:
      - url: 'http://phone-gateway/call'
        send_resolved: true
```

### 3. 路由规则
```yaml
route:
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack-notifications'
  routes:
    - match:
        severity: critical
      receiver: 'phone-notifications'
    - match:
        severity: warning
      receiver: 'email-notifications'
```

## 监控面板

### 1. 系统监控
- CPU 使用率
- 内存使用率
- 磁盘使用率
- 网络流量
- 容器状态

### 2. 应用监控
- 请求量
- 响应时间
- 错误率
- 服务状态
- 资源使用

### 3. 业务监控
- 用户活跃度
- 匹配成功率
- 支付成功率
- 收入统计
- 用户增长
- KYC 处理效率
- 支付处理时间
- 用户留存率
- 用户流失率

## 日志分析

### 1. 日志分类
- 应用日志
- 系统日志
- 安全日志
- 审计日志

### 2. 日志查询
- 全文搜索
- 字段过滤
- 时间范围
- 聚合分析

### 3. 日志告警
- 错误日志告警
- 异常模式告警
- 安全事件告警
- 性能问题告警

## 性能分析

### 1. 性能指标
- 响应时间
- 吞吐量
- 并发数
- 资源使用率

### 2. 性能告警
- 慢查询告警
- 高负载告警
- 资源耗尽告警
- 性能下降告警

### 3. 性能优化
- 自动扩缩容
- 负载均衡
- 缓存优化
- 数据库优化 