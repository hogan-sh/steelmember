-- ============================================================
-- 臺灣鋼鐵同業工會 會員管理系統 - Initial Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- 1. 管理員帳號
-- ─────────────────────────────────────────
create table if not exists accounts (
  id            uuid primary key default uuid_generate_v4(),
  account       text not null unique,
  password_hash text not null,
  role          text not null default 'admin' check (role in ('admin','adminfee','admins','member')),
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 2. 會員主檔
-- ─────────────────────────────────────────
create table if not exists members (
  id                       uuid primary key default uuid_generate_v4(),
  member_number            text not null unique,
  member_name              text not null,
  member_en_name           text,
  short_name               text,
  chairman_name            text,
  chairman_en_name         text,
  application_date         date,
  join_date                date,
  license_date             date,
  capital                  bigint,
  level                    text,
  unified_business_number  text,
  factory_area             text,   -- 1=北區 2=中區 3=南區
  factory_city             text,
  major_number             text,   -- 主要產業代碼
  more_number              text,   -- 其他產業代碼
  member_status            text default '00',  -- 00=正常 12=停權 14=撤銷 15=退出
  co_url                   text,
  co_email                 text,
  member_zip               text,
  member_address           text,
  member_en_address        text,
  member_tel               text,
  member_fax               text,
  contact_zip              text,
  contact_address          text,
  contact_tel              text,
  contact_fax              text,
  equi                     text,   -- 設備
  prod                     text,   -- 產品
  electric_power_high      numeric,
  electric_power_low       numeric,
  employee_nums            integer,
  worker_nums              integer,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists idx_members_member_number on members(member_number);
create index if not exists idx_members_member_status on members(member_status);
create index if not exists idx_members_factory_area  on members(factory_area);
create index if not exists idx_members_major_number  on members(major_number);

-- ─────────────────────────────────────────
-- 3. 工廠資料
-- ─────────────────────────────────────────
create table if not exists factories (
  id               uuid primary key default uuid_generate_v4(),
  member_id        uuid not null references members(id) on delete cascade,
  member_number    text,
  factory_number   text,
  factory_name     text,
  factory_zip      text,
  factory_address  text,
  factory_tel      text,
  factory_fax      text,
  factory_license  text,
  license_date     date,
  factory_area     numeric,   -- 廠房面積(坪)
  building_area    numeric,   -- 建築面積(坪)
  equi             text,
  prod             text,
  created_at       timestamptz not null default now()
);

create index if not exists idx_factories_member_id on factories(member_id);
create index if not exists idx_factories_member_number on factories(member_number);

-- ─────────────────────────────────────────
-- 4. 代表資料 (會員代表 / 出席代表 / 理監事)
-- ─────────────────────────────────────────
create table if not exists deputies (
  id                uuid primary key default uuid_generate_v4(),
  member_id         uuid not null references members(id) on delete cascade,
  member_number     text,
  deputation_number text,
  deputation_name   text,
  deputation_sex    integer default 1,  -- 0=女 1=男
  deputation_birth  date,
  deputation_title  text,
  session_number    integer,  -- 屆次
  deputy_type       integer default 0,
  -- 0=一般代表 1=出席代表 2=理事長 3=理事 4=常務理事
  -- 5=監事長 6=監事 7=常務監事 8=候補理事
  created_at        timestamptz not null default now()
);

create index if not exists idx_deputies_member_id on deputies(member_id);
create index if not exists idx_deputies_member_number on deputies(member_number);
create index if not exists idx_deputies_deputy_type on deputies(deputy_type);
create index if not exists idx_deputies_session_number on deputies(session_number);

-- ─────────────────────────────────────────
-- 5. 費用記錄
-- ─────────────────────────────────────────
create table if not exists member_fees (
  id               uuid primary key default uuid_generate_v4(),
  payment_number   text unique,
  member_id        uuid not null references members(id) on delete cascade,
  member_number    text,
  period_start     date,
  period_end       date,
  amount_due       numeric,
  payment_type     text,  -- 1=支票 2=郵匯 3=現金
  check_code       text,
  check_number     text,
  check_due_date   date,
  bank_code        text,
  bank_account     text,
  remit_bank       text,
  remit_account    text,
  pay_date         date,
  pay_money        numeric,
  created_at       timestamptz not null default now()
);

create index if not exists idx_member_fees_member_id     on member_fees(member_id);
create index if not exists idx_member_fees_member_number on member_fees(member_number);
create index if not exists idx_member_fees_period_start  on member_fees(period_start);

-- ─────────────────────────────────────────
-- 6. 異動記錄 (change log)
-- ─────────────────────────────────────────
create table if not exists change_logs (
  id             uuid primary key default uuid_generate_v4(),
  member_id      uuid not null references members(id) on delete cascade,
  member_number  text,
  change_date    date,
  board_report   text,   -- 報告理事會
  change_item    text,   -- 異動項目
  remarks        text,
  handler_info   text,
  created_at     timestamptz not null default now()
);

create index if not exists idx_change_logs_member_id on change_logs(member_id);
create index if not exists idx_change_logs_change_date on change_logs(change_date desc);

-- ─────────────────────────────────────────
-- 7. 會員檔案
-- ─────────────────────────────────────────
create table if not exists member_files (
  id             uuid primary key default uuid_generate_v4(),
  member_id      uuid not null references members(id) on delete cascade,
  member_number  text,
  file_name      text,
  file_path      text,
  file_size      bigint,
  uploaded_at    timestamptz not null default now()
);

create index if not exists idx_member_files_member_id on member_files(member_id);

-- ─────────────────────────────────────────
-- 8. PSI - 行業別代碼
-- ─────────────────────────────────────────
create table if not exists psi_industry_codes (
  id             uuid primary key default uuid_generate_v4(),
  industry_code  text not null unique,
  industry_name  text,
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 9. PSI - 產品代碼
-- ─────────────────────────────────────────
create table if not exists psi_product_codes (
  id               uuid primary key default uuid_generate_v4(),
  product_serial   text not null unique,
  product_code     text,
  data_type        text,
  product_name     text,
  product_en_name  text,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 10. PSI - 國家代碼
-- ─────────────────────────────────────────
create table if not exists psi_country_codes (
  id               uuid primary key default uuid_generate_v4(),
  country_code     text not null unique,
  country_name     text,
  country_en_name  text,
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 11. PSI - 產銷存資料
-- ─────────────────────────────────────────
create table if not exists psi_manufacture (
  id               uuid primary key default uuid_generate_v4(),
  data_year_month  text,   -- 格式: YYYYMM
  member_number    text,
  product_serial   text,
  quantity         numeric,
  created_at       timestamptz not null default now()
);

create index if not exists idx_psi_manufacture_year_month    on psi_manufacture(data_year_month);
create index if not exists idx_psi_manufacture_member_number on psi_manufacture(member_number);
create index if not exists idx_psi_manufacture_product       on psi_manufacture(product_serial);

-- ─────────────────────────────────────────
-- updated_at auto-update trigger
-- ─────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger members_updated_at
  before update on members
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────
-- Row Level Security (關閉 RLS，由後端 service key 控制)
-- ─────────────────────────────────────────
alter table accounts         disable row level security;
alter table members          disable row level security;
alter table factories        disable row level security;
alter table deputies         disable row level security;
alter table member_fees      disable row level security;
alter table change_logs      disable row level security;
alter table member_files     disable row level security;
alter table psi_industry_codes disable row level security;
alter table psi_product_codes  disable row level security;
alter table psi_country_codes  disable row level security;
alter table psi_manufacture    disable row level security;

-- ─────────────────────────────────────────
-- 預設管理員帳號 (密碼: admin1234，請上線後修改)
-- bcrypt hash of 'admin1234'
-- ─────────────────────────────────────────
insert into accounts (account, password_hash, role)
values (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
)
on conflict (account) do nothing;
