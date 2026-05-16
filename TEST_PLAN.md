# Plano de Testes — VR Benefícios

## 1. Escopo

Testes automatizados e manuais realizados como parte do teste prático para a vaga de QA Sênior na VR Benefícios.

O objetivo é validar o fluxo de adição de produto ao carrinho na loja virtual, além de validar o contrato do endpoint VRPAT e o comportamento da classe utilitária `StringCleaner`.

---

## 2. Tipos de Teste Aplicados

| Tipo | Onde foi aplicado |
|---|---|
| Teste de API | Validação do endpoint VRPAT (status code, contrato JSON) |
| Teste Unitário | Validação da classe `StringCleaner` |
| Teste E2E (automatizado) | Fluxo de adição do produto Auto ao carrinho |
| Teste Exploratório (manual) | Navegação completa pelo fluxo da loja, formulário e checkout |
| Teste de Validação de Campos | Campos de quantidade e valor do produto Auto |

---

## 3. Técnicas de Teste Utilizadas

### Partição de Equivalência (EP)

Aplicada no `StringCleaner` e nos campos do carrinho para identificar classes de comportamento distintas sem precisar testar todos os valores possíveis.

**StringCleaner — classes identificadas:**

| Classe | Tipo | Exemplo |
|---|---|---|
| Marcador único no meio da string | Válida | `"bananas # tomates"` com `['#']` |
| Múltiplos marcadores no array, um na string | Válida | `"texto % fim"` com `['%', '!']` |
| Múltiplos marcadores no array e na string | Válida | `"fox & jumped * dog"` com `['&', '*']` |
| String vazia | Inválida | `""` com `['#']` |
| Array de marcadores vazio | Inválida | `"texto"` com `[]` |

**Campos do carrinho — classes identificadas:**

| Campo | Classe válida | Classe inválida |
|---|---|---|
| Quantidade | 1 a 999 | 0, acima de 999 |
| Valor mensal | R$ 1,00 a R$ 9.999,99 | Abaixo de R$ 1,00, acima de R$ 9.999,99 |

### Tabela de Decisão

Aplicada para mapear combinações de condições nos cenários do carrinho:

| Cenário | Qtd válida | Valor válido | Botão habilitado |
|---|---|---|---|
| Caminho feliz | ✅ | ✅ | ✅ |
| Valor abaixo do mínimo | ✅ | ❌ | ❌ |
| Valor acima do máximo | ✅ | ❌ | ❌ |
| Quantidade zero | ❌ | ✅ | ❌ |

### Teste Exploratório

Aplicado manualmente para mapear o fluxo real da aplicação, que difere parcialmente do enunciado do teste. As descobertas estão descritas na seção 5.

---

## 4. Casos de Teste Automatizados

### Backend — Parte 1: Endpoint VRPAT

| ID | Cenário | Tipo | Tag | Status |
|---|---|---|---|---|
| AT01 | Validar que o JSON retornado possui a chave `typeOfEstablishment` | API | `@part1` | ✅ |
| AT02 | Imprimir aleatoriamente um tipo de estabelecimento | API | `@part1` | ✅ |

### Backend — Parte 2: StringCleaner

| ID | Cenário | Tipo | Tag | Status |
|---|---|---|---|---|
| AT03 | Marcador único no meio da string | Unitário | `@scope` | ✅ |
| AT04 | Múltiplos marcadores no array, um presente na string | Unitário | `@scope` | ✅ |
| AT05 | Múltiplos marcadores no array e na string | Unitário | `@scope` | ✅ |
| AT06 | String vazia — guard clause | Unitário | `@extra-scope` | ✅ |
| AT07 | Array de marcadores vazio — guard clause | Unitário | `@extra-scope` | ✅ |

### Frontend — Carrinho

| ID | Cenário | Tipo | Status |
|---|---|---|---|
| AT08 | Adicionar produto Auto com quantidade e valor aleatórios | E2E | ✅ |
| AT09 | Botão desabilitado quando valor mensal abaixo do mínimo | E2E | ✅ |
| AT10 | Botão desabilitado quando valor mensal acima do máximo | E2E | ⚠️ |
| AT11 | Botão desabilitado quando quantidade é zero | E2E | ✅ |
| AT12 | Remover produto Auto do carrinho | E2E | ✅ |

