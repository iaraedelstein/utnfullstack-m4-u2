const mysql = require('mysql');
const util = require('util');

//Conexión a la DB
/* const conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'testUser',
    password: '1234',
    database: 'restaurant_review',
});*/

//Conexión a la DB Heroku
const conn = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    port: 3306,
    user: 'b3c7fb405317ac',
    password: 'c749af0c',
    database: 'heroku_b4028e762bc4e64',
});

conn.connect((error) => {
    if (error) throw error;
    console.log('Se estableción la conexión con la DB');
});

// Permite el uso de async await para un código más ordenado al generar queries
// Transforma una query que trabaja con callbacks a una promise
// async await solo trabaja con promises no con callbacks
const qy = util.promisify(conn.query).bind(conn);

module.exports = qy;