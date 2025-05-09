-- 管理後台用戶表
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 提領審核日誌
CREATE TABLE IF NOT EXISTS withdrawal_audit_logs (
  id SERIAL PRIMARY KEY,
  withdrawal_id INT NOT NULL,
  action VARCHAR(32) NOT NULL,
  actor VARCHAR(64) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC 批量審核日誌
CREATE TABLE IF NOT EXISTS kyc_audit_logs (
  id SERIAL PRIMARY KEY,
  kyc_id INT NOT NULL,
  action VARCHAR(32) NOT NULL,
  actor VARCHAR(64) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
); 