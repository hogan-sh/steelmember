import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { search, unpaid, payment_type, year } = query

  try {
    const supabase = getSupabaseAdmin()
    let q = supabase
      .from('member_fees')
      .select('*, members(member_name, short_name, factory_area, factory_city)')

    if (search) {
      q = q.or(`member_number.ilike.%${search}%,payment_number.ilike.%${search}%`)
    }

    if (unpaid === 'true') {
      q = q.is('pay_date', null)
    }

    if (payment_type) q = q.eq('payment_type', payment_type)

    if (year) {
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`
      q = q.gte('period_start', startDate).lte('period_start', endDate)
    }

    const { data, error } = await q.order('period_start', { ascending: false }).limit(100)

    if (error) throw error
    return { data }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
