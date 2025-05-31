import express from 'express';
import { Client } from 'pg';

//conexão com o banco de dados
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'bd2',
  password: 'postgres',
  port: 5432,
});

const app = express();

//executa o REDO
async function executeRedo() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados');

    //obtém todos os logs de operações commitadas
    const resultado = await client.query('SELECT operacao, id_tabela_memoria AS id, num FROM log');
    const logs = resultado.rows;
    console.log(resultado);

    if (logs.length === 0) {
      console.log('Nenhuma transação commitada encontrada para REDO');
      return;
    }
    
  } catch (error) {
    console.error('Erro durante o processo de REDO:', error);
  } finally {
    await client.end();
  }
    
}

//inicia o servidor
app.listen(3000, async () => {
  console.log('Servidor rodando na porta 3000');
  await executeRedo();
});

