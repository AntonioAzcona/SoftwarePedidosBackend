const Clientes = require('../models/Clientes');

// Agrega un nuevo cliente
exports.nuevoCliente = async(req, res, next) => {
    const cliente = new Clientes(req.body);

    try {
        await cliente.save();
        res.json({ mensaje: 'Se agregó un nuevo cliente' });
    } catch (error) {
        res.send(error);
        next();
    }
}

// Mostrar todos los clientes
exports.mostrarClientes = async(req, res, next) => {
    try {
        const clientes = await Clientes.find({});
        res.json(clientes);
    } catch (error) {
        res.send(error);
        next();
    }
}

// Muestra un cliente por su ID
exports.mostrarClienteById = async(req, res, next) => {
    try {
        const cliente = await Clientes.findById(req.params.idCliente)

        if(!cliente) {
            res.json({ mensaje: 'El cliente no existe' });
            next();
        } else {
            res.json(cliente);
        }
    } catch (error) {
        res.send(error);
        next();
    }
}

// Actualizar un cliente por su ID
exports.actualizarClienteById = async(req, res, next) => {
    try {
        const cliente = await Clientes.findOneAndUpdate({ _id : req.params.idCliente }, req.body, { new: true });
        res.json(cliente);
    } catch (error) {
        res.send(error);
        next();
    }
}

// Eliminar un cliente por su ID
exports.eliminarClienteById = async(req, res, next) => {
    try {
        await Clientes.findOneAndDelete({ _id : req.params.idCliente });
        res.json({ mensaje: 'Cliente eliminado con éxito' });
    } catch (error) {
        res.send(error);
        next();
    }
}