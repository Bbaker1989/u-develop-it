//import mysql2 package
const mysql = require('mysql2');

//import utils input check
const inputCheck = require('./utils/inputCheck');

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



// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });


//GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});






//Delete a candidate
app.delete('/api/candidate/:id', (req, res) =>{
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
               } else if (!result.affectedRows) {
                   res.json({
                       message: 'Canidate not found'
                   });
               } else {
                   res.json({
                       message: 'deleted',
                       changes: result.affectedRows,
                       id: req.params.id
                   });
               }
    });
});


//Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    //database call
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'sucess',
            data: body
        });
    });

});

//GET all parties route
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//GET route for single party
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'sucess',
            data: row
        });
    });
});

//DELETE Route for parties
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err,result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            //checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//PUT route to update candidates party
app.put('/api/candidate/:id', (req, res) => {
   /*Check to enure that a party_id was 
   provided before updating the database */
   const errors = inputCheck(req.body, 'party_id');
   
   if (errors) {
       res.status(400).json({ error: errors });
       return;
   }
    const sql = `UPDATE candidates SET party_id = ?
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            //check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'sucess',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//Default response for any other request (Not Found)
//catachall route
/*
app.use((req, res) => {
    res.status(404).end();
});
*/

//start express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});