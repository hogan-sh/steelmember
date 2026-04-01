import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { type } = query

  try {
    const supabase = getSupabaseAdmin()

    if (type === 'area') {
      const { data, error } = await supabase
        .from('members')
        .select('factory_area, member_status')
        .neq('member_status', '14')
        .neq('member_status', '15')

      if (error) throw error

      const stats: Record<string, number> = {}
      data?.forEach(m => {
        const area = m.factory_area || 'unknown'
        stats[area] = (stats[area] || 0) + 1
      })

      return { data: stats, type: 'area' }
    }

    if (type === 'industry') {
      const { data, error } = await supabase
        .from('members')
        .select('major_number, member_status')
        .eq('member_status', '00')

      if (error) throw error

      const stats: Record<string, number> = {}
      data?.forEach(m => {
        const ind = m.major_number || 'unknown'
        stats[ind] = (stats[ind] || 0) + 1
      })

      return { data: stats, type: 'industry' }
    }

    if (type === 'power') {
      const { data, error } = await supabase
        .from('members')
        .select('member_name, electric_power_high, electric_power_low, factory_area')
        .eq('member_status', '00')
        .not('electric_power_high', 'is', null)

      if (error) throw error
      return { data, type: 'power' }
    }

    // Default: summary
    const { data: members } = await supabase
      .from('members')
      .select('member_status, factory_area, major_number, level, capital, employee_nums, worker_nums')

    const summary = {
      total: members?.length || 0,
      active: members?.filter(m => m.member_status === '00').length || 0,
      suspended: members?.filter(m => m.member_status === '12').length || 0,
      cancelled: members?.filter(m => m.member_status === '14').length || 0,
      withdrawn: members?.filter(m => m.member_status === '15').length || 0,
    }

    return { data: summary, type: 'summary' }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '統計失敗' })
  }
})
