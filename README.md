# 📌 prestamype-tcd-api

API REST para el **Sistema para una casa de cambio digital**, desarrollada con:

- **Node.js v24.1.0**
- **NestJS**
- **Prisma ORM**
- **MongoDb Atlas**
- **JWT (autenticación)**
- **Nodemailer (notificaciones por correo)**

---

## 🚀 Requisitos previos

- [Node.js **v24.1.0**](https://nodejs.org/en/download/current)  
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)  
- **PostgreSQL** instalado y corriendo  

---

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/01Eddie/prstmp-tcd-api
   cd prstmp-tcd-api
    ```

2.	Crear un archivo **.env** en la raíz del proyecto con las siguientes variables globales:
    ```bash
    # 🗄️ Base de datos
    DATABASE_URL="mongodb+srv://{{usuario}}:{{password}}@localhost:{{PORT}}/prestamype?retryWrites=true&w=majority&appName=Cluster0"

    # 🌐 Puerto de Backend
    PORT=3000

    # 🌐 Ruta de Frontend
    FRONTEND_URL={{RUTA_FRONTEND}}
    
    # 🔑 JWT
    JWT_SECRET={{JWT_SECRET}}
    
    # 📧 Correo
    MAIL_USER={{MAIL}}
    MAIL_PASS={{CODE_DEFINE_MAIL}}
    MAIL_PORT={{NUMBER_PORT}}```

    # ␐ Url externo
    URL_CAMBIO_SEGURO={URL_EXTERNO}

3.	Instalar dependencias usando docker:
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

4.  Alternativamente puede usar el comando configurado:
    ```bash
    npm run docker:dev
    ```

---

## ▶️ Ejecución

- Modo desarrollo
    ```bash
    npm run start:dev
    ```
- Modo producción
    ```bash
    npm run build
    npm run start:prod
    ```
- Ejecutar tests
    ```bash
    npm run test
    ```

- ** Usando Docker(Recomendado) **
* Modo desarrollo
    ```bash
    npm run docker:dev
    ```
* Modo producción
    ```bash
    npm run docker:build
    npm run docker:prod
    ```

---

## 📚 Endpoints principales a probar
🔐 Autenticación
- POST /api/auth/register → Registro de usuario
    ```bash
    POST /api/auth/register HTTP/1.1
    Host: {{HOST}}
    Content-Type: application/json
    Content-Length: 88

    {
    "email": string,
    "password": string
    }
    ```

- POST /api/auth/login → Login de usuario
    ```bash
    POST /api/auth/login HTTP/1.1
    Host: {{HOST}}
    Content-Type: application/json
    Content-Length: 57

    {
    "email": string,
    "password": string
    }
    ```

👤 Tipo de Cambio

- GET /api/exchange/compra → Ver tipo de cambio 
    ```bash
    GET /api/exchange/compra HTTP/1.1
    Host: {{HOST}}
    Authorization: Bearer {{TOKEN}}
    ```

- POST /api/exchange/calculate-amount → Calcular Monto
    ```bash
    POST /api/exchange/calculate-amount HTTP/1.1
    Host: {{HOST}}
    Content-Type: application/json
    Authorization: Bearer {{TOKEN}}
    Content-Length: 18

    {
      "amount": Number,
      "tipo": String('compra', 'venta')
    }
    ```

- GET /api/exchange/history/{{page}}/{{limit}} → Listar paginadamente las tasas de cambio
    ```bash
    GET /api/exchange/history/{{page}}/{{limit}} HTTP/1.1
    Host: {{HOST}}
    Authorization: Bearer {{TOKEN}}
    ```

- GET api/exchange/history/{{ID}} → Ver detalle
    ```bash
    GET /api/exchange/history/{{ID}} HTTP/1.1
    Host: {{HOST}}
    Authorization: Bearer {{TOKEN}}
    ```

- DELETE /api/exchange/history/delete/{{ID}} → Eliminar sus solicitudes de cambio
    ```bash
    DELETE /api/exchange/history/delete/{{ID}} HTTP/1.1
    Host: {{HOST}}
    Content-Type: application/json
    Authorization: Bearer {{TOKEN}}
    Content-Length: 18
    ```

---

## 🛠️ Prisma ORM con MongoDB
Este proyecto usa Prisma ORM como capa de acceso a la base de datos.

- Inicializar Prisma
    ```bash
    npx prisma init    
    ```
    Esto genera un directorio prisma/ con el archivo schema.prisma.
- Generar cliente Prisma
    ```bash
    npx prisma generate   
    ```
- Ver la base de datos en navegador
    ```bash
    npx prisma studio   
    ```
