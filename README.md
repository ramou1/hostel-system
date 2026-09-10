# Hostely - Plataforma de gerenciamento de hostels

![Landing Page Hostely](https://i.imgur.com/W1qYWWW.png)

![Login Hostely](https://i.imgur.com/vHuZBFo.png)

![Painel Hostely](https://i.imgur.com/HILlcyL.png)

![Configurações Hostely](https://i.imgur.com/jo08kSD.png)

## Descrição

Hostely é uma plataforma web para gestão de hostels, pensada para atender de uma única unidade a redes com vários hostels. Construída com React e Chakra UI, oferece uma interface moderna, responsiva e intuitiva para a administração do dia a dia. Através de um painel central, os administradores acompanham indicadores importantes, gerenciam quartos e hóspedes, e visualizam dados como receita mensal e taxa de ocupação por meio de gráficos.

O projeto conta com uma landing page de apresentação, login com "manter conectado", auto-cadastro de hóspedes por link, navegação por menu lateral retrátil, internacionalização (português/inglês), suporte a tema claro/escuro e notificações (toasts) para dar feedback das ações realizadas.

> **Observação:** atualmente os dados exibidos são mockados (definidos diretamente no código), servindo como base para a interface. Não há integração com back-end/API neste momento.

## Tecnologias Utilizadas

- **React 18** — biblioteca principal para construção da interface
- **Chakra UI** — biblioteca de componentes e estilização
- **Emotion** — CSS-in-JS utilizado pelo Chakra UI
- **Framer Motion** — animações e transições
- **Chart.js** + **react-chartjs-2** — gráficos (ex.: visão geral de receita)
- **React Router DOM** — roteamento entre as páginas
- **React Icons** — biblioteca de ícones
- **Create React App (react-scripts)** — configuração e build da aplicação

## Funcionalidades

### Landing page & acesso
- Página inicial (landing) apresentando a plataforma, recursos e planos
- Cabeçalho transparente com efeito de blur ao rolar a página
- Login com credenciais mockadas e opção "manter conectado"
- Rotas administrativas protegidas por autenticação (redirecionam para o login)
- Credenciais de demonstração: `admin@hostely.com` / `hostel123`

### Dashboard
- Cards de indicadores: vendas mensais, taxa de ocupação e avaliação dos clientes
- Lista de usuários recentes com ação de verificar pagamento
- Gráfico de linha com a visão geral da receita mensal
- Lista de reservas pendentes com paginação
- Área de calendário (placeholder)

### Clientes
- Listagem de clientes em tabela, ordenada por cadastro mais recente, com paginação
- Colunas de país e data de cadastro; foto ao lado do nome
- Detalhes do cliente ao clicar (inclui idioma e origem do cadastro)
- Cadastro no balcão via modal (foto por upload/câmera, nome, e-mail, telefone, quarto, CPF opcional, documento/ID, país e idioma principal)
- Auto-cadastro por link: geração de link que abre uma tela pública de cadastro do próprio hóspede
- Origem do cadastro identificada como "Atendimento (balcão)" ou "Auto-cadastro (link)"
- Imagem de perfil padrão automática quando a foto falha ao carregar

### Quartos
- Listagem de quartos em tabela
- Busca de quartos por nome
- Cadastro de novos quartos via modal (nome, capacidade, clientes, vagas disponíveis e tipo)
- Tipos de quarto: Masculino, Feminino e Misto

### Geral
- Menu lateral retrátil (expandir/recolher) com o hostel selecionado em destaque
- Internacionalização: português (padrão) e inglês
- Alternância entre tema claro e escuro (escuro como padrão)
- Notificações (toasts) de sucesso, erro, aviso e informação
- Cabeçalho com título dinâmico da página, ícones de mensagens/notificações e menu de perfil (configurações e sair)

> **Observação:** por enquanto os dados são simulados via `localStorage` (sem back-end/API). O login e o auto-cadastro por link são mockados para demonstração.

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (Header, Sidebar, RequireAuth, etc.)
├── contexts/         # Contextos de React (autenticação, idioma)
├── data/             # Camada de dados simulada em localStorage (store)
├── i18n/             # Dicionário de traduções (pt/en)
├── pages/            # Páginas (Landing, Login, Dashboard, Clients, Rooms, SelfRegister)
├── services/         # Serviços auxiliares (ToastService)
├── theme.js          # Tema do Chakra UI (marca, modo escuro padrão)
├── App.js            # Layout principal, menu lateral e rotas
└── index.js          # Ponto de entrada da aplicação
```

## Como Executar o Projeto

Pré-requisitos: [Node.js](https://nodejs.org/) instalado.

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/hostel-system.git
   cd hostel-system
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm start
   ```

   A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

- `npm start` — executa a aplicação em modo de desenvolvimento
- `npm run build` — gera a versão de produção na pasta `build`
- `npm test` — executa os testes
- `npm run eject` — expõe as configurações do Create React App (irreversível)
