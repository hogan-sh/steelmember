import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const {
    search,
    factory_area,
    factory_city,
    major_number,
    member_status,
    level,
    page = 1,
    pageSize = 20,
  } = query

  try {
    const supabase = getSupabaseAdmin()
    let queryBuilder = supabase
      .from('members')
      .select('*', { count: 'exact' })

    if (search) {
      queryBuilder = queryBuilder.or(
        `member_name.ilike.%${search}%,member_number.ilike.%${search}%,short_name.ilike.%${search}%,unified_business_number.ilike.%${search}%`
      )
    }
    if (factory_area) queryBuilder = queryBuilder.eq('factory_area', factory_area)
    if (factory_city) queryBuilder = queryBuilder.eq('factory_city', factory_city)
    if (major_number) queryBuilder = queryBuilder.eq('major_number', major_number)
    if (member_status) queryBuilder = queryBuilder.eq('member_status', member_status)
    if (level) queryBuilder = queryBuilder.eq('level', level)

    const pageNum = Number(page)
    const pageSizeNum = Number(pageSize)
    const start = (pageNum - 1) * pageSizeNum
    const end = start + pageSizeNum - 1

    queryBuilder = queryBuilder
      .order('member_number', { ascending: true })
      .range(start, end)

    const { data, error, count } = await queryBuilder

    if (error) throw error

    return {
      data,
      total: count || 0,
      page: pageNum,
      pageSize: pageSizeNum,
    }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({
      statusCode: 500,
      statusMessage: e.message || '查詢失敗',
    })
  }
})
