import { getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  try {
    const supabase = getSupabaseAdmin()

    const [membersResult, feesResult, logsResult] = await Promise.all([
      supabase.from('members').select('member_status, factory_area, major_number'),
      supabase.from('member_fees').select('*, members(member_name, short_name)').order('created_at', { ascending: false }).limit(10),
      supabase.from('change_logs').select('*, members(member_name)').order('created_at', { ascending: false }).limit(10),
    ])

    const members = membersResult.data || []

    const stats = {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.member_status === '00').length,
      suspendedMembers: members.filter(m => m.member_status === '12').length,
      withdrawnMembers: members.filter(m => m.member_status === '15' || m.member_status === '14').length,
      membersByArea: [
        { area: '北區', count: members.filter(m => m.factory_area === '1').length },
        { area: '中區', count: members.filter(m => m.factory_area === '2').length },
        { area: '南區', count: members.filter(m => m.factory_area === '3').length },
      ],
      recentFees: feesResult.data || [],
      recentChanges: logsResult.data || [],
    }

    return { data: stats }
  } catch (err: unknown) {
    const e = err as { message?: string }
    throw createError({ statusCode: 500, statusMessage: e.message || '查詢失敗' })
  }
})
