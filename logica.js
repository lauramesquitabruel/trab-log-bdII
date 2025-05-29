/*

Imprimir quais transações devem realizar o REDO. 

Reportar quais dados foram atualizados;

Seguir o fluxo de execução conforme o método de REDO, conforme visto em aula; 



tem q olhar as q commitaram

*/

const { Client } = require('pg');

//pra conecta com o banco
const client = new Client({

  user: 'postgres',
  host: 'localhost',
  database: 'bd2',
  password: 'postgres',       
  port: 5432,       

});



async function PegaLog() {
  
    await client.connect();
    const res = await client.query('SELECT * FROM log');
    //aqui pega os log 
    
    const logRegistros = res.rows;
    console.log(logRegistros);
    await client.end();
    return logRegistros;
 
}


PegaLog();



