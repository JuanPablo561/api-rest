# REST-API con Node.js, Express y SQL Server

## Instalación
```bash
npm install
cp .env.example .env     # y edita tus credenciales
# Ejecuta sql/schema.sql en SQL Server (SSMS / Azure Data Studio)
npm run dev
```

## Rutas
| Método | Ruta         | Descripción                    |
|--------|--------------|--------------------------------|
| GET    | /            | Bienvenida                     |
| GET    | /marco       | Responde `polo`                |
| GET    | /ping        | Responde `pong` + prueba de BD |
| GET    | /users       | Lista usuarios                 |
| GET    | /users/:id   | Obtiene un usuario             |
| POST   | /users       | Crea usuario                   |
| PUT    | /users/:id   | Actualiza usuario              |
| DELETE | /users/:id   | Elimina usuario                |
| POST   | /login       | Valida email y password        |

## Pruebas rápidas (curl)
```bash
curl http://localhost:3000/marco
curl http://localhost:3000/ping
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@mail.com","password":"1234"}'
curl http://localhost:3000/users
curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" \
  -d '{"name":"Ana López","email":"ana@mail.com"}'
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"1234"}'
curl -X DELETE http://localhost:3000/users/1
```
