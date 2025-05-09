#!/bin/bash

# 设置错误时退出
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 打印带颜色的消息
print_message() {
  echo -e "${2}${1}${NC}"
}

# 检查环境
check_environment() {
  print_message "检查环境..." "${YELLOW}"
  
  # 检查 Node.js
  if ! command -v node &> /dev/null; then
    print_message "错误: 未找到 Node.js" "${RED}"
    exit 1
  fi
  
  # 检查 pnpm
  if ! command -v pnpm &> /dev/null; then
    print_message "错误: 未找到 pnpm" "${RED}"
    exit 1
  fi
  
  # 检查 Docker
  if ! command -v docker &> /dev/null; then
    print_message "错误: 未找到 Docker" "${RED}"
    exit 1
  fi
  
  print_message "环境检查通过" "${GREEN}"
}

# 启动测试环境
start_test_environment() {
  print_message "启动测试环境..." "${YELLOW}"
  
  # 启动数据库
  docker-compose -f docker-compose.test.yml up -d postgres redis
  
  # 等待数据库就绪
  sleep 5
  
  print_message "测试环境启动完成" "${GREEN}"
}

# 运行后端测试
run_backend_tests() {
  print_message "运行后端测试..." "${YELLOW}"
  
  cd backend
  
  # 安装依赖
  pnpm install
  
  # 运行单元测试
  pnpm test
  
  # 运行集成测试
  pnpm test:e2e
  
  # 检查测试覆盖率
  pnpm test:cov
  
  cd ..
  
  print_message "后端测试完成" "${GREEN}"
}

# 运行前端测试
run_frontend_tests() {
  print_message "运行前端测试..." "${YELLOW}"
  
  cd frontend
  
  # 安装依赖
  pnpm install
  
  # 运行单元测试
  pnpm test
  
  # 运行组件测试
  pnpm test:components
  
  # 运行 E2E 测试
  pnpm test:e2e
  
  # 检查测试覆盖率
  pnpm test:coverage
  
  cd ..
  
  print_message "前端测试完成" "${GREEN}"
}

# 运行性能测试
run_performance_tests() {
  print_message "运行性能测试..." "${YELLOW}"
  
  # 运行 k6 性能测试
  k6 run scripts/test/performance/api-load-test.js
  
  print_message "性能测试完成" "${GREEN}"
}

# 清理测试环境
cleanup_test_environment() {
  print_message "清理测试环境..." "${YELLOW}"
  
  # 停止并删除测试容器
  docker-compose -f docker-compose.test.yml down -v
  
  print_message "测试环境清理完成" "${GREEN}"
}

# 主函数
main() {
  print_message "开始自动化测试..." "${YELLOW}"
  
  # 检查环境
  check_environment
  
  # 启动测试环境
  start_test_environment
  
  # 运行后端测试
  run_backend_tests
  
  # 运行前端测试
  run_frontend_tests
  
  # 运行性能测试
  run_performance_tests
  
  # 清理测试环境
  cleanup_test_environment
  
  print_message "自动化测试完成" "${GREEN}"
}

# 执行主函数
main 