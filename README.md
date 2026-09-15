# Hostely - Plataforma de gerenciamento de hostels

![Landing Page Hostely](https://i.imgur.com/z16U28k.png)

![Login Hostely](https://i.imgur.com/6yPDf4o.png)

![Configurações Hostely](https://i.imgur.com/F0uJI2o.png)

![Painel Hostely](https://i.imgur.com/Pys8Utq.png)

## Descrição

Hostely é uma plataforma web para gestão de hostels, pensada para atender de uma única unidade a redes com vários hostels. Construída com React e Chakra UI, oferece uma interface moderna, responsiva e intuitiva para a administração do dia a dia. Através de um painel central, os administradores acompanham indicadores, gerenciam quartos e hóspedes, cadastram dados do hostel, armários e aluguéis de itens.

O projeto conta com landing page, login com "manter conectado", auto-cadastro de hóspedes por link, menu lateral retrátil, internacionalização (português/inglês), tema claro/escuro e toasts de feedback. **Não há pagamento pelo sistema** — o foco é cadastrar e monitorar clientes; cobranças ficam na maquininha do hostel.

> **Observação:** os dados são simulados via `localStorage` (sem back-end/API). Login e auto-cadastro por link são mockados para demonstração.

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
- Rotas administrativas protegidas por autenticação
- Credenciais de demonstração: `admin@hostely.com` / `hostel123`

### Dashboard
- Cards de indicadores: vendas mensais, taxa de ocupação e avaliação dos clientes
- Lista de usuários recentes
- Gráfico de linha com a visão geral da receita mensal
- Lista de reservas pendentes com paginação
- Área de calendário (placeholder)

### Hostel
- Cadastro e edição dos dados da unidade (nome, contato, endereço, descrição)
- Regras do hostel editáveis
- Armários opcionais: adicionar, remover e associar a um hóspede hospedado
- Nome do hostel exibido no menu lateral (atualiza ao salvar)

### Clientes
- Listagem em tabela, ordenada por cadastro mais recente, com paginação
- Colunas de país e data de cadastro; foto ao lado do nome
- Detalhes ao clicar (idioma, origem do cadastro e armário, se houver)
- Cadastro no balcão via modal (foto, dados pessoais, quarto, armário opcional, CPF/ID, país e idioma)
- Auto-cadastro por link enviado ao hóspede
- Origem: "Atendimento (balcão)" ou "Auto-cadastro (link)"

### Quartos
- Listagem e busca de quartos
- Cadastro via modal (nome, capacidade, clientes, vagas e tipo)
- Tipos: Masculino, Feminino e Misto

### Aluguéis
- Registro de itens alugados: toalha, adaptador, cadeado, bicicleta, canga e prancha
- Associação ao hóspede e valor de cada aluguel
- Listagem com busca e remoção

### Geral
- Menu lateral retrátil com hostel selecionado em destaque
- Internacionalização: português (padrão) e inglês
- Tema claro/escuro (escuro como padrão)
- Toasts de sucesso, erro, aviso e informação
- Cabeçalho com título dinâmico, notificações e menu de perfil
- SEO básico: título/descrição por rota e meta tags Open Graph

## Estrutura do Projeto

```
src/
├── components/       # Header, Sidebar, BrandLogo, RequireAuth, DocumentTitle, etc.
├── contexts/         # Autenticação e idioma
├── data/             # Store em localStorage (clientes, quartos, hostel, armários, aluguéis)
├── i18n/             # Traduções pt/en
├── pages/            # Landing, Login, Dashboard, Hostel, Clients, Rooms, Rentals, SelfRegister
├── services/         # ToastService
├── theme.js          # Tema Chakra UI
├── App.js            # Layout e rotas
└── index.js          # Entrada da aplicação
```

## Como Executar o Projeto

Pré-requisitos: [Node.js](https://nodejs.org/) instalado.

1. Clone o repositório:
   ```bash
   git clone https://github.com/ramou1/hostel-system.git
   cd hostel-system
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie em modo de desenvolvimento:
   ```bash
   npm start
   ```

   A aplicação estará em [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

- `npm start` — modo de desenvolvimento
- `npm run build` — build de produção na pasta `build`
- `npm test` — testes
- `npm run eject` — expõe as configs do CRA (irreversível)
