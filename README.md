# AgroApp (Expo + React Native)

Aplicacion basica de muestra para venta de productos del campo directo al consumidor.

## Stack

- React Native (JavaScript)
- Expo
- Navegacion con React Navigation
- Variables de entorno con archivo `.env`
- API Node.js separada para persistencia y operaciones sensibles

## Flujo incluido

- Ingreso
- Registro de usuario (sin foto de perfil)
- Listado de productos con imagenes locales
- Carrito y pasarela de pago simulada
- Comprobante de pago

## Ejecutar

```bash
npm install
npm start
```

Luego abre en emulador o Expo Go.

### Microservicio de AgroApp

El backend es un proyecto independiente en `../microservico_AgroApp/` (la carpeta `Documentos/microservico_AgroApp`). Tiene sus propias dependencias y variables privadas.

1. Crea el archivo de configuración del backend:

```bash
cp ../microservico_AgroApp/.env.example ../microservico_AgroApp/.env
```

2. Instala e inicia el microservicio:

```bash
cd ../microservico_AgroApp
npm install
npm run dev
```

3. En el `.env` de la app Expo configura la URL de la API:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:4000
```

Para un dispositivo físico usa la IP LAN de tu computador. En AWS usa la URL pública HTTPS del microservicio. Nunca agregues claves de MongoDB o Wompi con el prefijo `EXPO_PUBLIC_`.

## Configuracion de entorno

Completa los valores en `.env` (app) y `../microservico_AgroApp/.env` (servidor).

## Colecciones sugeridas (MongoDB)

### usuarios

```json
{
  "nombres": "Juan",
  "apellidos": "Andres",
  "email": "juan@agroapp.com",
  "celular": "3000000000",
  "ciudad": "Pereira"
}
```

### ordenes

```json
{
  "usuario": {
    "nombres": "Juan",
    "apellidos": "Andres",
    "email": "juan@agroapp.com",
    "celular": "3000000000",
    "ciudad": "Pereira"
  },
  "productos": [
    {
      "id": "1",
      "nombre": "Tomate chonto",
      "precio": 4500,
      "cantidad": 2
    }
  ],
  "subtotal": 9000,
  "domicilio": 8000,
  "total": 17000,
  "paymentMethod": "Tarjeta",
  "status": "Aprobada",
  "createdAt": "2026-05-03T00:00:00.000Z"
}
```

Consulta la guía `DEPLOYMENT.md` dentro de `../microservico_AgroApp/` para publicar el backend.
