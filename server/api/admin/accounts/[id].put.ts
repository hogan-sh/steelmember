import bcrypt from 'bcryptjs'
import { getSupabaseAdmin } from '~/server/utils/supabase'
import { z } from 'zod'

const schema = z.object({
  role: z.enum(['admin', 'editor', 'observer'], { errorMap: () => ({ message: '無效的角色' }) }),
  password: z.string().min(6, '密碼至少 6 個字元').optional().or(z.literal('')),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: '帳號管理僅限管理者操作' })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.error.errors[0].message })
  }

  const { role, password } = result.data
  const supabase = getSupabaseAdmin()

  const updates: Record<string, string> = { role }
  if (password) {
    updates.password_hash = await bcrypt.hash(password, 12)
  }

  const { data, error } = await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select('id, account, role, created_at')
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
