#!/usr/bin/env bash
# 檢查 Elasticsearch 集群健康
status=$(curl -s 'http://elasticsearch:9200/_cluster/health?pretty' | jq -r .status)
if [[ "$status" != "green" ]]; then
  echo "Elasticsearch cluster status: $status" >&2
  exit 1
fi 