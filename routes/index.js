const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const productoController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('../controllers/usuariosController');

module.exports = () => {

    /** CLIENTES */
    // Postear nuevos clientes
    router.post('/clientes', clienteController.nuevoCliente);

    // Mostrar todos los clientes
    router.get('/clientes', clienteController.mostrarClientes);

    // Mostrar un cliente por ID
    router.get('/clientes/:idCliente', clienteController.mostrarClienteById);

    // Actualizar un cliente
    router.put('/clientes/:idCliente', clienteController.actualizarClienteById);

    // Eliminar un cliente
    router.delete('/clientes/:idCliente', clienteController.eliminarClienteById);

    /** PRODUCTOS */
    // Postear nuevos productos
    router.post('/productos', productoController.subirArchivo, productoController.nuevoProducto);

    // Mostrar todos los productos
    router.get('/productos', productoController.mostrarProductos);

    // Filtrar productos
    router.get('/productos/busqueda/:query', productoController.searchProducts);

    // Buscar y mostrar productos
    router.get('/productos/:idProducto', productoController.mostrarProductoById);

    // Actualizar un producto
    router.put('/productos/:idProducto', productoController.subirArchivo, productoController.actualizarProductoById);

    // Eliminar un producto
    router.delete('/productos/:idProducto', productoController.eliminarProductoById);

    /** PEDIDOS */
    // Postear nuevos pedidos
    router.post('/pedidos', pedidosController.nuevoPedido);

    // Mostrar todos los pedidos
    router.get('/pedidos', pedidosController.mostrarPedidos);

    // Filtrar pedidos
    router.get('/pedidos/busqueda/:idClient', pedidosController.searchPedidos);

    // Mostrar los pedidos por ID
    router.get('/pedidos/:idPedido', pedidosController.mostrarPedidoById);

    // Actualizar un pedido
    router.put('/pedidos/:idPedido', pedidosController.actualizarPedidoById);

    // Eliminar un pedido
    router.delete('/pedidos/:idPedido', pedidosController.eliminarPedidoById);

    /** Usuarios */
    // Postear nuevos usuarios
    router.post('/crear-cuenta', usuariosController.registrarUsuario);

    // Mostrar todos los usuarios
    router.get('/usuarios', usuariosController.mostrarUsuarios);

    router.post('/crear-cuenta', usuariosController.registrarUsuario);

    router.post('/iniciar-sesion', usuariosController.autenticarUsuario);

    return router;
}