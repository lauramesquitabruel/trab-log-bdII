import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost:8080',
  database: 'postgres',
  password: 'postgres',
  port: 5432, 
});

pool.connect()
  .then(client => {
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  });