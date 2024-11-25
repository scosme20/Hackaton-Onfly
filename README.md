Hackaton API
Este projeto foi desenvolvido como uma solução para um desafio da Onfly, com o objetivo de criar um filtro eficiente para categorias de acomodações. A API permite gerenciar acomodações e oferece funcionalidades como listagem, busca por categorias e localização. Utilizamos NestJS, Prisma ORM e MySQL como banco de dados, com o Aiven como plataforma de hospedagem. Docker foi implementado para garantir um ambiente consistente tanto no desenvolvimento quanto na produção.

Desafio: Filtro por Categorias de Acomodações
A Onfly enfrentava dificuldades para implementar um filtro eficiente para categorias de acomodações, dificultando a busca por opções específicas, como hotéis, hostels, apartamentos, entre outros. A solução desenvolvida implementa:

Validação de Categorias: Definição de categorias válidas no código, como HOTEL, APARTMENT, HOSTEL, etc., evitando buscas incorretas.
Busca Personalizada: Utilização do Prisma ORM para consultar o banco de dados, retornando acomodações que correspondem à categoria solicitada.
Formatação dos Dados: Conversão dos resultados do banco de dados em um formato estruturado, incluindo cálculo de avaliações médias e benefícios listados.
Essa abordagem garante que os usuários possam filtrar acomodações com rapidez e precisão.

Tecnologias Utilizadas
NestJS: Framework Node.js para criação de APIs modulares e escaláveis.
Prisma ORM: Ferramenta poderosa para manipulação de banco de dados relacional.
MySQL: Banco de dados relacional utilizado para armazenar as acomodações.
Aiven: Plataforma de dados em nuvem para hospedagem do banco de dados.
Docker: Facilita o deploy e a replicação do ambiente de desenvolvimento.
Axios: Realiza integrações com APIs externas, como a geolocalização baseada em CEP.
Como Cada Tecnologia Foi Usada
NestJS: Estruturou a lógica de negócio em módulos, serviços e controladores, seguindo princípios como injeção de dependência.
Prisma ORM: Realizou consultas otimizadas no banco de dados para buscar acomodações e categorias.
MySQL: Armazenou os dados relacionados às acomodações, como tipo, localização, avaliações e benefícios.
Axios: Integrado à API do OpenCage para geocodificação baseada em CEP.
Docker: Gerou containers para a aplicação e o banco de dados, criando um ambiente padronizado para desenvolvimento e produção.
Lógica Implementada para o Filtro
Entrada do Usuário: A API recebe a categoria desejada como parâmetro.
Validação da Categoria: Verifica se a categoria informada pertence a uma lista pré-definida.
Consulta ao Banco de Dados: Utiliza o Prisma ORM para buscar acomodações que correspondem à categoria válida.
Formatação da Resposta: Cada acomodação é processada para incluir:
Avaliação média calculada com base nas reviews.
Benefícios convertidos de JSON para uma lista compreensível.
Dados de localização e descrição.
Resposta Final: A API retorna uma lista formatada das acomodações filtradas.
Exemplo de categorias suportadas:

HOTEL, HOSTEL, APARTMENT, RESORT, VILLA, CABIN, entre outros.
Configuração e Instalação
1. Clonando o Repositório
Clone o repositório para sua máquina local:

bash
Copiar código
git clone https://github.com/seu-usuario/hackaton.git
cd hackaton
2. Instalando Dependências
Instale as dependências do projeto utilizando o npm:

bash
Copiar código
npm install
3. Configuração do Docker
Certifique-se de que o Docker está instalado e execute:

bash
Copiar código
docker-compose up --build
Este comando irá construir a imagem do Docker e iniciar os containers para a API e o banco de dados MySQL.

4. Configuração do Arquivo .env
Crie um arquivo .env na raiz do projeto com as variáveis de ambiente necessárias:

env
Copiar código
# URL de conexão com o banco de dados MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=accommodations
MYSQL_USER=root
MYSQL_PASSWORD=senha

# URL de conexão com o banco de dados
DATABASE_URL="mysql://root:senha@localhost:3306/accommodations"

# Definir o ambiente de execução
NODE_ENV=development
Se você estiver utilizando o Aiven para hospedar o banco de dados, obtenha a URL de conexão através do painel do Aiven e substitua no arquivo .env.

Comandos Úteis
Rodar a aplicação: npm run start:dev
Executar migrações: npx prisma migrate dev
Abrir Prisma Studio: npx prisma studio
Rodar o Docker: docker-compose up --build
Configuração do Banco de Dados com Prisma
1. Migrando o Banco de Dados
Para configurar o banco de dados, rode as migrações do Prisma:

bash
Copiar código
npx prisma migrate dev
Isso criará as tabelas no banco de dados de acordo com o schema definido no prisma/schema.prisma.

2. Utilizando o Prisma Studio
Para rodar o Prisma Studio, use o seguinte comando:

bash
Copiar código
npx prisma studio
Isso abrirá o Prisma Studio no seu navegador, onde você pode visualizar e manipular os dados diretamente no banco de dados.

Executando a API
Agora que todos os containers estão rodando e o banco de dados foi configurado, você pode acessar a API na URL:

text
Copiar código
http://localhost:3000
A aplicação estará escutando na porta 3000 e pronta para receber requisições.

Dependências do Projeto
As principais dependências do projeto são:

@nestjs/core, @nestjs/common, @nestjs/platform-express: Bibliotecas principais do NestJS para construção da API.
@prisma/client: Cliente Prisma para interagir com o banco de dados.
dotenv: Carrega as variáveis de ambiente do arquivo .env.
axios: Biblioteca para realizar requisições HTTP.
rxjs: Biblioteca para programação reativa, usada no NestJS.
Dependências de Desenvolvimento
prisma: Ferramenta para migrações e geração do cliente Prisma.
eslint: Ferramenta para garantir a qualidade do código.
typescript: Compilador TypeScript.
Contribuição
Sinta-se à vontade para contribuir com melhorias no projeto! Faça um fork, implemente suas alterações e envie um pull request.