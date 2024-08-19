const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');

// Conectar MongoDB
// ==================================================================
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/restapis', {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Conectado...'))
.catch((err) => console.log(err));
// ==================================================================

// Crear el servidor
const app = express();

// Habilitar bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Rutas de la app
app.use('/', routes());

// Puerto
app.listen(5001, () => {
    console.log('La aplicación está en linea');
});