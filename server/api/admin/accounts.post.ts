import bcrypt from 'bcryptjs'
import { getSupabaseAdmin } from '~/server/utils/supabase'
import { z } from 'zod'

const schema = z.object({
  account: z.string().min(3, '帳號至少 3 個字元').max(50),
  password: z.string().min(6, '密碼至少 6 個字元'),
  role: z.enum(['admin', 'editor', 'observer'], { errorMap: () => ({ message: '無效的角色' }) }),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: '帳號管理僅限管理者操作' })
  }

  const body = await readBody(event)
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.errors[0].message })
  }

  const { account, password, role } = result.data
  const supabase = getSupabaseAdmin()

  const { data: existing } = await supabase
    .from('accounts')
    .select('id')
    .eq('account', account)
    .single()

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: '帳號已存在' })
  }

  const password_hash = await bcrypt.hash(password, 12)
  const { data, error } = await supabase
    .from('accounts')
    .insert({ account, password_hash, role })
    .select('id, account, role, created_at')
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
