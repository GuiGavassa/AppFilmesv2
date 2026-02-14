# 🚨 VOCÊ ESTÁ VENDO ERRO 401? LEIA AQUI! 🚨

## ⚡ Solução Rápida (5 minutos)

O erro **"HTTP error! status: 401"** acontece porque você ainda não configurou sua API Key do TMDb.

---

## 📍 PASSO A PASSO

### 1️⃣ **Obter sua API Key** (Gratuita!)

Abra este link no navegador:
```
https://www.themoviedb.org/signup
```

1. **Crie sua conta** (use qualquer email)
2. **Confirme seu email**
3. **Faça login** e vá para: https://www.themoviedb.org/settings/api
4. Clique em **"Request an API Key"** → **"Developer"**
5. Preencha:
   - Nome: `Meu App de Filmes`
   - URL: `http://localhost`  
   - Resumo: `App pessoal`
6. **Copie** a "API Key (v3 auth)" que aparece

---

### 2️⃣ **Configurar no projeto**

1. Abra o arquivo:
```
src/config/tmdb.js
```

2. Encontre esta linha:
```javascript
API_KEY: 'SUA_API_KEY_AQUI',  // ⬅️ AQUI!
```

3. Cole sua chave:
```javascript
API_KEY: 'a1b2c3d4e5f6g7h8...',  // ✅ Colou a chave
```

4. **Salve** o arquivo (Ctrl+S)

---

### 3️⃣ **Testar**

1. **Recarregue** o app (feche e abra)
2. Vá em **"Lista"** → **"+"**
3. Digite **"Matrix"**
4. Aguarde 2 segundos
5. **✨ Pronto!** Deve aparecer resultados

---

## 📋 Exemplo Completo

**ANTES** (causa erro 401):
```javascript
export const TMDB_CONFIG = {
  API_KEY: 'SUA_API_KEY_AQUI',    // ❌ Não configurado
  // ...
```

**DEPOIS** (funciona):
```javascript
export const TMDB_CONFIG = {
  API_KEY: 'eyJhbGciOiJIUzI1NiJ9...',    // ✅ Chave válida
  // ...
```

---

## ✅ Checklist

- [ ] Criei conta no TMDb
- [ ] Confirmei meu email
- [ ] Obtive a API Key
- [ ] Colei no arquivo `src/config/tmdb.js`
- [ ] Salvei o arquivo
- [ ] Recarreguei o app
- [ ] Testei buscar "Matrix"

---

## 🆘 Ainda não funciona?

1. **Verifique** se salvou o arquivo `src/config/tmdb.js`
2. **Aguarde** 5 minutos (às vezes a chave demora para ativar)
3. **Recarregue** o app completamente
4. **Teste** sua chave aqui:
   ```
   https://api.themoviedb.org/3/search/movie?api_key=SUA_CHAVE&query=matrix
   ```
   (substitua SUA_CHAVE pela sua)

---

## 📚 Mais Ajuda

- **Guia rápido**: [QUICK_START.md](QUICK_START.md)
- **Guia detalhado**: [TMDB_SETUP.md](TMDB_SETUP.md)  
- **Solução completa**: [ERRO_401_SOLUCAO.txt](ERRO_401_SOLUCAO.txt)

---

## 💡 Dica

Depois de configurar, você verá um **alerta no app** se a API Key estiver inválida, então ficará mais fácil de identificar problemas!

**Boa sorte!** 🍿
