const Pedidos = require('../models/Pedidos');

exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedidos(req.body);

    try {
        await pedido.save();
        res.json({ mensaje: 'Se agregó un nuevo pedido' });
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await Pedidos.find({}).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        res.json(pedidos);
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarPedidoById = async (req, res, next) => {
    try {
        const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });

        if (!pedido) {
            res.json({ mensaje: "El pedido no existe" });
            return next();
        }
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.actualizarPedidoById = async (req, res, next) => {
    try {
        const pedido = await Pedidos.findOneAndUpdate({ _id: req.params.idPedido }, req.body, { new: true }).populate('cliente').populate({
            path: 'pedido.producto',
            model: 'Productos'
        });
        res.json(pedido);
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.eliminarPedidoById = async(req, res, next) => {
    try {
        await Pedidos.findOneAndDelete({ _id: req.params.idPedido });
        res.json({ mensaje: 'Pedido eliminado con éxito' });
    } catch (error) {
        console.log(error);
    }
}