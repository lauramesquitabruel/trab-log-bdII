import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'bd2',
  password: 'postgres',
  port: 5432,
});

async function executaRedo() {
  try {
    //conecta com o BD
    await client.connect();
    console.log('Conectado ao banco de dados');

    console.log('Recriando tabela MEMORIA');
    await client.query('DROP TABLE IF EXISTS memoria');
    await client.query('CREATE UNLOGGED TABLE memoria (id SERIAL PRIMARY KEY, num INT)');

    //recupera os operações salvas na tabela log
    const resultado = await client.query('SELECT operacao, id_tabela_memoria AS id, num FROM log');
    const logs = resultado.rows;

    if (logs.length === 0) {
      console.log('Nenhuma transação encontrada');
      return;
    }

    //processa cada log
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      try {
        switch (log.operacao) {
          case 'INSERT':
            //INSERT ON CONFLICT evita erros de chave duplicada
            await client.query(`
              INSERT INTO memoria (id, num) VALUES ($1, $2)
              ON CONFLICT (id) 
              DO UPDATE SET num = EXCLUDED.num
            `, [log.id, log.num]);
            break;
          
          case 'UPDATE':
            await client.query(`
              INSERT INTO memoria (id, num)
              VALUES ($1, $2)
              ON CONFLICT (id)
              DO UPDATE SET num = EXCLUDED.num
            `, [log.id, log.num]);
            break;
          
          case 'DELETE':
            await client.query('DELETE FROM memoria WHERE id = $1', [log.id]);
            break;
          
          default:
            console.log(`Operação desconhecida: ${log.operacao} - ignorando`);
        }
      } catch (error) {
        console.error(`Erro processando ${i+1}:`, error.message);
      }
    }

    const tabelaMemoria = await client.query('SELECT * FROM memoria ORDER BY id');
    console.log('Tabela MEMORIA:');
    console.log(tabelaMemoria.rows);

  } catch (error) {
    console.error('Erro durante o processo de REDO:', error);
  } finally {
    await client.end();
  }
}

executaRedo().catch(console.error);