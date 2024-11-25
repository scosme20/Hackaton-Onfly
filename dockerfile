# Usando a imagem oficial do MySQL
FROM mysql:8

# Definindo as variáveis de ambiente (mesmas do docker-compose)
ENV MYSQL_ROOT_PASSWORD=b5d9f8h7
ENV MYSQL_DATABASE=hackaton
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=b5d9f8h7

# Expondo a porta padrão do MySQL
EXPOSE 3306

# Persistindo dados no diretório de volumes
VOLUME /var/lib/mysql
