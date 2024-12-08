# Usar una imagen base de Node.js LTS (20)
FROM node:20

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install --legacy-peer-deps

# Copiar todo el código al contenedor
COPY . .

# Exponer el puerto que usará la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
