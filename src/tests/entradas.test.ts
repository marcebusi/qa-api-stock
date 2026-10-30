import { loginAdmin, api } from '../helpers/auth'

describe('Entradas API', () => {
  let cookie: string
  let createdId: number
  let productCode: string

  beforeAll(async () => {
    const session = await loginAdmin()
    cookie = session.cookie

    // Crear un producto de prueba para usar en entradas
    const res = await api(cookie).post('/productos', {
      name: `Prod Entradas Test ${Date.now()}`,
      unitofmeasure: 'unidad',
    })
    productCode = res.body.data?.code
  })

  afterAll(async () => {
    if (productCode) {
      await api(cookie).del(`/productos/${productCode}`)
    }
  })

  // TC-API-ENT-01
  test('GET /entradas — devuelve lista de entradas', async () => {
    const res = await api(cookie).get('/entradas')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  // TC-API-ENT-02
  test('POST /entradas — crea una entrada correctamente', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/entradas', {
      code: productCode,
      date: today,
      quantity: 10,
      unitprice: 500,
    })

    expect(res.status).toBe(201)
    createdId = res.body.data?.id ?? res.body.id
  })

  // TC-API-ENT-03
  test('POST /entradas — sin código de producto devuelve 400', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/entradas', {
      date: today,
      quantity: 5,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-ENT-04
  test('POST /entradas — cantidad 0 devuelve 400', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/entradas', {
      code: productCode,
      date: today,
      quantity: 0,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-ENT-05
  test('PUT /entradas/:id — actualiza una entrada existente', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).put(`/entradas/${createdId}`, {
      code: productCode,
      quantity: 20,
      date: today,
      unitprice: 600,
    })

    expect([200, 204]).toContain(res.status)
  })

  // TC-API-ENT-06
  test('DELETE /entradas/:id — elimina la entrada creada', async () => {
    const res = await api(cookie).del(`/entradas/${createdId}`)

    expect([200, 204]).toContain(res.status)
  })

})
