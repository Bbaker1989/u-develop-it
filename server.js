//import connection.js file
const db = require('./db/connection');

//import api routes file
const apiRoutes = require('./routes/apiRoutes');

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

app.use('/api', apiRoutes);



//Default response for any other request (Not Found)
//catachall route
app.use((req, res) => {
    res.status(404).end();
});


// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });