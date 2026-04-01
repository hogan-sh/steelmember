import { getSupabaseAdmin } from '~/server/utils/supabase'
import { z } from 'zod'

const memberSchema = z.object({
  member_number: z.string().min(1, '會員編號必填'),
  member_name: z.string().min(1, '會員名稱必填'),
  member_en_name: z.string().optional(),
  short_name: z.string().optional(),
  chairman_name: z.string().optional(),
  chairman_en_name: z.string().optional(),
  application_date: z.string().optional().nullable(),
  join_date: z.string().optional().nullable(),
  license_date: z.string().optional().nullable(),
  capital: z.number().optional().nullable(),
  level: z.string().optional(),
  unified_business_number: z.string().optional(),
  factory_area: z.string().optional(),
  factory_city: z.string().optional(),
  major_number: z.string().optional(),
  more_number: z.string().optional(),
  member_status: z.string().default('00'),
  co_url: z.string().optional(),
  co_email: z.string().optional(),
  member_zip: z.string().optional(),
  member_address: z.string().optional(),
  member_en_address: z.string().optional(),
  member_tel: z.string().optional(),
  member_fax: z.string().optional(),
  contact_zip: z.string().optional(),
  contact_address: z.string().optional(),
  contact_tel: z.string().optional(),
  contact_fax: z.string().optional(),
  equi: z.string().optional(),
  prod: z.string().optional(),
  electric_power_high: z.number().optional().nullable(),
  electric_power_low: z.number().optional().nullable(),
  employee_nums: z.number().default(0),
  worker_nums: z.number().default(0),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = memberSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.errors[0].message,
    })
  }

  try {
    const supabase = getSupabaseAdmin()

    // Check duplicate member number
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('member_number', result.data.member_number)
      .single()

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: '會員編號已存在',
      })
    }

    const { data, error } = await supabase
      .from('members')
      .insert(result.data)
      .select()
      .single()

    if (error) throw error

    return { data, message: '會員建立成功' }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: e.message || '建立失敗',
    })
  }
})
