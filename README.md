# 🎬 AppFilmes

> **🚨 VENDO ERRO 401?** → Leia [LEIA_ME_ERRO_401.md](LEIA_ME_ERRO_401.md) para resolver em 5 minutos!

Aplicativo React Native com Expo para visualizar e gerenciar seus filmes favoritos com integração à API do The Movie Database (TMDb).

## ✨ Funcionalidades

- ✅ **Busca de filmes em tempo real** - Integrado com TMDb API
- ✅ **Adicionar filmes à sua lista** - Com autocomplete ao digitar
- ✅ **Escolher filmes** - Sistema de swipe-like para aceitar/rejeitar
- ✅ **Gerenciar filmes** - Editar, excluir e organizar seus filmes
- ✅ **Plataformas de streaming** - Marque onde cada filme está disponível
- ✅ **Sorteio de filmes** - Deixe o app escolher o que assistir

## 🔑 Configuração da API do TMDb

**IMPORTANTE**: Para usar a busca de filmes, você precisa configurar sua chave de API do TMDb.

1. Siga as instruções detalhadas em [TMDB_SETUP.md](TMDB_SETUP.md)
2. Obtenha sua chave gratuita em https://www.themoviedb.org/settings/api
3. Configure no arquivo `src/config/tmdb.js`

```javascript
export const TMDB_CONFIG = {
  API_KEY: 'sua_chave_aqui', // ⬅️ Cole sua chave aqui
  // ...
};
```

## 🚀 Como executar no celular

### Pré-requisitos
- Node.js instalado
- Aplicativo Expo Go no seu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Passos

1. **Inicie o projeto:**
   ```bash
   npm start
   ```

2. **Conecte seu celular:**
   - **Android**: Escaneie o QR Code que aparece no terminal com o app Expo Go
   - **iOS**: Escaneie o QR Code com a câmera nativa do iPhone

3. **Certifique-se de que:**
   - Seu computador e celular estejam na mesma rede Wi-Fi
   - O firewall não esteja bloqueando a conexão

## 📱 Comandos Úteis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Abre no emulador Android (se tiver configurado)
npm run ios        # Abre no simulador iOS (apenas no macOS)
npm run web        # Abre no navegador
```

## 📂 Estrutura do Projeto

```
src/
├── screens/          # Telas do aplicativo
│   ├── ChooseMoviesScreen.js    # Tela de escolha (aceitar/rejeitar)
│   ├── MoviesListScreen.js      # Lista e adição de filmes (com busca TMDb)
│   ├── ResultsScreen.js         # Resultado final e sorteio
│   └── HomeScreen.js            # Tela inicial
├── components/       # Componentes reutilizáveis
│   ├── MovieCard.js
│   └── BottomNav.js
├── services/         # Serviços e APIs
│   ├── movieService.js          # Integração com TMDb API
│   ├── moviesManager.js         # Gerenciamento local de filmes
│   └── storageManager.js
└── config/
    └── tmdb.js                   # Configuração da API do TMDb
```

## 🎯 Como Usar

1. **Configure a API do TMDb** (veja seção acima)
2. **Adicione filmes**:
   - Vá na aba "Lista"
   - Toque no botão "+"
   - Digite o nome do filme e veja as sugestões aparecerem
   - Selecione o filme desejado (preenche automaticamente)
   - Adicione plataformas e salve
3. **Escolha seus filmes**:
   - Vá na aba "Escolher"
   - Aceite (✓) ou rejeite (✗) cada filme
4. **Veja os resultados**:
   - Aba "Resultado" mostra seus filmes escolhidos
   - Use o botão "Sortear" para deixar o app decidir

## 📚 Documentação Adicional

- [TMDB_SETUP.md](TMDB_SETUP.md) - Instruções detalhadas de configuração da API
- [STORAGE_GUIDE.md](STORAGE_GUIDE.md) - Informações sobre armazenamento local

## 🎯 Roadmap

- [x] Integrar com API de filmes (TMDB)
- [x] Implementar busca de filmes em tempo real
- [x] Sistema de escolha de filmes
- [x] Sistema de favoritos
- [ ] Adicionar mais detalhes dos filmes (trailers, elenco)
- [ ] Filtros por gênero e plataforma
- [ ] Compartilhamento de listas
