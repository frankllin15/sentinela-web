# Configuração de Ambientes

Este projeto utiliza variáveis de ambiente para configurar a URL base da API de acordo com o ambiente de execução.

## Arquivos de Ambiente

### `.env` (Desenvolvimento - ignorado pelo git)
Usado automaticamente no modo desenvolvimento (`pnpm dev`).
```env
VITE_API_BASE_URL=http://localhost:3000
```

### `.env.production` (Produção - commitado no repositório)
Usado automaticamente no modo produção (`pnpm build` e `pnpm preview`).
```env
VITE_API_BASE_URL=https://sentinela-backend.onrender.com
```

### `.env.example` (Template)
Template para novos desenvolvedores criarem seu `.env` local.

## Como Usar

### Desenvolvimento Local
```bash
# Certifique-se que o arquivo .env existe
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm dev
```
A aplicação se conectará ao backend local: `http://localhost:3000`

### Build para Produção
```bash
# Build com variáveis de produção
pnpm build

# Preview do build de produção
pnpm preview
```
A aplicação se conectará ao backend de produção: `https://sentinela-backend.onrender.com`

## Sobrescrevendo Variáveis

### Por Linha de Comando
Você pode sobrescrever variáveis diretamente ao executar comandos:
```bash
# Desenvolvimento com API de produção
VITE_API_BASE_URL=https://sentinela-backend.onrender.com pnpm dev

# Build com API customizada
VITE_API_BASE_URL=https://api-staging.example.com pnpm build
```

### Arquivo `.env.local` (Opcional)
Crie um arquivo `.env.local` para sobrescrever valores em todos os modos:
```env
# .env.local (ignorado pelo git)
VITE_API_BASE_URL=https://minha-api-custom.com
```

**Ordem de precedência** (do maior para o menor):
1. Variáveis de ambiente do sistema
2. `.env.local`
3. `.env.[mode]` (`.env.development` ou `.env.production`)
4. `.env`

## Segurança

- ⚠️ **NUNCA** commite arquivos `.env` ou `.env.local` no git (já estão no `.gitignore`)
- ✅ Arquivos `.env.production` e `.env.example` podem ser commitados (não contêm credenciais sensíveis)
- ⚠️ **NUNCA** adicione chaves de API, senhas ou tokens em arquivos de ambiente commitados no repositório
- 💡 Para credenciais sensíveis, use variáveis de ambiente do sistema ou serviços de gerenciamento de segredos

## Verificando o Ambiente

No código, você pode acessar as variáveis assim:
```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const mode = import.meta.env.MODE; // 'development' ou 'production'
const isDev = import.meta.env.DEV; // true em desenvolvimento
const isProd = import.meta.env.PROD; // true em produção
```

## Troubleshooting

### As variáveis não estão sendo carregadas
1. Certifique-se que o arquivo `.env` existe na raiz do projeto
2. Reinicie o servidor de desenvolvimento após modificar arquivos `.env`
3. Variáveis devem começar com `VITE_` para serem expostas ao código do cliente

### API retorna erro de CORS
Verifique se:
1. O backend está rodando na URL especificada
2. O backend está configurado para aceitar requisições da URL do frontend
3. Você está usando a URL correta para o ambiente
