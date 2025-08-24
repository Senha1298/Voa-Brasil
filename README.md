# Voa Brasil Portal

Portal oficial do Programa Voa Brasil - Sistema de passagens aéreas por R$200 para qualquer lugar do Brasil.

## 🚀 Deploy no Heroku

### Pré-requisitos
- Conta no Heroku
- Heroku CLI instalado
- Git configurado

### Deploy Rápido
1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd voa-brasil-portal
   ```

2. **Crie o app no Heroku especificando buildpack Node.js**
   ```bash
   heroku create seu-app-name --buildpack heroku/nodejs
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set NPM_CONFIG_PRODUCTION=false
   heroku config:set PAGNET_PUBLIC_KEY=sua_chave_publica
   heroku config:set PAGNET_SECRET_KEY=sua_chave_secreta
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Se o buildpack não foi detectado corretamente:
```bash
heroku buildpacks:set heroku/nodejs
git push heroku main
```

### Importante: Build Process
O projeto usa `heroku-postbuild` script que:
- Instala devDependencies (NPM_CONFIG_PRODUCTION=false)
- Executa build do frontend (Vite)
- Executa build do backend (esbuild)
- Serve arquivos estáticos em produção

### Troubleshooting Common Issues
- **ES Module Error**: Script convertido para ES modules (import/export)
- **Build Dependencies**: NPM_CONFIG_PRODUCTION=false garante devDependencies
- **Node Version**: Usa Node.js mais recente disponível no Heroku
- **App Crash**: Verificar logs com `heroku logs --tail`
- **Environment Variables**: Configurar PAGNET_PUBLIC_KEY e PAGNET_SECRET_KEY

### Verificar Deploy
```bash
# Ver logs do Heroku
heroku logs --tail

# Verificar variáveis de ambiente
heroku config

# Restart da aplicação
heroku restart
```

### Deploy com um clique
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## ⚙️ Configuração

### Variáveis de Ambiente Obrigatórias
- `PAGNET_PUBLIC_KEY`: Chave pública da API Pagnet
- `PAGNET_SECRET_KEY`: Chave secreta da API Pagnet
- `NODE_ENV`: Ambiente (production para produção)
- `PORT`: Porta do servidor (automaticamente definida pelo Heroku)

### Recursos Utilizados
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Estilização**: Tailwind CSS + Design System gov.br
- **Pagamentos**: Integração PIX via Pagnet API
- **Autenticação**: Verificação CPF + dados pessoais

## 🏗️ Arquitetura

### Fluxo do Usuário
1. **Login**: Verificação de CPF e dados pessoais
2. **Verificação**: Múltiplas etapas de validação
3. **Informações**: Apresentação do programa
4. **Pagamento**: Taxa ANAC via PIX (R$ 64,80)
5. **Acesso**: Liberação para passagens com desconto

### Estrutura de Pastas
```
├── client/          # Frontend React
├── server/          # Backend Express
├── db/             # Configuração banco de dados
├── Procfile        # Configuração Heroku
├── app.json        # Metadata do app Heroku
└── Dockerfile      # Container Docker
```

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 📱 Funcionalidades

- ✅ Autenticação governamental (CPF)
- ✅ Verificação de elegibilidade
- ✅ Integração PIX para pagamentos
- ✅ Design responsivo (mobile-first)
- ✅ Interface gov.br oficial
- ✅ Processamento seguro de dados

## 🎯 Impostos ANAC

O sistema cobra os seguintes impostos obrigatórios:
- **TFAC**: Tarifa de Fiscalização da Aviação Civil - R$ 28,40
- **ATAERO**: Adicional de Tarifa Aeroportuária - R$ 19,20
- **PIS/COFINS e ICMS**: Impostos sobre passagem - R$ 17,20
- **Total**: R$ 64,80

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o programa, consulte os canais oficiais do governo federal.

---

**Desenvolvido para o Programa Voa Brasil - Governo Federal**