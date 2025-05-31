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

    //verifica se a tabela ainda existe
    const verificaTabela = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'memoria'
      );
    `);

    if (!verificaTabela.rows[0].exists) {
      console.log('Criando tabela em memória');
      await client.query('CREATE UNLOGGED TABLE memoria (id SERIAL PRIMARY KEY, num INT)');
    }

    //recupera os operações salvas na tabela log
    const resultado = await client.query('SELECT operacao, id_tabela_memoria AS id, num FROM log ORDER BY id');
    const logs = resultado.rows;

    if (logs.length === 0) {
      console.log('Nenhuma transação encontrada');
      return;
    }

    console.log(`\nForam encontradas ${logs.length} operações commitadas para processar`);

    for (const log of logs) {
      try {
        switch (log.operacao) {
          //AINDA TO PENSANDO 
          default:
            console.log(`Operação ${log.operacao} não reconhecida`);
            continue;
        }
      } catch (error) {
        console.error(`Erro processando ${log.id}:`, error.message);
      }
    }

  } catch (error) {
    console.error('Erro durante o processo de REDO:', error);
  } finally {
    await client.end();
  }
}

executaRedo().catch(console.error);