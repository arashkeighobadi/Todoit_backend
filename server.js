const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host:       'localhost',
    user:       'root',
    password:   'root',
    database:   'todoit'
})

db.connect((err) => {
    if(err) console.log(err);
    console.log('MySql connected...');
})

const app = express();

app.use(express.json());

//insert into todos table
app.post('/add-todo', function(req, res) {

    let text = req.body.text;

    let sql = "INSERT INTO todos (text, completed) VALUES ('" + text + "', false)"
    db.query(sql, (err, result) => {
        if(err) {
            res.json({text: 'Insertion was not successful!'});
            console.log(err);
            return
        }
        console.log(result);
        res.json({text: 'todo with text '+ text +' inserted.'});
    })
    console.log('Post request successful! text: ' + text );
});

//testing the connection
app.get('/connect', (req, res) => {
    // if(err) throw err;
    // res.send('You reached the server!');
    res.json({text: 'You reached the server!'});
})

//create a database
app.get('/createdb', (req, res, err) => {
    if(err) throw err;

    let sql = 'CREATE DATABASE todoit'
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created.');
    })
})

//create todos table
app.get('/create-todos-table', (req, res) => {
    let sql = 'CREATE TABLE todos(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL, completed BOOLEAN)'
    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result);
        res.send('todos table created.');
    })
})

//select all records from the todos table
app.get('/get-todos', (req, res) => {
    let sql = 'SELECT * FROM todos'
    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result);
        res.send('todos fetched.');
    })
})

//select a single record
app.get('/get-todo/:id', (req, res) => {
    let sql = 'SELECT * FROM todos WHERE id = ' + connection.escape(req.params.id)
    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result);
        res.send('todo with id '+ connection.escape(req.params.id) +' fetched.');
    })
})

app.get('/delete-post/:id', (req, res) => {
    let sql = 'DELETE * FROM todos WHERE id = ' + connection.escape(req.params.id)
    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result);
        res.send('todo with id '+ connection.escape(req.params.id) +' deleted.');
    })
})



app.listen('3000', () => {
    console.log('server started on port 3000...');
})
