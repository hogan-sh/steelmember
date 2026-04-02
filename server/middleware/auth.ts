import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // Only protect /api routes
  if (!path.startsWith('/api/')) {
    return
  }

  // Public API endpoints (no auth required)
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/public/',
    '/api/psi/industry-codes',
    '/api/psi/product-codes',
    '/api/psi/country-codes',
  ]

  if (publicEndpoints.some(ep => path.startsWith(ep))) {
    return
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權：請先登入',
    })
  }

  const token = authHeader.substring(7)
  const config = useRuntimeConfig()
  const secret = config.jwtSecret || process.env.JWT_SECRET || 'steelmember-secret-key-2024'

  try {
    const decoded = jwt.verify(token, secret) as { id: string; account: string; role: string }
    event.context.user = decoded
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權：Token 無效或已過期',
    })
  }

  const role = event.context.user?.role
  const method = getMethod(event)

  // Observer role: read-only access
  if (role === 'observer' && method !== 'GET') {
    throw createError({ statusCode: 403, statusMessage: '觀察者帳號僅限瀏覽，無法修改資料' })
  }

  // Account management: admin only
  if (path.startsWith('/api/admin/') && role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: '帳號管理僅限管理者操作' })
  }
})
