# HostelZim - Um sistema para controle de hostel

![Painel HostelZim](https://i.imgur.com/ECO1cc6.png)

## Descrição

HostelZim é um sistema web desenvolvido para o gerenciamento de hostels. Construído com React e Chakra UI, o sistema oferece uma interface moderna, responsiva e intuitiva para a administração do dia a dia de um hostel. Através de um painel central, os administradores conseguem acompanhar indicadores importantes, gerenciar quartos e clientes, além de visualizar dados como receita mensal e taxa de ocupação por meio de gráficos.

O projeto conta com navegação por menu lateral retrátil, suporte a tema claro/escuro e notificações (toasts) para dar feedback das ações realizadas.

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

### Dashboard
- Cards de indicadores: vendas mensais, taxa de ocupação e avaliação dos clientes
- Lista de usuários recentes com ação de verificar pagamento
- Gráfico de linha com a visão geral da receita mensal
- Lista de reservas pendentes com paginação
- Área de calendário (placeholder)

### Clientes
- Listagem de clientes em tabela
- Busca de clientes por nome
- Cadastro de novos clientes via modal (foto, nome, e-mail, telefone, quarto e CPF)
- Imagem de perfil padrão automática quando a foto falha ao carregar

### Quartos
- Listagem de quartos em tabela
- Busca de quartos por nome
- Cadastro de novos quartos via modal (nome, capacidade, clientes, vagas disponíveis e tipo)
- Tipos de quarto: Masculino, Feminino e Misto

### Geral
- Menu lateral retrátil (expandir/recolher)
- Alternância entre tema claro e escuro
- Notificações (toasts) de sucesso, erro, aviso e informação
- Cabeçalho com título dinâmico da página, ícones de mensagens/notificações e avatar

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (Header, Button)
├── pages/            # Páginas da aplicação (Dashboard, Clients, Rooms)
├── services/         # Serviços auxiliares (ToastService)
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
