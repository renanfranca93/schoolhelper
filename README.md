# School Helper 📚

App mobile feito com **React Native + Expo** para ajudar a gerenciar **escolas** e **turmas**, usando:

- UI com **gluestack-ui**
- Navegação com **React Navigation**
- **Mock API** com **MSW** (Mock Service Worker) rodando dentro do app
- Organização por **features** (schools / classes)
- Contexto global para dados compartilhados

---

## Funcionalidades

### Aba **Escolas**

- Listagem em cards (1, 2 ou 3 colunas conforme largura da tela)
- Cada card mostra:
  - Nome da escola
  - **Endereço**
  - **Número de turmas** vinculadas
- Cadastrar, editar e excluir escola
- Ao excluir uma escola, suas turmas também são removidas

### Aba **Turmas**

- Listagem em cards com:
  - Nome da turma
  - Escola vinculada
  - **Turno** (Manhã / Tarde / Noite)
  - **Ano letivo** (2025, 2026, 2027, 2028)
- Cadastrar, editar e excluir turma
- No cadastro/edição de turma:
  - Seleciona a **escola** em um select (lista de escolas)
  - Seleciona **turno** em um select
  - Seleciona **ano letivo** em um select
- Ao criar/excluir turma, o número de turmas exibido na tela de escolas atualiza automaticamente

---

## Stack

- Expo
- React Native
- TypeScript
- @gluestack-ui/themed
- React Navigation
- MSW (Mock Service Worker)
- @react-native-picker/picker
- @expo/vector-icons
- expo-linear-gradient

---

## Pré-requisitos

- Node.js (>= 18)
- npm ou yarn
- Expo CLI (opcional):

```bash
npm install --global expo-cli
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/renanfranca93/schoolhelper.git
cd schoolhelper
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn
```

### 3. Instale as libs específicas do Expo

```bash
npx expo install @expo/vector-icons expo-linear-gradient
npx expo install @react-native-picker/picker
```

### 4. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
BASE_URL=https://suaapi.com
```

> O valor não precisa existir — o MSW intercepta todas as requisições para `${BASE_URL}/schools` e `${BASE_URL}/classes`.

---

## Mock API (MSW)

O projeto usa **MSW em React Native**, rodando dentro do app.

- Handlers em: `mocks/handlers.ts`
- Simula:
  - GET /schools
  - POST /schools
  - GET /classes
  - POST /classes
- Dados mockados:
  - 6 escolas
  - 15 turmas
  - Cada turma pertence a apenas uma escola
  - Cada escola possui `classIds` com os IDs das turmas

Não é necessário backend — tudo é mockado automaticamente.

---

## Executando o app

```bash
npx expo start
```

Escolha onde rodar:

- Emulador Android
- Simulador iOS
- Dispositivo físico com **Expo Go**

---

## Estrutura de pastas

```txt
src/
  context/
    AppDataContext.tsx
  features/
    schools/
      SchoolsScreen.tsx
    classes/
      ClassesScreen.tsx
  components/
    ScreenHeader.tsx
    FloatingActionButton.tsx
  hooks/
    useResponsiveColumns.ts
  mocks/
    handlers.ts
  types/
    domain.ts
  usecases/
    createSchool.ts
    createClass.ts
    loadSchools.ts
    loadClasses.ts
```

---

## Padrões usados

### Context + UseCases

- `AppDataContext` centraliza o estado.
- Usecases encapsulam chamadas de API.
- Telas chamam funções do contexto, sem lidar com `fetch`.

### Layout Responsivo

Hook:

```ts
useResponsiveColumns()
```

- 1 coluna → celular
- 2 colunas → tablet
- 3 colunas → telas grandes

### UI Reutilizável

#### ScreenHeader

- Badge “school helper”
- Gradiente verde
- Título à direita

#### FloatingActionButton

- Botão flutuante ＋
- Abre formulário deslizante

---

## Scripts úteis

```bash
npm start
npm run android
npm run ios
npm run web
```

---

## Observações

- Dados são mockados e reiniciam a cada execução.
- Em produção, substitua os usecases para chamar sua API real.
