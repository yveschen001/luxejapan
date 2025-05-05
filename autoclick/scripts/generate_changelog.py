import os
import re
from datetime import datetime

DOCS_DIR = 'docs'
CHANGELOG_MD = 'CHANGELOG.md'
LOG_HEADER = '## 🔄 更新日志'


def extract_changelog(md_path):
    with open(md_path, encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'## 🔄 更新日志\n([\s\S]+?)(\n## |\Z)', content)
    if match:
        return match.group(1).strip()
    return None


def main():
    logs = []
    for fname in os.listdir(DOCS_DIR):
        if fname.endswith('.md'):
            path = os.path.join(DOCS_DIR, fname)
            log = extract_changelog(path)
            if log:
                logs.append(f'### {fname}\n{log}\n')
    if logs:
        with open(CHANGELOG_MD, 'w', encoding='utf-8') as f:
            f.write(f'# AutoClicker 变更日志\n\n生成时间: {datetime.now().isoformat()}\n\n')
            for l in logs:
                f.write(l + '\n')
        print(f'已生成 {CHANGELOG_MD}')
    else:
        print('未找到任何更新日志区块。')

if __name__ == '__main__':
    main() 