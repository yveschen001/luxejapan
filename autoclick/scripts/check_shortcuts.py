#!/usr/bin/env python3

import os
import re

def extract_shortcuts(content):
    shortcuts = {}
    current_section = None
    shortcut_pattern = re.compile(r'- (Command[\s\+\w]+)：(.+)')
    
    for line in content.split('\n'):
        if line.startswith('##') and not line.startswith('## 自動化'):
            current_section = line.strip('# ')
        elif current_section and line.strip().startswith('- Command'):
            match = shortcut_pattern.match(line.strip())
            if match:
                shortcut, function = match.groups()
                shortcut = shortcut.strip()
                if shortcut not in shortcuts:
                    shortcuts[shortcut] = []
                shortcuts[shortcut].append(function)
    
    return shortcuts

def check_shortcuts():
    shortcuts_file = os.path.join('docs', 'SHORTCUTS.md')
    if not os.path.exists(shortcuts_file):
        print(f"快捷鍵文件不存在: {shortcuts_file}")
        return False
    
    with open(shortcuts_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    shortcuts = extract_shortcuts(content)
    has_conflict = False
    
    for shortcut, functions in shortcuts.items():
        if len(functions) > 1:
            print(f"衝突: 快捷鍵 {shortcut} 被多個功能共用: {functions}")
            has_conflict = True
    
    if not has_conflict:
        print("快捷鍵檢查通過，無衝突。")
    
    return not has_conflict

def main():
    if not check_shortcuts():
        exit(1)

if __name__ == '__main__':
    main() 