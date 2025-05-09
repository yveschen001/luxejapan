-- 日報表快照
CREATE TABLE IF NOT EXISTS daily_snapshots (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  version INT NOT NULL DEFAULT 1,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(snapshot_date, version)
);

-- 交易指標
CREATE TABLE IF NOT EXISTS metrics_transactions (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  agent_id INT,
  amount NUMERIC(12,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 活躍用戶指標
CREATE TABLE IF NOT EXISTS metrics_user_activity (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  active_users INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 提領統計
CREATE TABLE IF NOT EXISTS metrics_withdrawal_summary (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  total_withdrawals NUMERIC(12,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 排行榜
CREATE TABLE IF NOT EXISTS metrics_leaderboard (
  id SERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  type VARCHAR(32) NOT NULL,
  top_users JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
); 