> *AT10 skipped: a máscara do campo impede digitação de mais de 4 dígitos, impossibilitando a automação desse cenário. Validado manualmente.

---

## 5. Testes Manuais — Descobertas do Teste Exploratório

Durante a exploração manual do fluxo descrito no enunciado, foram identificados os seguintes comportamentos:

### 5.1 Botão "Compre Online" está no rodapé

O enunciado indica clicar no botão "Compre online" na home (`www.vr.com.br`). Na prática, o botão está localizado no **rodapé da página**, não em destaque no conteúdo principal. Isso pode causar confusão para o usuário que não rolar a página até o fim.

### 5.2 Fluxo diverge do enunciado

Ao clicar em "Compre Online", o usuário não é direcionado diretamente à loja, impossibilitando a seleção de um "Cartão VR".
Na realidade ele é direcionado para um formulário comercial, onde foi encontrado um bug (sessão 6)

### 5.3 API de precificação chamada a cada mudança de estado

Durante os testes, foi observado que a API `/precificacoes/consultas` é chamada a cada alteração nos campos de quantidade ou valor — ou seja, múltiplas chamadas são feitas enquanto o usuário ainda está digitando. Isso gera carga desnecessária no backend e pode impactar a performance da página.

### 5.4 Erro 504 ao avançar no checkout

Ao tentar avançar para a etapa final do checkout, o endpoint `/empresas/.../tipo` retorna erro **504 Gateway Timeout**, impedindo a conclusão do fluxo. Erro ocorreu pois estava utilizando dados fakes.

---

## 6. Bugs Encontrados

| ID | Descrição | Severidade | Tipo | Status |
|---|---|---|---|---|
| BUG-01 | Usuário nao consegue submeter formulário em com um unico item em https://www.vr.com.br/contrate-agora | Alta | Funcional | Aberto |


---

## 7. Casos de Teste Manuais

| ID | Cenário | Pré-condição | Passos | Resultado Esperado | Status |
|---|---|---|---|---|---|
| TC01 | Selecionar 1 produto e avançar no formulário | Estar na home `www.vr.com.br` | 1. Clicar em Compre Online 2. Selecionar 1 produto 3. Clicar em avançar | Usuário é direcionado ao checkout | ❌ BUG-01 |
| TC02 | Selecionar 2 produtos e submeter o formulário | Estar na home `www.vr.com.br` | 1. Selecionar 2 produtos 2. Clicar em avançar | Usuário é redirecionado para o próximo passo | ✅  |
| TC03 | Adicionar produto Auto com valores válidos | Estar no checkout | 1. Clicar em adicionar 2. Inserir quantidade 3. Inserir valor | Botão habilitado, resumo atualizado | ✅ |
| TC04 | Inserir valor abaixo do mínimo | Estar no checkout | 1. Inserir valor R$ 0,11 | Campo vermelho, botão desabilitado | ✅ |
| TC05 | Inserir quantidade zero | Estar no checkout | 1. Digitar 0 no campo quantidade | Campo vermelho, botão desabilitado | ✅ |
| TC06 | Avançar para etapa final do checkout | Estar no checkout com produto válido | 1. Clicar em Seguir com a contratação | Usuário avança para próxima etapa | ⚠️ Não foi possível execução |


---

## 8. Cobertura de Testes

| Área | Automatizado | Manual | Cobertura |
|---|---|---|---|
| Endpoint VRPAT | ✅ | — | Total |
| StringCleaner | ✅ | — | Total |
| Carrinho — caminho feliz | ✅ | ✅ | Total |
| Carrinho — campos inválidos | ✅ | ✅ | Total |
| Formulário comercial | ❌ | ✅ | Parcial (BUG-01) |
| Checkout — etapa final | ❌ | ⚠️ | Bloqueado |

