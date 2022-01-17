//import mysql2 package
const mysql = require('mysql2');

//import express
const express = require('express');
const { query } = require('express');
//PORT designation and APP expression
const PORT = process.env.PORT || 3001;
const app = express();

//express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// conntect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username,
        user: 'root',
        //Your MySQL password
        password: 'password123',
        database: 'election'
    },
    console.log('Connected to the election database.')
);
//query the database to return all the data in the candidates table
/* db object is using the query()
rows is the database query response
if there are no errors, the err is null
*/
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});


//Default response for any other request (Not Found)
//catachall route
app.use((req, res) => {
    res.status(404).end();
});

//start express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});