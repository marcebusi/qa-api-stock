import { loginAdmin, api } from '../helpers/auth'

describe('Personal API', () => {
  let cookie: string
  let categoryId: number
  let createdDni: string

  beforeAll(async () => {
    const session = await loginAdmin()
    cookie = session.cookie

    // Obtener una categoría existente
    const catRes = await api(cookie).get('/categorias')
    const cats = catRes.body.data ?? catRes.body
    categoryId = cats[0]?.id_categoria ?? cats[0]?.id
  })

  // TC-API-PER-01
  test('GET /personal — devuelve lista de trabajadores', async () => {
    const res = await api(cookie).get('/personal')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data ?? res.body)).toBe(true)
  })

  // TC-API-PER-02
  test('POST /personal — crea un trabajador correctamente', async () => {
    createdDni = `${Math.floor(10000000 + Math.random() * 89999999)}`
    const res = await api(cookie).post('/personal', {
      dni: createdDni,
      name: 'Trabajador Test API',
      categoryid: categoryId,
    })

    expect(res.status).toBe(201)
  })

  // TC-API-PER-03
  test('POST /personal — sin DNI devuelve 400', async () => {
    const res = await api(cookie).post('/personal', {
      name: 'Sin DNI',
      categoryid: categoryId,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-PER-04
  test('POST /personal — DNI inválido (letras) devuelve 400', async () => {
    const res = await api(cookie).post('/personal', {
      dni: 'ABCDEFG',
      name: 'DNI Inválido',
      categoryid: categoryId,
    })

    expect(res.status).toBe(400)
  })

  // TC-API-PER-05
  test('PUT /personal/:dni — actualiza un trabajador', async () => {
    const res = await api(cookie).put(`/personal/${createdDni}`, {
      name: 'Trabajador Actualizado',
      categoryid: categoryId,
    })

    expect([200, 204]).toContain(res.status)
  })

  // TC-API-PER-06
  test('DELETE /personal/:dni — elimina el trabajador creado', async () => {
    const res = await api(cookie).del(`/personal/${createdDni}`)

    expect([200, 204]).toContain(res.status)
  })

})
