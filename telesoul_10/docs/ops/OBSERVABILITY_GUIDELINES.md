# OBSERVABILITY_GUIDELINES.md

## 1. 目的

定義 TeleSoul 平台的可觀測性規範，確保分布式追蹤、日誌聚合與指標監控三位一體，幫助開發與運維團隊實時了解系統健康、快速定位問題。

## 2. 分布式追蹤 (Tracing)

### 2.1 工具與協議

* **OpenTelemetry**：統一採集追蹤數據（Spans）
* **Jaeger**：追蹤數據後端存儲與可視化
* **OTLP**：OpenTelemetry Protocol，用於導出追蹤與度量

### 2.2 客戶端初始化

* 在每個微服務啟動時集成 OpenTelemetry SDK：

  * Node.js：`@opentelemetry/sdk-node`
  * Python：`opentelemetry-sdk`
* 配置環境變數：

  ```bash
  OTEL_SERVICE_NAME=<service-name>
  OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
  OTEL_TRACES_SAMPLER=always_on  # 生產環境可按比例採樣
  ```

### 2.3 代碼埋點

* **自動埋點**：使用框架集成插件（Express, NestJS, FastAPI）自動生成 HTTP spans
* **手動埋點**：對關鍵業務邏輯（用戶登錄、配對、提現）添加自定義 Span：

  ```js
  const tracer = opentelemetry.trace.getTracer('billing-service');
  tracer.startActiveSpan('calculate-charge', span => {
    // 業務邏輯
    span.setAttribute('user.id', userId);
    span.end();
  });
  ```

### 2.4 Jaeger 健康檢查腳本

`scripts/check-jaeger.sh`：

```bash
#!/usr/bin/env bash
# 檢查 Jaeger UI 可用性
status=$(curl -s -o /dev/null -w "%{http_code}" http://jaeger:16686/api/services)
if [[ "$status" -ne 200 ]]; then
  echo "Jaeger API returned $status" >&2
  exit 1
fi
```

## 3. 日誌聚合 (Logging)

### 3.1 格式與輸出

* **結構化 JSON 日誌**：字段包含 `timestamp`, `level`, `service`, `instance`, `trace_id`, `span_id`, `message`, `meta`
* **日誌庫**：

  * Node.js：Winston / pino
  * Python：structlog / loguru

### 3.2 收集與傳輸

* **ELK** (Elasticsearch, Logstash, Kibana) 或 **EFK** (Fluentd, Elasticsearch, Kibana)
* 使用 **Filebeat** 或 **Fluentd Sidecar** 將容器日誌推送到 Elasticsearch

### 3.3 聚合健康檢查腳本

`scripts/check-elk.sh`：

```bash
#!/usr/bin/env bash
# 檢查 Elasticsearch 集群健康
status=$(curl -s 'http://elasticsearch:9200/_cluster/health?pretty' | jq -r .status)
if [[ "$status" != "green" ]]; then
  echo "Elasticsearch cluster status: $status" >&2
  exit 1
fi
```

## 4. 指標監控 (Metrics)

### 4.1 工具

* **Prometheus**：採集與存儲時間序列指標
* **Grafana**：可視化儀表盤與告警

### 4.2 指標規範

* **命名約定**：`<service>_<module>_<metric>_<unit>`，如 `auth_service_request_latency_ms`
* **標籤 (Labels)**：`service`, `instance`, `endpoint`, `status`
* **關鍵指標**：

  * API 延遲 (P50/P95/P99)
  * 錯誤率 (4xx/5xx)
  * CPU/內存使用率
  * 數據庫連接數
  * Redis 延遲/命中率

### 4.3 健康檢查腳本

`scripts/check-prometheus.sh`：

```bash
#!/usr/bin/env bash
# 查詢 Prometheus uptime
result=$(curl -s 'http://prometheus:9090/api/v1/query?query=up' | jq '.data.result[] | select(.value[1]=="1")')
if [[ -z "$result" ]]; then
  echo "No 'up' metrics found" >&2
  exit 1
fi
```

## 5. CI/CD 驗證與集成

* 在 CI 流程中加入 Tracing/Logging/Metrics 健康檢查任務：

  ```yaml
  - name: Check Jaeger
    run: scripts/check-jaeger.sh
  - name: Check ELK
    run: scripts/check-elk.sh
  - name: Check Prometheus
    run: scripts/check-prometheus.sh
  ```
* 定時觸發全量健康檢測，並在失敗時通知團隊（Slack / PagerDuty）

## 6. 文檔與培訓

* 將此文檔放入 `docs/ops/OBSERVABILITY_GUIDELINES.md`
* 定期舉辦可觀測性培訓，演示如何使用 Jaeger UI、Kibana、Grafana

---

*End of OBSERVABILITY_GUIDELINES.md* 