import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.industry_code) {
    throw createError({ statusCode: 400, statusMessage: '產業代碼必填' })
  }

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('psi_industry_codes')
      .upsert(body, { onConflict: 'industry_code' })
      .select()
      .single()

    if (error) throw error
    return { data, message: '儲存成功' }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; statusMessage?: string; message?: string }
    if (e.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: e.message || '儲存失敗' })
  }
})
