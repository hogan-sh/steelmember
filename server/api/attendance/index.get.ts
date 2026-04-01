import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { session_number } = query

  try {
    const supabase = getSupabaseAdmin()
    let q = supabase
      .from('deputies')
      .select('*, members(member_name, short_name, factory_area, factory_city)')
      .eq('deputy_type', 1)

    if (session_number) q = q.eq('session_number', session_number)

    const { data, error } = await q.order('deputation_number', { ascending: true })

    if (error) throw error
    return { data }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
