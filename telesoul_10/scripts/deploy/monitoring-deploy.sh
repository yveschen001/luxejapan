#!/bin/bash

# 设置错误处理
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印消息函数
print_message() {
  echo -e "${2}${1}${NC}"
}

# 检查环境
check_environment() {
  print_message "检查环境..." "${YELLOW}"
  
  # 检查 Docker
  if ! command -v docker &> /dev/null; then
    print_message "错误: 未找到 Docker" "${RED}"
    exit 1
  fi
  
  # 检查 Docker Compose
  if ! command -v docker-compose &> /dev/null; then
    print_message "错误: 未找到 Docker Compose" "${RED}"
    exit 1
  fi
  
  # 检查 kubectl
  if ! command -v kubectl &> /dev/null; then
    print_message "错误: 未找到 kubectl" "${RED}"
    exit 1
  fi
}

# 部署 Prometheus
deploy_prometheus() {
  print_message "部署 Prometheus..." "${YELLOW}"
  
  # 创建 Prometheus 配置
  cat > prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
  
  - job_name: 'telesoul-api'
    static_configs:
      - targets: ['api:3000']
EOF

  # 创建告警规则
  mkdir -p rules
  cat > rules/alerts.yml << EOF
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
EOF

  # 创建 Docker Compose 配置
  cat > docker-compose.monitoring.yml << EOF
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./rules:/etc/prometheus/rules
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'

  alertmanager:
    image: prom/alertmanager:latest
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

volumes:
  grafana-storage:
EOF

  # 创建 AlertManager 配置
  cat > alertmanager.yml << EOF
global:
  resolve_timeout: 5m

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

  - name: 'phone-notifications'
    webhook_configs:
      - url: 'http://sms-gateway/send'
        send_resolved: true
EOF

  # 启动监控服务
  docker-compose -f docker-compose.monitoring.yml up -d
}

# 部署 ELK Stack
deploy_elk() {
  print_message "部署 ELK Stack..." "${YELLOW}"
  
  # 创建 ELK Docker Compose 配置
  cat > docker-compose.elk.yml << EOF
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.14.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    ports:
      - "5044:5044"
      - "5000:5000/tcp"
      - "5000:5000/udp"
      - "9600:9600"
    environment:
      LS_JAVA_OPTS: "-Xmx256m -Xms256m"

  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_URL: http://elasticsearch:9200
      ELASTICSEARCH_HOSTS: '["http://elasticsearch:9200"]'

volumes:
  elasticsearch-data:
EOF

  # 创建 Logstash 配置
  mkdir -p logstash/pipeline
  cat > logstash/pipeline/logstash.conf << EOF
input {
  beats {
    port => 5044
  }
  tcp {
    port => 5000
  }
}

filter {
  if [type] == "telesoul-api" {
    json {
      source => "message"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "telesoul-%{+YYYY.MM.dd}"
  }
}
EOF

  # 启动 ELK 服务
  docker-compose -f docker-compose.elk.yml up -d
}

# 部署 Jaeger
deploy_jaeger() {
  print_message "部署 Jaeger..." "${YELLOW}"
  
  # 创建 Jaeger Docker Compose 配置
  cat > docker-compose.jaeger.yml << EOF
version: '3.8'

services:
  jaeger:
    image: jaegertracing/all-in-one:1.22
    ports:
      - "5775:5775/udp"
      - "6831:6831/udp"
      - "6832:6832/udp"
      - "5778:5778"
      - "16686:16686"
      - "14250:14250"
      - "14268:14268"
      - "14269:14269"
      - "9411:9411"
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
      - COLLECTOR_OTLP_ENABLED=true
EOF

  # 启动 Jaeger 服务
  docker-compose -f docker-compose.jaeger.yml up -d
}

# 主函数
main() {
  print_message "开始部署监控系统..." "${GREEN}"
  
  check_environment
  deploy_prometheus
  deploy_elk
  deploy_jaeger
  
  print_message "监控系统部署完成！" "${GREEN}"
  print_message "Prometheus: http://localhost:9090" "${GREEN}"
  print_message "Grafana: http://localhost:3000" "${GREEN}"
  print_message "Kibana: http://localhost:5601" "${GREEN}"
  print_message "Jaeger: http://localhost:16686" "${GREEN}"
}

# 执行主函数
main 