# Configuração da API do TMDb (The Movie Database)

Este projeto está integrado com a API do The Movie Database para permitir a busca de filmes em tempo real.

## Como obter sua chave de API

### Passo 1: Criar uma conta no TMDb
1. Acesse https://www.themoviedb.org/
2. Clique em "Cadastrar" e crie sua conta
3. Confirme seu e-mail

### Passo 2: Solicitar uma chave de API
1. Após fazer login, acesse: https://www.themoviedb.org/settings/api
2. Clique em "Solicitar chave de API" (Request an API Key)
3. Escolha "Developer" (para uso não comercial)
4. Aceite os termos de uso
5. Preencha o formulário:
   - **Application Name**: Nome do seu app (ex: "Meu App de Filmes")
   - **Application URL**: Pode usar `http://localhost` se for uso pessoal
   - **Application Summary**: Breve descrição (ex: "App pessoal para gerenciar filmes")

### Passo 3: Copiar sua chave de API
1. Após o envio, você receberá imediatamente sua API Key (v3 auth)
2. Copie a chave que aparece em "API Key (v3 auth)"

## Como configurar no projeto

### Opção 1: Editar o arquivo de configuração
1. Abra o arquivo `src/config/tmdb.js`
2. Substitua `'SUA_API_KEY_AQUI'` pela sua chave de API
3. Salve o arquivo

```javascript
export const TMDB_CONFIG = {
  API_KEY: 'sua_chave_api_aqui', // Cole sua chave aqui
  BASE_URL: 'https://api.themoviedb.org/3',
  // ...
};
```

## Funcionalidades da integração

### Busca de filmes em tempo real
- Ao adicionar um novo filme, digite o nome no campo "Título"
- Após 2 caracteres, a busca é ativada automaticamente
- Os resultados aparecem em tempo real enquanto você digita
- Toque em um resultado para preencher automaticamente:
  - Título
  - Ano de lançamento
  - Descrição/sinopse
  - Gênero (primeiro gênero do filme)

### Informações disponíveis
- Título original e traduzido (PT-BR)
- Pôster do filme
- Ano de lançamento
- Sinopse em português
- Avaliação (nota IMDb)
- Gêneros

## Limites da API
- **Gratuita**: 1.000.000 de requisições por mês
- **Rate limiting**: Até 50 requisições por segundo
- Para uso pessoal, esses limites são mais que suficientes

## Documentação oficial
- Guia inicial: https://developer.themoviedb.org/docs/getting-started
- Referência da API: https://developer.themoviedb.org/reference
- Busca de filmes: https://developer.themoviedb.org/docs/search-and-query-for-details

## Resolução de problemas

### "Nenhum filme encontrado" sempre
- Verifique se colocou a API Key corretamente
- Certifique-se de que não há espaços extras na chave
- Teste sua chave em: https://api.themoviedb.org/3/search/movie?api_key=SUA_CHAVE&query=matrix

### Erro de rede
- Verifique sua conexão com a internet
- Certifique-se de que o emulador/dispositivo tem acesso à rede
- No Android, pode ser necessário adicionar permissões de internet (já configurado)

### API Key inválida
- Verifique se aceitou os termos de uso
- Aguarde alguns minutos após criar a chave
- Gere uma nova chave se necessário

## Dicas de uso

1. **Digite pelo menos 2 caracteres** para ativar a busca
2. **Aguarde alguns segundos** após digitar para os resultados aparecerem
3. **Use palavras-chave em português ou inglês** - a API busca em ambos
4. **Toque no resultado desejado** para preencher automaticamente os campos
5. **Você ainda pode editar** as informações após selecionar um filme

## Privacidade
- A API Key é armazenada apenas localmente no código
- Nenhuma informação pessoal é enviada ao TMDb
- As buscas são anônimas

---

**Importante**: Mantenha sua API Key privada e não compartilhe publicamente quando publicar o código do app!
