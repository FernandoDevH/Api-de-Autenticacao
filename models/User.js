const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
});

module.exports = User;




// aqui gera a tabela no mongo db, o 'User' irá virar uma tabela Users no mongo