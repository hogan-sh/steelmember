import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getSupabaseAdmin } from '~/server/utils/supabase'
import { z } from 'zod'

const loginSchema = z.object({
  account: z.string().min(1, '請輸入帳號'),
  password: z.string().min(1, '請輸入密碼'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.errors[0].message,
    })
  }

  const { account, password } = result.data

  try {
    const supabase = getSupabaseAdmin()
    const { data: user, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('account', account)
      .single()

    if (error || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '帳號或密碼錯誤',
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: '帳號或密碼錯誤',
      })
    }

    const config = useRuntimeConfig()
    const secret = config.jwtSecret || process.env.JWT_SECRET || 'steelmember-secret-key-2024'

    const token = jwt.sign(
      { id: user.id, account: user.account, role: user.role },
      secret,
      { expiresIn: '8h' }
    )

    return {
      token,
      user: {
        id: user.id,
        account: user.account,
        role: user.role,
      },
    }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器錯誤',
    })
  }
})
