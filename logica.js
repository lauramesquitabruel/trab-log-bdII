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
    const resultado = await client.query('SELECT operacao, id_tabela_memoria AS id, num, id_transacao FROM log');
    const logs = resultado.rows;
    console.log(resultado);

    if (logs.length === 0) {
      console.log('Nenhuma transação commitada encontrada para REDO');
      return;
    }

    console.log(`\nForam encontradas ${logs.length} operações commitadas para processar`);

    const transacoes = {};
    logs.forEach(log => {
      if (!transacoes[log.id_transacao]) {
        transacoes[log.id_transacao] = [];
      }
      transacoes[log.id_transacao].push(log);
    });

    //processa cada transação e aplicar REDO
    for (const [transacaoId, transacaoLogs] of Object.entries(transacoes)) {
      console.log(`\nProcessando transação ${transacaoId} (${transacaoLogs.length} operações)`);

       for (const log of transacaoLogs) {
        try {
          //aplica a operação no banco de dados
          let updateQuery;
          switch (log.operacao) {
            //AINDA TO PENSANDO
            default:
              console.log(`Operação ${log.operacao} não reconhecida - ignorando`);
              continue;
          }
        } catch (error) {
          console.error(`  - Erro ao aplicar REDO para operação ${log.num}:`, error.message);
        }
      }

      console.log(`Transação ${transacaoId} processada com sucesso`);
    }

    console.log('\nProcesso de REDO concluído com sucesso');

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

