#!/usr/bin/env python3

import json
import os
import sys

def check_json_schema(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        required_fields = ['version', 'name', 'createdAt', 'actions']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            print(f"缺少字段: {missing_fields}")
            return False
        
        print("JSON 示例结构完整。")
        return True
    except Exception as e:
        print(f"檢查失敗: {str(e)}")
        return False

def main():
    # 檢查示例文件
    examples_dir = 'examples'
    if not os.path.exists(examples_dir):
        print(f"示例目錄不存在: {examples_dir}")
        sys.exit(1)
    
    success = True
    for i in range(1, 13):
        file_path = os.path.join(examples_dir, f'example_{i}.json')
        if os.path.exists(file_path):
            print(f"检查示例 {i}...")
            if not check_json_schema(file_path):
                success = False
    
    if not success:
        sys.exit(1)

if __name__ == '__main__':
    main() 