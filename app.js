const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const jwt = require('jsonwebtoken');
const TOKEN_KEY = 's0/\/\P4$$w0rD';

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'usersdb',
    password: 'root',
    port: '3306'
});

connection.connect( err => {
    if (err) {
        return console.log('Error' + err.message);
    } else {
        console.log('Подключение к MySQL выполнено');
    }
});

app.get('/', (req, res)=> {
    res.send('<h1>Hi</h1>');
});

app.post('/api/register', (req, res) => {
    const {phone, name, email, password} = req.body;
    const errors = [];

    if (!name) {
        errors.push({field: 'name', message: 'Name is required'})
    }
    if (!email) {
        errors.push({field: 'email', message: 'Email is required'})
    }
    if (!password) {
        errors.push({field: 'password', message: 'Password is required'})
    }

    if (errors.length ) {
        res.status(422).send(errors);
    }

    bcrypt.hash(myPlaintextPassword, saltRounds, (err, passwordHash) => {
        connection.query(
            `INSERT INTO users (phone, name, email, passwordHash) VALUES ('${phone}', '${name}', '${email}', '${passwordHash}')`,
            (err, result) => {
                if (err) {
                    res.status(400).send("Somthing went wrong");
                } else {
                    const token = jwt.sign({email}, TOKEN_KEY, {expiresIn: "24h"});
                    res.status(200).send({token});
                }
            }
        );
    });
})


app.listen(3000, () => {
    console.log('Server run');
});
