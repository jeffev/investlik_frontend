# Usa a imagem oficial do Node.js
FROM node:14

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package.json .
RUN npm install

# Copia o restante do código do frontend para o contêiner
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Usa a imagem do Nginx para servir o frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expõe a porta que o Nginx vai rodar
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
