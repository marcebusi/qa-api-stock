import request from 'supertest'
import { loginAdmin, api } from '../helpers/auth'

const BASE = process.env.API_URL ?? 'http://localhost:3001/api'

describe('Auth API', () => {

  // TC-API-AUTH-01
  test('POST /auth/login — credenciales válidas devuelve 200 y cookie', async () => {
    const res = await request(BASE)
      .post('/auth/login')
      .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  // TC-API-AUTH-02
  test('POST /auth/login — contraseña incorrecta devuelve 401', async () => {
    const res = await request(BASE)
      .post('/auth/login')
      .send({ username: process.env.TEST_USERNAME, password: 'WrongPass999!' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  // TC-API-AUTH-03
  test('POST /auth/login — usuario inexistente devuelve 401', async () => {
    const res = await request(BASE)
      .post('/auth/login')
      .send({ username: 'noexiste@nada.com', password: 'cualquiera123' })

    expect(res.status).toBe(401)
  })

  // TC-API-AUTH-04
  test('POST /auth/login — campos vacíos devuelve 400', async () => {
    const res = await request(BASE)
      .post('/auth/login')
      .send({})

    expect(res.status).toBe(400)
  })

  // TC-API-AUTH-05
  test('GET /auth/profile — autenticado devuelve datos del usuario', async () => {
    const { cookie } = await loginAdmin()
    const res = await api(cookie).get('/auth/profile')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('username')
  })

  // TC-API-AUTH-06
  test('GET /auth/profile — sin cookie devuelve 401 o 403', async () => {
    const res = await request(BASE).get('/auth/profile')

    expect([401, 403]).toContain(res.status)
  })

  // TC-API-AUTH-07
  test('POST /auth/logout — cierra la sesión correctamente', async () => {
    const { cookie } = await loginAdmin()
    const res = await api(cookie).post('/auth/logout', {})

    expect([200, 204]).toContain(res.status)
  })

})
