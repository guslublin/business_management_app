# Usar una imagen base de Node.js LTS (20)
FROM node:20

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar solo el package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm install ajv@^8.0.0 ajv-keywords@^5.0.0 --save && \
    npm cache clean --force
# Copiar el resto del código al contenedor
COPY . .

# Exponer el puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
