# 🚀 Início Rápido - Integração TMDb

## ⚡ 3 Passos para começar a usar

### 1️⃣ Obter API Key (5 minutos)

1. Vá para https://www.themoviedb.org/signup
2. Crie sua conta (gratuita)
3. Acesse https://www.themoviedb.org/settings/api
4. Clique em "Solicitar chave de API" → "Developer"
5. Preencha:
   - Nome: `Meu App de Filmes`
   - URL: `http://localhost`
   - Resumo: `App pessoal para gerenciar filmes`
6. **Copie a "API Key (v3 auth)"** que aparecerá

### 2️⃣ Configurar no projeto (1 minuto)

Abra `src/config/tmdb.js` e cole sua chave:

```javascript
export const TMDB_CONFIG = {
  API_KEY: 'cole_sua_chave_aqui', // ⬅️ Aqui!
  BASE_URL: 'https://api.themoviedb.org/3',
  // ... resto do código
};
```

Salve o arquivo e pronto! 🎉

### 3️⃣ Testar (1 minuto)

1. Inicie o app: `npm start`
2. Na aba **"Lista"**, toque no botão **+**
3. Digite no campo "Título": `matrix`
4. Aguarde 1-2 segundos
5. Veja os resultados aparecerem! ✨

---

## 📱 Como usar no dia a dia

### Adicionar um filme

```
1. Aba "Lista" → Botão "+"
2. Digite o nome do filme (ex: "Interestelar")
3. Toque no resultado desejado
4. ✅ Título, ano e descrição preenchidos automaticamente!
5. Adicione as plataformas onde está disponível
6. Toque em "Adicionar"
```

### Escolher filmes

```
1. Aba "Escolher"
2. ✓ = Aceitar o filme
3. ✗ = Rejeitar o filme
4. Repita até avaliar todos
```

### Ver resultado

```
1. Aba "Resultado"
2. Veja seus filmes escolhidos
3. Use "Sortear" para deixar o app decidir
```

---

## ❓ FAQ Rápido

**Q: Não aparecem resultados ao buscar**  
A: Verifique se colocou a API Key corretamente em `src/config/tmdb.js`

**Q: Demora muito para aparecer**  
A: Normal! A busca aguarda você parar de digitar (500ms de debounce)

**Q: Posso usar sem internet?**  
A: A busca precisa de internet, mas seus filmes salvos funcionam offline

**Q: É de graça?**  
A: Sim! 100% gratuito. Limite: 1 milhão de buscas/mês (mais que suficiente)

**Q: Posso adicionar filme manualmente?**  
A: Sim! Se não encontrar na busca, digite tudo manualmente e salve

**Q: Funciona em português?**  
A: Sim! A API retorna títulos e descrições em português (quando disponível)

---

## 🎨 Personalização

Quer mudar algo? Arquivos principais:

- **Busca/Autocomplete**: `src/screens/MoviesListScreen.js` (linha ~48)
- **Serviço da API**: `src/services/movieService.js`
- **Configuração**: `src/config/tmdb.js`
- **Estilos da busca**: `src/screens/MoviesListScreen.js` (linha ~685)

---

## 🆘 Precisa de ajuda?

1. Veja exemplos em: `TMDB_API_EXAMPLES.js`
2. Documentação completa: `TMDB_SETUP.md`
3. Teste sua API Key em: https://api.themoviedb.org/3/search/movie?api_key=SUA_CHAVE&query=matrix

---

## ✅ Checklist de configuração

- [ ] Criei conta no TMDb
- [ ] Obtive minha API Key
- [ ] Colei a chave em `src/config/tmdb.js`
- [ ] Salvei o arquivo
- [ ] Testei buscar um filme
- [ ] Funcionou! 🎉

---

**Pronto! Agora você pode buscar e adicionar filmes facilmente! 🍿**
