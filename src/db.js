const mysql = require('mysql');
const dbKey = require('../keys/keys');
const CREATE_TODOIT_DB_SQL = 'CREATE DATABASE todoit';
const CREATE_TODOS_TABLE_SQL = 'CREATE TABLE todos(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL, completed BOOLEAN, owner VARCHAR(255) NOT NULL)';
const CREATE_USERS_TABLE_SQL = 'CREATE TABLE users(email VARCHAR(255) NOT NULL PRIMARY KEY, password VARCHAR(255) NOT NULL)';


const tmpCon = mysql.createConnection({
    host:       dbKey.host,
    user:       dbKey.user,
    password:   dbKey.password,
});

const connection = mysql.createConnection({
    host:       dbKey.host,
    user:       dbKey.user,
    password:   dbKey.password,
    database:   dbKey.database,
});

tmpCon.connect((err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Temporary connection to the DB stablished...');
});

// create todoit database if it doesn't exist
tmpCon.query(CREATE_TODOIT_DB_SQL, (err, result) => {
    if(err) {
        console.log(err.message);
        return;
    }
    console.log(result);
});


// End the temporary connection to start the main one.
tmpCon.end(err => {
    if(err) {
        console.log('Error in ending the temporary DB connection!');
        console.log(err.message);
    }
    connection.connect(err => {
        if(err) {
            console.log(err);
            return;
        }
        console.log('Main connection to the DB stablished...');
    });
    
    // Create todos table
    connection.query(CREATE_TODOS_TABLE_SQL, (err, result) => {
        if(err) {
            console.log(err.message);
        }
        else {
            console.log(result);
        }
    });
    
    // Create users table
    connection.query(CREATE_USERS_TABLE_SQL, (err, result) => {
        if(err) {
            console.log(err.message);
        }
        else {
            console.log(result);
        }
    });
});

module.exports = connection;