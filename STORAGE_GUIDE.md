# 💾 Guia de Armazenamento: Local vs Nuvem

## 📱 Armazenamento LOCAL (no celular)

### AsyncStorage
- **O que é**: Banco de dados simples tipo chave-valor
- **Quando usar**: 
  - Preferências do usuário (tema, idioma)
  - Cache de dados
  - Listas de favoritos locais
  - Histórico de navegação
- **Vantagens**: 
  - ✅ Funciona offline
  - ✅ Rápido
  - ✅ Não precisa internet
- **Desvantagens**: 
  - ❌ Dados só no dispositivo
  - ❌ Perde tudo se desinstalar app
- **Limite**: ~6MB (Android) / ~10MB (iOS)

### SecureStore  
- **O que é**: Armazenamento criptografado
- **Quando usar**:
  - Tokens de autenticação
  - Senhas
  - Dados sensíveis (CPF, etc)
- **Vantagens**:
  - ✅ Criptografado
  - ✅ Seguro
- **Limite**: ~2KB por item

---

## ☁️ Armazenamento na NUVEM

### Opções populares:

#### 1. **Firebase** (Google)
```bash
npx expo install firebase
```
- **Prós**: Fácil, grátis até certo ponto, tempo real
- **Contras**: Dependência do Google
- **Ideal para**: Apps pequenos/médios, MVPs

#### 2. **Supabase** (PostgreSQL)
```bash
npx expo install @supabase/supabase-js
```
- **Prós**: Open source, SQL completo, grátis generoso
- **Contras**: Mais complexo que Firebase
- **Ideal para**: Apps que precisam de banco relacional

#### 3. **Sua própria API**
- **Prós**: Controle total, sem vendor lock-in
- **Contras**: Mais trabalho para configurar
- **Ideal para**: Apps profissionais, requisitos específicos

---

## 🔄 Estratégia HÍBRIDA (Recomendado!)

### Como funciona:
1. **Salvar sempre localmente primeiro** → resposta rápida
2. **Sincronizar com nuvem em background** → backup automático
3. **Ao abrir app**: buscar da nuvem e atualizar local

### Benefícios:
- ✅ App funciona offline
- ✅ Dados não se perdem
- ✅ Sincroniza entre dispositivos
- ✅ Usuário não percebe a latência

### Exemplo de fluxo:

```
Usuário adiciona filme aos favoritos
        ↓
    Salva no AsyncStorage (instantâneo)
        ↓
    App responde "✅ Adicionado!"
        ↓
    Em background: sincroniza com nuvem
        ↓
    Se der erro: tenta novamente depois
```

---

## 📊 Quando usar cada um?

| Tipo de Dado | Local | Nuvem | Híbrido |
|--------------|-------|-------|---------|
| Tema escuro/claro | ✅ | ❌ | ❌ |
| Favoritos | ❌ | ❌ | ✅ |
| Token de login | ✅ (SecureStore) | ❌ | ❌ |
| Histórico de busca | ✅ | ❌ | ❌ |
| Perfil do usuário | ❌ | ✅ | ✅ |
| Listas compartilhadas | ❌ | ✅ | ✅ |
| Cache de imagens | ✅ | ❌ | ❌ |

---

## 🚀 Implementação rápida

### 1. Dados apenas locais (mais simples):
```javascript
import { LocalStorage } from './services/localStorage';

// Salvar
await LocalStorage.saveFavorites([movie1, movie2]);

// Buscar
const favorites = await LocalStorage.getFavorites();
```

### 2. Com sincronização na nuvem:
```javascript
import { StorageManager } from './services/storageManager';

// Adicionar favorito (salva local + nuvem)
await StorageManager.addFavorite(movie, token);

// Buscar (tenta nuvem, fallback para local)
const favorites = await StorageManager.getFavorites(token);
```

---

## 💡 Dicas importantes

1. **Sempre trate erros**: Internet pode falhar
2. **Use loading states**: Usuário precisa ver que está carregando
3. **Implemente retry logic**: Tente novamente se falhar
4. **Não bloqueie a UI**: Sincronize em background
5. **Mostre status de sync**: "Sincronizado" vs "Aguardando conexão"

---

## 🔐 Segurança

### ❌ NUNCA salve no AsyncStorage:
- Senhas em texto plano
- Cartões de crédito
- Dados muito sensíveis

### ✅ SEMPRE use SecureStore para:
- Tokens de autenticação
- Chaves de API
- Credenciais temporárias

### ✅ SEMPRE envie para nuvem com:
- HTTPS (nunca HTTP)
- Tokens de autenticação
- Criptografia end-to-end (dados muito sensíveis)

---

## 📦 Estrutura dos arquivos criados:

```
src/services/
├── localStorage.js      # AsyncStorage + SecureStore
├── cloudStorage.js      # API REST / Firebase
└── storageManager.js    # Híbrido (combina os dois)

src/screens/
└── FavoritesExample.js  # Exemplo prático funcionando
```

Teste o app agora! O exemplo mostra tudo funcionando 🚀
