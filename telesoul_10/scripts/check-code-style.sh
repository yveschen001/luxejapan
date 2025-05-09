#!/usr/bin/env bash
# 用途: 检查代码风格、错误处理和日志输出
# 参考: docs/CODE_STYLE_GUIDELINES.md
# 负责人: TeleSoul Team

set -euo pipefail

log() { echo "[INFO] $1"; }
error() { echo "[ERROR] $1" >&2; }

# 检查目录下所有 JS/TS 文件
check_files() {
  local dir=$1
  log "检查目录: $dir"
  
  find "$dir" -type f \( -name "*.js" -o -name "*.ts" \) | while read -r file; do
    log "检查文件: $file"
    
    # 检查错误处理
    if ! grep -q "try.*catch" "$file"; then
      error "$file 缺少错误处理"
      exit 1
    fi
    
    # 检查日志输出
    if ! grep -q "console.log\|console.error" "$file"; then
      error "$file 缺少日志输出"
      exit 1
    fi
    
    # 检查环境变量使用
    if grep -q "process.env" "$file"; then
      if ! grep -q "process.env.*||" "$file"; then
        error "$file 环境变量缺少默认值"
        exit 1
      fi
    fi
    
    # 检查健康检查端点
    if grep -q "express()" "$file"; then
      if ! grep -q "'/health'" "$file"; then
        error "$file 缺少健康检查端点"
        exit 1
      fi
    fi
  done
}

# 主函数
main() {
  local services_dir="services"
  
  # 检查 services 目录下的所有服务
  for service in "$services_dir"/*; do
    if [ -d "$service" ]; then
      check_files "$service"
    fi
  done
  
  log "代码风格检查完成"
}

main "$@" 