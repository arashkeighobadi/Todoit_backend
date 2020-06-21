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

    let sql = "INSERT INTO todos (text, completed) VALUES ('" + text + "', false)";
    db.query(sql, (err, result) => {
        if(err) {
            res.json({text: 'Insertion was not successful!'});
            console.log(err);
            return;
        }
        console.log(result);
        res.json({text: 'todo with text '+ text +' inserted.', success: true});
    })
    console.log('Post request successful! text: ' + text );
});

const loggedInUsers= [];

app.post('/login', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    
    let sql = 'SELECT * FROM users WHERE email = "' + email + '"';
    db.query(sql, (err, result) => {
        if(err) {
            res.json({text: 'Login was not successful!', code: 3});
            console.log(err);
            return;
        }
        if(!result[0]){
            res.json({text: 'No result found in the database!', code: 4});
            console.log('Unsuccessful login. email: ' + email );
            return;
        }
        
        if(result[0].password === password){
            loggedInUsers.push(email);
            res.json({text: 'You are logged in.', code: 1});
            console.log('User logged in. email: ' + email );
        }
        else {
            res.json({text: 'Wrong Password!', code: 2});
            console.log('Unsuccessful login (wrong password). email: ' + email );
        }
    })
});

app.post('/register', function(req, res) {
    let email = req.body.email;
    let password = req.body.password1;
    
    let search_sql = 'SELECT * FROM users WHERE email = "' + email + '"';
    db.query(search_sql, (err, result) => {
        if(err) {
            res.json({text: 'Registeration was not successful!', code: 3});
            console.log(err);
            return;
        }
        if(result[0]){
            res.json({text: 'An account with this email is already registered.', code: 2});
            console.log('Unsuccessful registration (email exists in the db). email: ' + email );
            return;
        }

        // send the insert query
        let insert_sql = "INSERT INTO users (email, password) VALUES (" + 
            mysql.escape(email) + ", " + mysql.escape(password) +")";

        db.query(insert_sql, (err, result) => {
            if(err) {
                res.json({text: 'Registeration was not successful!', code: 3});
                console.log(err);
                return;
            }
            console.log(result);
            res.json({text: 'You are registered.', code: 1});
        })
        
        // if(result[0].password === password){
        //     loggedInUsers.push(email);
        //     res.json({text: 'You are logged in.', code: 1});
        //     console.log('User logged in. email: ' + email );
        // }
        // else {
        //     res.json({text: 'Wrong Password!', code: 2});
        //     console.log('Unsuccessful login (wrong password). email: ' + email );
        // }
    })
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
    let sql = 'CREATE TABLE todos(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL, completed BOOLEAN)';
    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result);
        res.send('todos table created.');
    })
})

//create todos table
app.get('/create-users-table', (req, res) => {
    let sql = 'CREATE TABLE users(email VARCHAR(255) NOT NULL PRIMARY KEY, password VARCHAR(255) NOT NULL)';
    db.query(sql, (err, result) => {
        if(err) console.log(err);
        console.log(result);
        res.send('users table created.');
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
app.get('/get-todo/', (req, res) => {
    let sql = 'SELECT * FROM todos WHERE id = 1'
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err)
            return;
        };
        console.log(result[0].text);
        res.send('todo with id 1 fetched.');
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
