# VR Benefícios — Teste Prático

Repositório criado para o teste prático da vaga de QA Sênior na VR Benefícios.

---

## Estrutura do Projeto

```
vr-test/
├── backend/
│   ├── mocks/                         # Respostas de API salvas para modo mock
│   ├── services/                      # Camada de serviços HTTP (HTTParty)
│   │   ├── base_service.rb            # Classe base com configurações HTTP compartilhadas
│   │   ├── endpoints.rb               # Constantes de endpoints centralizadas
│   │   └── vrpat_service.rb           # Serviço do endpoint VRPAT
│   ├── tests/
│   │   ├── features/                  # Arquivos de feature em Gherkin
│   │   ├── steps/                     # Definições de steps do Cucumber
│   │   └── support/                   # Hooks, parameter types e helpers
│   └── utils/
│       └── string_cleaner.rb          # Classe utilitária StringCleaner
├── frontend/
│   └── cypress/
│       ├── e2e/                       # Specs de teste
│       └── pages/                     # Classes do Page Object Model
│
├── .env                               # Variáveis de ambiente
├── cucumber.yml                       # Configuração de perfis do Cucumber
├── Gemfile                            # Dependências Ruby
├── TEST_PLAN.md                       # Plano de testes e rastreamento de bugs
├── BUG_REPORT.md                      # Report de bug encontrado durante testes
└── BUG_REPORT_TEMPLATE.md             # Template para registro de bugs
```

---

## Stack Tecnológica

| Camada    | Tecnologia                    |
|-----------|-------------------------------|
| Backend   | Ruby + Cucumber + HTTParty    |
| Frontend  | JavaScript + Cypress          |

---

## Pré-requisitos

### Backend
- Ruby 3.2+
- Bundler

### Frontend
- Node.js 20+
- npm

---

## Instalação

### Backend

```bash
bundle install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Variáveis de Ambiente

O arquivo `.env` controla o ambiente de execução do backend:

```env
BASE_URL=https://portal.vr.com.br/api-web
API_ENV=MOCK   # Use MOCK para rodar offline ou PROD para chamar a API real
```

> Com `API_ENV=MOCK`, o serviço lê o arquivo `backend/mocks/VRPAT_RESPONSE.json` em vez de fazer chamadas HTTP reais.

---

## Executando os Testes

### Backend — Todos os cenários

```bash
bundle exec cucumber
```

### Backend — Por tag

```bash
bundle exec cucumber --tags @part1   # Validação do endpoint VRPAT
bundle exec cucumber --tags @part2   # Testes unitários do StringCleaner
```

### Frontend — Headless (sem interface)

```bash
cd frontend
npx cypress run
```

### Frontend — Interativo (com interface)

```bash
cd frontend
npx cypress open
```

---

## Decisões Técnicas

### Backend

**BaseService com HTTParty**
Uma classe base foi criada para centralizar a configuração HTTP (headers, base URI). Qualquer novo serviço precisa apenas herdar de `BaseService`, evitando duplicação de código.

**Módulo Endpoints**
Todos os caminhos de endpoint são declarados em um único módulo para evitar strings hardcoded no código. Se um caminho mudar, apenas um arquivo precisa ser atualizado.

**ServiceTemplate (Struct)**
Um `Struct` foi utilizado para normalizar o formato de resposta do serviço entre os ambientes mock e produção. Os steps nunca sabem em qual ambiente estão rodando — sempre recebem `{ status:, body: }`.

**Suporte a mock via API_ENV**
Alternando `API_ENV=MOCK`, o serviço lê um arquivo JSON salvo em vez de fazer chamadas HTTP reais. 

**ParameterType para markers**
Um `ParameterType` customizado do Cucumber foi criado para converter a representação em string de um array (`['#', '!']`) em um Array Ruby antes de chegar na definição do step.

**Partição de Equivalência no StringCleaner**
EP foi aplicado para identificar classes de comportamento distintas do método `StringCleaner`: entradas válidas (marcador no meio, múltiplos marcadores no array, múltiplos marcadores na string) e entradas inválidas (string vazia, array de marcadores vazio).

### Frontend

**Page Object Model**
Cada página é representada por uma classe que encapsula seletores e ações. Isso separa a lógica de teste da estrutura da UI — se a UI mudar, apenas o Page Object precisa ser atualizado.

**Seletores baseados em ID**
Seletores são ancorados em atributos `id` sempre que disponíveis (`#produto-auto-valor`, `#remover-produto-28`, `#carrinho-seguir-para-a-compra`). IDs são mais estáveis do que classes CSS, que são geradas dinamicamente nesta aplicação.

**Intercept de API para validação cruzada**
`cy.intercept()` foi utilizado para capturar a resposta da API de precificação e validar que o total exibido no frontend corresponde ao valor calculado pelo backend.

**Valores aleatórios dentro da partição válida**
Quantidade e valor de crédito são gerados aleatoriamente dentro da partição de equivalência válida a cada execução, aumentando a cobertura sem multiplicar os casos de teste.

---

## Limitações Conhecidas

| ID     | Descrição                                                                                 | Severidade |
|--------|-------------------------------------------------------------------------------------------|------------|
| LIM-01 | Endpoint `/empresas/.../tipo` retorna 504, bloqueando o fluxo completo de checkout        | Alta       |
| LIM-02 | Valor acima de R$ 9.999,99 não pode ser testado automaticamente devido à máscara do input | Baixa      |

---

## Evidências

O Cypress salva screenshots automaticamente em caso de falha. Screenshots manuais também são tirados em pontos-chave de validação e salvos em `cypress/screenshots/`.

---

## Considerações Finais

O fluxo descrito no enunciado do teste diverge parcialmente do comportamento real da aplicação. O botão "Compre Online" está no rodapé da página principal, e ao acessá-lo o usuário é direcionado a um formulário comercial — não diretamente à loja. O checkout testado é acessado através desse formulário, e está disponível em `loja.vr.com.br`.

Apesar dessas divergências, todos os cenários possíveis dentro do fluxo acessível foram cobertos — caminho feliz, validações de campo, remoção de produto e validação cruzada com a API de precificação.

---

## Sugestões de Melhoria no Produto

**1. Chamar a API de precificação apenas na confirmação**
Atualmente a API `/precificacoes/consultas` é disparada a cada alteração nos campos de quantidade e valor, gerando múltiplas chamadas enquanto o usuário ainda está digitando. A sugestão é mover essa chamada para uma tela de confirmação separada, onde os dados já estão preenchidos e não podem mais ser alterados. Isso reduz a carga no backend e melhora a performance percebida pelo usuário.

**2. Destaque do botão "Compre Online"**
O botão está posicionado apenas no rodapé da página principal, sem visibilidade na navegação principal. Mover ou replicar o botão no header ou em um CTA mais visível na página aumentaria a taxa de conversão.

**3. Comportamento do formulário com múltiplos produtos**
A seleção de 2 ou mais produtos no formulário comercial não redireciona o usuário para nenhuma etapa — a submissão não produz feedback visual nem navegação. O usuário fica sem saber se a ação funcionou. Uma mensagem de confirmação ou redirecionamento resolveria o problema.
