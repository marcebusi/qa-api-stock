import request from 'supertest'

const BASE = process.env.API_URL ?? 'http://localhost:3001/api'

export interface AuthSession {
  cookie: string
}

export async function loginAs(username: string, password: string): Promise<AuthSession> {
  const res = await request(BASE)
    .post('/auth/login')
    .send({ username, password })

  if (res.status !== 200) {
    throw new Error(`Login failed (${res.status}): ${JSON.stringify(res.body)}`)
  }

  const setCookie = res.headers['set-cookie'] as string[] | string | undefined
  if (!setCookie) throw new Error('No set-cookie header in login response')

  const cookieHeader = Array.isArray(setCookie) ? setCookie[0] : setCookie
  const tokenPart = cookieHeader.split(';')[0]
  return { cookie: tokenPart }
}

export async function loginAdmin(): Promise<AuthSession> {
  return loginAs(
    process.env.TEST_USERNAME ?? 'qa@test.com',
    process.env.TEST_PASSWORD ?? 'TestPass123!'
  )
}

export function api(cookie?: string) {
  const agent = request(BASE)
  return {
    get: (path: string) => {
      const req = request(BASE).get(path)
      if (cookie) req.set('Cookie', cookie)
      return req
    },
    post: (path: string, body: object) => {
      const req = request(BASE).post(path).send(body)
      if (cookie) req.set('Cookie', cookie)
      return req
    },
    put: (path: string, body: object) => {
      const req = request(BASE).put(path).send(body)
      if (cookie) req.set('Cookie', cookie)
      return req
    },
    patch: (path: string, body: object) => {
      const req = request(BASE).patch(path).send(body)
      if (cookie) req.set('Cookie', cookie)
      return req
    },
    del: (path: string) => {
      const req = request(BASE).delete(path)
      if (cookie) req.set('Cookie', cookie)
      return req
    },
  }
}
