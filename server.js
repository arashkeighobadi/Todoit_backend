const express = require('express');
const mysql = require('mysql');
const db = require('./db');

const app = express();

app.use(express.json());

//insert into todos table
app.post('/add-todo', function(req, res) {

    let text = req.body.text;
    let email = req.body.email;

    let sql = "INSERT INTO todos (text, completed, owner) VALUES (" + 
        db.escape(text) + ", false, " + db.escape(email) + ")";
        
    db.query(sql, (err, result) => {
        if(err) {
            res.json({text: 'Insertion was not successful!'});
            console.log(err);
            return;
        }
        console.log(result);
        res.json({text: 'todo with text '+ text +' inserted.', success: true});
    })
});

//edit a record
app.post('/edit-todo', (req, res) => {
    let text = req.body.text;
    let id = req.body.id;
    let completed = !req.body.completed;
    let sql = ''
    
    if(text) {
        sql = "UPDATE todos SET text = " + 
            db.escape(text) + " WHERE id = " + db.escape(id);
    }
    else {
        sql = "UPDATE todos SET completed = " + 
            db.escape(completed) + " WHERE id = " + db.escape(id);
    }

    db.query(sql, (err, result) => {
        if(err) {
            res.json({text: 'Something went wrong when updating a todo.'});
            console.log(err);
            return;
        }
        console.log(result);
        res.json({text: 'todo updated.'});
    });
});

// delete a todo
app.post('/delete-todo', (req, res) => {
    let id = req.body.id;
    let email = req.body.email;
    console.log('delete request received... id: ' + id + ' email: ' + email);

    let select_sql = 'SELECT * FROM todos WHERE id = ' + db.escape(id);
    db.query(select_sql, (err, result) => {
        if(err) {
            res.json({text: 'Error while searchin for todo on the db!'});
            console.log(err);
            return;
        }
        if(!result[0]){
            res.json({text: 'This todo was not found in the db!'});
            console.log(result);
            return;
        }
        if(result[0].owner === email){
            let delete_sql = 'DELETE FROM todos WHERE id = ' + db.escape(id);
            db.query(delete_sql, (err, result) => {
                if(err){
                    res.json({text: 'Error while trying to delete the todo!'});
                    console.log(err);
                    return;
                }
                res.json({text: 'todo deleted successfully.'})
                console.log(result)
            });
        }
        else{
            console.log('emails dont match' + result[0]);
        }
    });
})

//fetch all todos of a user
app.post('/fetch-todos', function(req, res) {

    let email = req.body.email;

    console.log('fetch request from email: ' + email);

    let sql = "SELECT * from todos WHERE owner = " + db.escape(email);
    db.query(sql, (err, result) => {
        if(err) {
            res.json({text: 'Fetching todos was not successful!'});
            console.log(err);
            return;
        }
        res.json({text: 'Fetching todos was successful!', data: result})
        console.log(result);
    })
});

// keep track of who is logged in currently
const loggedInUsers= [];

app.post('/login', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    
    let sql = 'SELECT * FROM users WHERE email = ' + db.escape(email);
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
            db.escape(email) + ", " + db.escape(password) +")";

        db.query(insert_sql, (err, result) => {
            if(err) {
                res.json({text: 'Registeration was not successful!', code: 3});
                console.log(err);
                return;
            }
            console.log(result);
            res.json({text: 'You are registered.', code: 1});
        })
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

app.listen('3000', () => {
    console.log('server started on port 3000...');
})
