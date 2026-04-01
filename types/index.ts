// ============================================
// TypeScript Interface Definitions
// ============================================

export interface Account {
  id: string
  account: string
  password_hash: string
  role: 'admin' | 'adminfee' | 'admins' | 'member'
  created_at: string
}

export interface Member {
  id: string
  member_number: string
  member_name: string
  member_en_name?: string
  short_name?: string
  chairman_name?: string
  chairman_en_name?: string
  application_date?: string
  join_date?: string
  license_date?: string
  capital?: number
  level?: string
  unified_business_number?: string
  factory_area?: string
  factory_city?: string
  major_number?: string
  more_number?: string
  member_status?: string
  co_url?: string
  co_email?: string
  member_zip?: string
  member_address?: string
  member_en_address?: string
  member_tel?: string
  member_fax?: string
  contact_zip?: string
  contact_address?: string
  contact_tel?: string
  contact_fax?: string
  equi?: string
  prod?: string
  electric_power_high?: number
  electric_power_low?: number
  employee_nums?: number
  worker_nums?: number
  created_at?: string
  updated_at?: string
}

export interface Factory {
  id: string
  member_id: string
  member_number?: string
  factory_number?: string
  factory_name?: string
  factory_zip?: string
  factory_address?: string
  factory_tel?: string
  factory_fax?: string
  factory_license?: string
  license_date?: string
  factory_area?: number
  building_area?: number
  equi?: string
  prod?: string
  created_at?: string
}

export interface Deputy {
  id: string
  member_id: string
  member_number?: string
  deputation_number?: string
  deputation_name?: string
  deputation_sex?: number
  deputation_birth?: string
  deputation_title?: string
  session_number?: number
  deputy_type?: number
  created_at?: string
}

export interface MemberFee {
  id: string
  payment_number?: string
  member_id: string
  member_number?: string
  period_start?: string
  period_end?: string
  amount_due?: number
  payment_type?: string
  check_code?: string
  check_number?: string
  check_due_date?: string
  bank_code?: string
  bank_account?: string
  remit_bank?: string
  remit_account?: string
  pay_date?: string
  pay_money?: number
  created_at?: string
}

export interface ChangeLog {
  id: string
  member_id: string
  member_number?: string
  change_date?: string
  board_report?: string
  change_item?: string
  remarks?: string
  handler_info?: string
  created_at?: string
}

export interface PsiIndustryCode {
  id: string
  industry_code: string
  industry_name?: string
  created_at?: string
}

export interface PsiProductCode {
  id: string
  product_serial: string
  product_code?: string
  data_type?: string
  product_name?: string
  product_en_name?: string
  created_at?: string
}

export interface PsiCountryCode {
  id: string
  country_code: string
  country_name?: string
  country_en_name?: string
  created_at?: string
}

export interface PsiManufacture {
  id: string
  data_year_month?: string
  member_number?: string
  product_serial?: string
  quantity?: number
  created_at?: string
}

export interface MemberFile {
  id: string
  member_id: string
  member_number?: string
  file_name?: string
  file_path?: string
  file_size?: number
  uploaded_at?: string
}

// Auth types
export interface AuthUser {
  id: string
  account: string
  role: string
}

export interface LoginCredentials {
  account: string
  password: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  total?: number
  page?: number
  pageSize?: number
}

// Filter types
export interface MemberFilter {
  search?: string
  factory_area?: string
  factory_city?: string
  major_number?: string
  member_status?: string
  level?: string
  page?: number
  pageSize?: number
}

export interface FeeFilter {
  member_number?: string
  period_start?: string
  period_end?: string
  payment_type?: string
  page?: number
  pageSize?: number
}

// Dashboard stats
export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  suspendedMembers: number
  withdrawnMembers: number
  membersByArea: { area: string; count: number }[]
  membersByLevel: { level: string; count: number }[]
  membersByIndustry: { industry: string; count: number }[]
  recentFees: MemberFee[]
  recentChanges: ChangeLog[]
}

// Constants
export const MEMBER_STATUS_MAP: Record<string, string> = {
  '00': '正常',
  '12': '停權',
  '14': '撤銷',
  '15': '退出',
}

export const FACTORY_AREA_MAP: Record<string, string> = {
  '1': '北區',
  '2': '中區',
  '3': '南區',
}

export const MAJOR_NUMBER_MAP: Record<string, string> = {
  'A': '鋼鐵業',
  'B': '鑄造業',
  'C': '金屬表面處理業',
  'D': '金屬製品業',
  'E': '機械製造業',
  'F': '電機電子業',
  'G': '汽機車零件業',
  'H': '螺絲螺帽業',
  'I': '不鏽鋼業',
  'J': '鋁合金業',
  'K': '線材製品業',
  'L': '其他金屬業',
  'M': '鋼鐵貿易業',
}

export const PAYMENT_TYPE_MAP: Record<string, string> = {
  '1': '支票',
  '2': '郵匯',
  '3': '現金',
}

export const DEPUTY_TYPE_MAP: Record<number, string> = {
  0: '一般代表',
  1: '出席代表',
  2: '理事長',
  3: '理事',
  4: '常務理事',
  5: '監事長',
  6: '監事',
  7: '常務監事',
  8: '候補理事',
}
