import { loginAdmin, api } from '../helpers/auth'

describe('Categorías API', () => {
  let cookie: string
  let createdId: number

  beforeAll(async () => {
    const session = await loginAdmin()
    cookie = session.cookie
  })

  // TC-API-CAT-01
  test('GET /categorias — devuelve lista de categorías', async () => {
    const res = await api(cookie).get('/categorias')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  // TC-API-CAT-02
  test('POST /categorias — crea una categoría correctamente', async () => {
    const res = await api(cookie).post('/categorias', {
      name: `Categoría Test ${Date.now()}`,
      hourlyrate: 1500,
    })

    expect(res.status).toBe(201)
    createdId = res.body.data?.id ?? res.body.data?.id_categoria ?? res.body.id
  })

  // TC-API-CAT-03
  test('POST /categorias — sin nombre devuelve 400', async () => {
    const res = await api(cookie).post('/categorias', {
      hourlyrate: 1000,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-CAT-04
  test('POST /categorias — sin valor hora devuelve 400', async () => {
    const res = await api(cookie).post('/categorias', {
      name: 'Categoría sin rate',
    })

    expect(res.status).toBe(400)
  })

  // TC-API-CAT-05
  test('PUT /categorias/:id — actualiza una categoría', async () => {
    const res = await api(cookie).put(`/categorias/${createdId}`, {
      name: `Categoría Actualizada ${Date.now()}`,
      hourlyrate: 2000,
    })

    expect([200, 204]).toContain(res.status)
  })

  // TC-API-CAT-06
  test('DELETE /categorias/:id — elimina la categoría creada', async () => {
    const res = await api(cookie).del(`/categorias/${createdId}`)

    expect([200, 204]).toContain(res.status)
  })

})
