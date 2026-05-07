# AgroApp (Expo + React Native)

Aplicacion basica de muestra para venta de productos del campo directo al consumidor.

## Stack

- React Native (JavaScript)
- Expo
- Navegacion con React Navigation
- Variables de entorno con archivo `.env`
- Persistencia de ordenes en MongoDB Data API (opcional, sin backend)

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

### API local para guardar usuarios en MongoDB local

1. Instala dependencias:

```bash
npm install
```

2. Asegurate de tener MongoDB local encendido (URI por defecto: `mongodb://localhost:27017`).

3. Inicia la API local:

```bash
npm run server
```

4. En `.env` agrega la URL de tu API local para que el registro la use:

```env
EXPO_PUBLIC_LOCAL_API_BASE_URL=http://127.0.0.1:4000
```

Si usas dispositivo fisico, reemplaza `127.0.0.1` por la IP LAN de tu computador.

## Configuracion de entorno

Completa los valores en `.env`.

Si no configuras MongoDB, la compra igual funciona y se guarda solo en memoria (modo demo).

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

## Nota importante

Este ejemplo es academico y simple. En produccion, la pasarela de pago y MongoDB deben pasar por backend para proteger llaves y validar transacciones.
