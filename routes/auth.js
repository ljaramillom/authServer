const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validarJWT } = require('../middlewares/validate-jwt');

const router = Router();

// nuevo usuario
router.post('/new', [
    check('name', 'Campo requerido').not().isEmpty(),
    check('email', 'Campo requerido').isEmail(),
    check('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    validateFields
], crearUsuario);

// login usuario
router.post('/', [
    check('email', 'Campo requerido').isEmail(),
    check('password', 'La contraseña debe ser mayor a 6 caracteres').isLength({ min: 6 }),
    validateFields
], loginUsuario);

// validar y revalidar token
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;