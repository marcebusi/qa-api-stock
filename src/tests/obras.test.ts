import { loginAdmin, api } from '../helpers/auth'

describe('Obras API', () => {
  let cookie: string
  let createdId: number

  beforeAll(async () => {
    const session = await loginAdmin()
    cookie = session.cookie
  })

  // TC-API-OBR-01
  test('GET /obras — devuelve lista de obras', async () => {
    const res = await api(cookie).get('/obras')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  // TC-API-OBR-02
  test('POST /obras — crea una obra correctamente', async () => {
    const res = await api(cookie).post('/obras', {
      name: `Obra API Test ${Date.now()}`,
      location: 'Calle Falsa 123',
      startdate: '2026-01-01',
      estado: 'activa',
    })

    expect(res.status).toBe(201)
    createdId = res.body.data?.id ?? res.body.id
  })

  // TC-API-OBR-03
  test('POST /obras — sin nombre devuelve 400', async () => {
    const res = await api(cookie).post('/obras', {
      startdate: '2026-01-01',
    })

    expect(res.status).toBe(400)
  })

  // TC-API-OBR-04
  test('POST /obras — sin fecha de inicio devuelve 400', async () => {
    const res = await api(cookie).post('/obras', {
      name: 'Obra sin fecha',
    })

    expect(res.status).toBe(400)
  })

  // TC-API-OBR-05
  test('PUT /obras/:id — actualiza una obra existente', async () => {
    const res = await api(cookie).put(`/obras/${createdId}`, {
      name: `Obra Actualizada ${Date.now()}`,
      startdate: '2026-01-01',
      estado: 'finalizada',
    })

    expect([200, 204]).toContain(res.status)
  })

  // TC-API-OBR-06
  test('DELETE /obras/:id — elimina la obra creada', async () => {
    const res = await api(cookie).del(`/obras/${createdId}`)

    expect([200, 204]).toContain(res.status)
  })

})
