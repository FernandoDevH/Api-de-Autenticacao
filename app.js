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

//3 registro de usuários + arquivo model
app.post('/auth/registro', async(req,res) => {

const {name, email, password, confirmpassword} = req.body;
if(!name){
    return res.status(422).json({msg: 'O nome é obrigatório!'})
};

if(!email){
    return res.status(422).json({msg: 'O email é obrigatório!'})
};

if(!password){
    return res.status(422).json({msg: 'O senha é obrigatório!'})
};

if(password !== confirmpassword){
    return res.status(422).json({msg: 'As senhas não conferem! Tente novamente.'})
};

//checando se o usuário já existe no banco de dados.
const userExists = await User.findOne({email: email, name:name})
if(userExists){
    return res.status(422).json({mensagem:'Por favor, utilize outro e-mail!'})
}

// criando a senha
const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash(password,salt)

//criando o usuário
const user = new User({
    name,
    email,
    password: passwordHash,
})
try{
    await user.save()
    res.status(201).json({mensagem: 'Usuário criado com sucesso!'})
    console.log('deu certo!')
} catch(err){
    console.log(err)
    res.status(500).json({mensagem: 'Aconteceu um erro, tente novamente!'})
}
})


//4 Rota de login
app.post('/auth/login', async(req,res) => {
    const {email, password} = req.body;
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    };
    
    if(!password){
        return res.status(404).json({msg: 'O senha é obrigatório!'})
    };

    const user = await User.findOne({email: email})
if(!user){
    return res.status(422).json({mensagem:'Usuário não encontrado2!'})
};

//checando se a senha é igual a do usuário
const checkPassWord = await bcrypt.compare(password, user.password);
if(!checkPassWord){
    return res.status(422).json({mensagem:'Senha invalida!'});
}
try{
    const secret = process.env.SECRET;
    const token = jwt.sign({
        id: user._id
    },secret);

    res.status(200).json({mensagem:'Autenticação realizada com sucesso!',token})
}
catch(err){
    console.log(err)
    res.status(500).json({mensagem: 'Aconteceu um erro, tente novamente!'})
}
})

//Rota Privada
function checkToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({mensagem: 'Acesso negado!'})
    }
    try{
    const secret = process.env.SECRET;
    jwt.verify(token, secret)
    next()

    }catch(error){
        res.status(400).json({mensagem:'Token inválido!'})
    }
}
app.get('/user/:id', checkToken, async(req,res) => {
    const id = req.params.id
    const user = await User.findById(id, '-password')
if(!user){
    return res.status(500).json({mensagem: 'Usuário não encontradoo!'})
}
    res.status(200).json({user})
})

//2 Credenciais

const  dbUser = process.env['DB_USER'];
const dbPassword = process.env['DB_PASS'];
mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.zyl9fvy.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000);
    console.log("Banco de dados conectado com sucesso!");
})
.catch((err) => console.log(err));

//