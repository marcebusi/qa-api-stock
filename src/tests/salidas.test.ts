import { loginAdmin, api } from '../helpers/auth'

describe('Salidas API', () => {
  let cookie: string
  let productCode: string
  let obraName: string
  let createdId: number

  beforeAll(async () => {
    const session = await loginAdmin()
    cookie = session.cookie

    // Crear producto de prueba
    const prodRes = await api(cookie).post('/productos', {
      name: `Prod Salidas Test ${Date.now()}`,
      unitofmeasure: 'unidad',
    })
    productCode = prodRes.body.data?.code

    // Obtener una obra existente para usar en salidas
    const obrasRes = await api(cookie).get('/obras')
    const obras = obrasRes.body.data ?? obrasRes.body
    obraName = obras[0]?.nombre_obra ?? obras[0]?.name ?? 'Sin Asignar'

    // Cargar stock inicial para poder hacer salida
    const today = new Date().toISOString().split('T')[0]
    await api(cookie).post('/entradas', {
      code: productCode,
      date: today,
      quantity: 100,
    })
  })

  afterAll(async () => {
    if (productCode) await api(cookie).del(`/productos/${productCode}`)
  })

  // TC-API-SAL-01
  test('GET /salidas — devuelve lista de salidas', async () => {
    const res = await api(cookie).get('/salidas')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  // TC-API-SAL-02
  test('POST /salidas — crea una salida correctamente', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/salidas', {
      code: productCode,
      date: today,
      quantity: 5,
      project: obraName,
    })

    expect(res.status).toBe(201)
    createdId = res.body.data?.id ?? res.body.id
  })

  // TC-API-SAL-03
  test('POST /salidas — sin código de producto devuelve 400', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/salidas', {
      date: today,
      quantity: 5,
      project: obraName,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-SAL-04
  test('POST /salidas — sin obra devuelve 400', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/salidas', {
      code: productCode,
      date: today,
      quantity: 5,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-SAL-05
  test('POST /salidas — cantidad 0 devuelve 400', async () => {
    const today = new Date().toISOString().split('T')[0]
    const res = await api(cookie).post('/salidas', {
      code: productCode,
      date: today,
      quantity: 0,
      project: obraName,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-SAL-06
  test('DELETE /salidas/:id — elimina la salida creada', async () => {
    const res = await api(cookie).del(`/salidas/${createdId}`)

    expect([200, 204]).toContain(res.status)
  })

})
