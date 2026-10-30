import { loginAdmin, api } from '../helpers/auth'

describe('Usuarios API (admin)', () => {
  let cookie: string

  beforeAll(async () => {
    const session = await loginAdmin()
    cookie = session.cookie
  })

  // TC-API-USR-01
  test('GET /usuarios — admin obtiene lista de usuarios', async () => {
    const res = await api(cookie).get('/usuarios')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data ?? res.body)).toBe(true)
  })

  // TC-API-USR-02
  test('GET /usuarios — sin autenticación devuelve 401 o 403', async () => {
    const res = await api().get('/usuarios')

    expect([401, 403]).toContain(res.status)
  })

  // TC-API-USR-03
  test('GET /audit — admin puede ver el log de auditoría', async () => {
    const res = await api(cookie).get('/audit')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body) || typeof res.body === 'object').toBe(true)
  })

  // TC-API-USR-04
  test('GET /audit — sin autenticación devuelve 401 o 403', async () => {
    const res = await api().get('/audit')

    expect([401, 403]).toContain(res.status)
  })

})
