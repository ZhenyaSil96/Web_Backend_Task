const express = require('express');
const app = express();
const mysql = require('mysql2');

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

app.listen(3000, () => {
    console.log('Server run');
});
