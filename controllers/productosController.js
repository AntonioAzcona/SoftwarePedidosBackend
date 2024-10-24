const Productos = require('../models/Productos');
// ====================================================
const multer = require('multer');
const shortid = require('shortid');
const { unlink, readdirSync } = require('fs');

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'));
        }
    }
}

// Pasar la configuración y el campo
const upload = multer(configuracionMulter).single('imagen');

// Sube archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error });
        }
        return next();
    });
}
// ===========================================================

// Agrega un nuevo producto
exports.nuevoProducto = async (req, res, next) => {
    const producto = new Productos(req.body);

    try {
        if (req.file.filename) {
            producto.imagen = req.file.filename
        }

        await producto.save();
        res.json({ mensaje: 'Se agregó un nuevo producto' });
    } catch (error) {
        res.send(error);
        next();
    }
}

// Mostrar todos los productos
exports.mostrarProductos = async (req, res, next) => {
    try {
        const productos = await Productos.paginate({});
        res.json(productos);
    } catch (error) {
        res.send(error);
        next();
    }
}

// Muestra un producto por su ID
exports.mostrarProductoById = async (req, res, next) => {
    try {
        const producto = await Productos.findById({ _id: req.params.idProducto });
        if (!producto) {
            res.json({ mensaje: 'No existe el producto' });
            next();
        } else {
            res.json(producto);
        }
    } catch (error) {
        res.send(error);
        next();
    }
}

// Busca y muestra productos
exports.searchProducts = async (req, res, next) => {
    try {
        const { query } = req.params;
        const productos = await Productos.find({ nombre: new RegExp(query, 'i') });
        res.json(productos);
    } catch (error) {
        res.send(error);
        next();
    }
}

// Actualizar un producto por su ID
exports.actualizarProductoById = async (req, res, next) => {
    try {
        // Construir un producto nuevo
        const productoNuevo = req.body;

        // Verificar si hay una imagen nueva
        if (req.file) {
            productoNuevo.imagen = req.file.filename;
        } else {
            let productoAnterior = await Productos.findById(req.params.idProducto);
            productoNuevo.imagen = productoAnterior.imagen;
        }

        const producto = await Productos.findOneAndUpdate({ _id: req.params.idProducto }, productoNuevo, { new: true });
        res.json(producto);
    } catch (error) {
        res.send(error);
        next();
    }
}

// Eliminar un producto por su ID
exports.eliminarProductoById = async (req, res, next) => {
    try {
        let productoAnterior = await Productos.findById(req.params.idProducto);

        if (productoAnterior && productoAnterior.imagen) {
            // Indica que existe ese directorio en la db, pero no que exista el archivo como tal
            const imagenAnteriorPath = __dirname + `/../uploads/${productoAnterior.imagen}`;
            // Obtiene todos los archivos en el directorio especificado
            const archivos = readdirSync(__dirname + `/../uploads/`);

            if (archivos.includes(productoAnterior.imagen)) {
                unlink(imagenAnteriorPath, (error) => {
                    if (error) {
                        console.log(error)
                        next();
                    }
                    console.log('Archivo/Imagen eliminado correctamente');
                });
            } else {
                console.log('No existe el archivo', productoAnterior.imagen);
            }
        }
        await Productos.findOneAndDelete({ _id: req.params.idProducto });
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (error) {
        res.send(error);
        next();
    }
}