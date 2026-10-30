# qa-api-stock

Suite de API testing para [stock-system-obra-main](https://github.com/marcebusi/stock-system-obra-main).

## Stack

- **Jest** — test runner
- **Supertest** — HTTP assertions
- **TypeScript** — tipado estático
- **ts-jest** — compilación en runtime

## Cobertura

| Módulo | Tests | Qué cubre |
|--------|-------|-----------|
| Auth | 7 | Login OK/fail, campos vacíos, perfil autenticado, logout |
| Productos | 7 | CRUD completo, validaciones, acceso sin auth |
| Entradas | 6 | CRUD, campos obligatorios, cantidad inválida |
| Salidas | 6 | CRUD, campos obligatorios, cantidad inválida |
| Obras | 6 | CRUD, campos obligatorios |
| Categorías | 6 | CRUD, campos obligatorios |
| Personal | 6 | CRUD, DNI inválido, campos obligatorios |
| Usuarios | 4 | Listado admin, acceso sin auth, log de auditoría |
| **Total** | **48** | |

## Setup

### Requisitos

- Node.js 18+
- Backend de `stock-system-obra-main` corriendo en `localhost:3001`
- Usuario de prueba en la base de datos

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crear `.env.test` en la raíz del proyecto:

```env
API_URL=http://localhost:3001/api
TEST_USERNAME=qa@test.com
TEST_PASSWORD=TestPass123!
EMPRESA_SLUG=dev
```

### Crear usuario de prueba en la DB

```sql
INSERT INTO usuario (nombre_u, email, password_hash, username, rol, empresa_id)
VALUES ('Test Admin', 'qa@test.com', '<bcrypt_hash>', 'qa@test.com', 'admin', 1);
```

> El hash debe generarse con bcrypt, saltRounds=10.

## Correr los tests

```bash
npm test
```

Los tests corren en serie (`--runInBand`) para evitar conflictos en la base de datos.

## Estructura

```
src/
├── helpers/
│   └── auth.ts        # login helper + wrapper de supertest
├── setup.ts           # carga .env.test antes de cada suite
└── tests/
    ├── auth.test.ts
    ├── productos.test.ts
    ├── entradas.test.ts
    ├── salidas.test.ts
    ├── obras.test.ts
    ├── categorias.test.ts
    ├── personal.test.ts
    └── usuarios.test.ts
```
