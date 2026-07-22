# Despliegue en AWS EC2

Esta guía publica solamente el microservicio. La app Expo sigue siendo un proyecto independiente y solo consume su URL HTTPS.

## 1. Preparar la instancia

En una EC2 Ubuntu instala Node.js 20 LTS, Git y un gestor de procesos como PM2. Copia la carpeta `microservico_AgroApp` a la instancia y, dentro de ella, ejecuta:

```bash
npm install
cp .env.example .env
npm install -g pm2
pm2 start src/server.js --name agroapp-api
pm2 save
pm2 startup
```

Edita `.env` con una URI privada de MongoDB Atlas o DocumentDB. No instales ni expongas MongoDB sin controles de red en la misma EC2 para producción.

## 2. Seguridad de red

En el grupo de seguridad de EC2 permite SSH (22) únicamente desde tu IP y HTTP (80) / HTTPS (443) desde Internet si usarás Nginx. No expongas el puerto 4000 ni MongoDB (27017) a Internet. Nginx debe hacer proxy local a `127.0.0.1:4000`.

## 3. Dominio, HTTPS y proxy

Apunta un registro DNS de tu dominio a una Elastic IP de la instancia. Usa Nginx como proxy inverso y Certbot para TLS. El bloque de servidor debe enviar las solicitudes a `http://127.0.0.1:4000` y reenviar `Host` y `X-Forwarded-For`.

Una vez tengas HTTPS, actualiza la app Expo:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.tudominio.com
```

## 4. Verificar

```bash
curl https://api.tudominio.com/health
```

La respuesta esperada contiene `"ok": true`. Revisa también los logs con `pm2 logs agroapp-api`.

## Antes de producción

Las contraseñas del código actual se guardan en texto plano. Antes de abrir el servicio a usuarios reales, migra a hash con bcrypt/argon2 y añade autenticación con tokens, validación de entradas, rate limiting y verificación de webhooks de Wompi en el backend.
