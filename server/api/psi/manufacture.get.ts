import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { year_month, member_number, product_serial, page = 1, pageSize = 50 } = query

  try {
    const supabase = getSupabaseAdmin()
    let q = supabase
      .from('psi_manufacture')
      .select('*', { count: 'exact' })

    if (year_month) q = q.eq('data_year_month', year_month)
    if (member_number) q = q.eq('member_number', member_number)
    if (product_serial) q = q.eq('product_serial', product_serial)

    const pageNum = Number(page)
    const pageSizeNum = Number(pageSize)
    const start = (pageNum - 1) * pageSizeNum

    const { data, error, count } = await q
      .order('data_year_month', { ascending: false })
      .range(start, start + pageSizeNum - 1)

    if (error) throw error
    return { data, total: count || 0, page: pageNum, pageSize: pageSizeNum }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
