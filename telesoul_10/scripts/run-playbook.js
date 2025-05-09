#!/usr/bin/env node
// 用途: 執行自動化 Playbook 任務，並顯示每個任務（功能/模組）進度百分比
// 參考: playbook.yaml, MAINTENANCE_GUIDELINES.md, scripts/notify.sh
// 被引用: dev-init.sh, playbook.yaml, README.md, MAINTENANCE_GUIDELINES.md
// 負責人: TeleSoul Team

const fs = require('fs');
const yaml = require('js-yaml');
const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const playbookFile = args[0] || 'playbook.yaml';
const env = args[2] || 'local';
const logFile = path.join('logs', 'dev-init.log');
const notify = msg => {
  try { execSync(`./scripts/notify.sh "${msg}"`); } catch {}
};

function log(msg) {
  fs.appendFileSync(logFile, `[INFO]    ${msg}\n`);
  console.log(msg);
}

if (!fs.existsSync(playbookFile)) {
  log(`[ERROR] Playbook 檔案不存在: ${playbookFile}`);
  notify(`[ERROR] Playbook 檔案不存在: ${playbookFile}`);
  process.exit(1);
}

const playbook = yaml.load(fs.readFileSync(playbookFile, 'utf8'));
const tasks = (Array.isArray(playbook) ? playbook[0].tasks : playbook.tasks) || [];
const total = tasks.length;

for (let i = 0; i < total; i++) {
  const task = tasks[i];
  const percent = Math.round(((i + 1) * 100) / total);
  const desc = task.name || `Task ${i + 1}`;
  const progressMsg = `[PROGRESS] ${percent}% - ${desc}`;
  log(progressMsg);
  notify(progressMsg);
  try {
    if (task['ansible.builtin.shell']) {
      execSync(task['ansible.builtin.shell'], { stdio: 'inherit' });
    } else {
      log(`[SKIP] 不支援的任務型別: ${desc}`);
    }
  } catch (e) {
    log(`[ERROR] 任務失敗: ${desc}`);
    notify(`[ERROR] 任務失敗: ${desc}`);
    process.exit(1);
  }
}

log(`[PROGRESS] 100% - Playbook 全部任務完成`);
notify(`[PROGRESS] 100% - Playbook 全部任務完成`); 