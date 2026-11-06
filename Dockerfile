# ==========================================
# 1. Estágio de Build (Compilação do código)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifestos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies necessárias para compilar)
RUN npm ci

# Copia todo o código-fonte do projeto
COPY . .

# Compila o TypeScript gerando os arquivos JS na pasta dist/
RUN npm run build

# ==========================================
# 2. Estágio de Produção (Imagem final)
# ==========================================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Instala apenas as dependências de produção para manter a imagem leve
COPY package*.json ./
RUN npm ci --only=production

# Copia os arquivos compilados do estágio de build
COPY --from=builder /app/dist ./dist

# Expõe a porta padrão configurada no servidor (8080)
EXPOSE 8080

# Inicia o servidor em produção
CMD ["node", "dist/server.js"]

