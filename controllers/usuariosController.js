const Usuarios = require('../models/Usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async(req, res, next) => {
    const usuario = new Usuarios(req.body);
    usuario.password = await bcrypt.hash(req.body.password, 12);

    try {
        await usuario.save();
        res.json({ mensaje: 'Se agregó un nuevo usuario' });
    } catch (error) {
        res.send(error);
        next();
    }
}

exports.mostrarUsuarios = async(req, res, next) => {
    try {
        const usuarios = await Usuarios.find({});
        res.json(usuarios);
    } catch (error) {
        res.send(error);
        next();
    }
}

exports.autenticarUsuario = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuarios.findOne({ email });

        if(!usuario) {
            await res.status(401).json({ mensaje: 'El usuario no existe' });
            next();
        } else {
            if(!bcrypt.compareSync(password, usuario.password)) {
                await res.status(401).json({ mensaje: 'Password incorrecto' });
                next();
            } else {
                const token = jwt.sign({
                    email: usuario.email,
                    nombre: usuario.nombre,
                    id: usuario._id
                }, 'LLAVESECRETA', { expiresIn: '1h' });

                res.json({ token: token });
            }
        }
    } catch (error) {
        res.sent(error);
        next();
    }
}
