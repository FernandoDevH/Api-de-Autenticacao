//1
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const User = require('./models/User');

app.get('/', (req,res) => {
    res.status(200).json({mensagem: 'Bem vindo!'});
});

//2 Credenciais

const  dbUser = process.env['DB_USER'];
const dbPassword = process.env['DB_PASS'];
mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@loginnode.ql5elso.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000)
    console.log("Banco de dados conectado com sucesso!")
})
.catch((err) => console.log(err));

//