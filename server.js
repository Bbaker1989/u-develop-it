//import express
const express = require('express');
//PORT designation and APP expression
const PORT = process.env.PORT || 3001;
const app = express();
//express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



//Default response for any other request (Not Found)
//catachall route
app.use((req, res) => {
    res.status(404).end();
});

//start express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});