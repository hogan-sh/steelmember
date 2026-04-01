import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { member_number, period_start, period_end, payment_type, page = 1, pageSize = 20 } = query

  try {
    const supabase = getSupabaseAdmin()
    let q = supabase
      .from('member_fees')
      .select('*, members(member_name, short_name)', { count: 'exact' })

    if (member_number) q = q.eq('member_number', member_number)
    if (payment_type) q = q.eq('payment_type', payment_type)
    if (period_start) q = q.gte('period_start', period_start)
    if (period_end) q = q.lte('period_end', period_end)

    const pageNum = Number(page)
    const pageSizeNum = Number(pageSize)
    const start = (pageNum - 1) * pageSizeNum

    const { data, error, count } = await q
      .order('pay_date', { ascending: false })
      .range(start, start + pageSizeNum - 1)

    if (error) throw error
    return { data, total: count || 0, page: pageNum, pageSize: pageSizeNum }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
