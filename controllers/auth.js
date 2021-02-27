const { response } = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {
    const { email, name, password } = req.body;

    try {
        // verificar email unico
        const usuario = await Usuario.findOne({ email });
        if (usuario) { return res.status(400).json({ ok: false, msg: 'Email ya existe' }); }

        // crear usuario con el modelo
        const dbUser = new Usuario(req.body);

        // hashear contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        // generar JWT
        const token = await generarJWT(dbUser.id, name);

        // crear usuario db
        dbUser.save();

        // generar respuesta exitosa
        return res.status(200).json({ ok: true, uid: dbUser.id, name, email, token });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Se ha presentado un error. Intenta nuevamente.'
        });
    }
}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const dbUser = await Usuario.findOne({ email });
        if (!dbUser) {
            return res.status(400).json({ ok: false, msg: 'Email no registrado' });
        }
        // confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword) {
            return res.status(400).json({ ok: false, msg: 'La contraseña es inválida' });
        }
        // generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        // respuesta del servicio
        return res.json({ ok: true, uid: dbUser.id, name: dbUser.name, email: dbUser.email, token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Se ha presentado un error. Intenta nuevamente.'
        });
    }
}

const revalidarToken = async(req, res = response) => {
    const { uid } = req;

    // leer bd
    const dbUser = await Usuario.findById(uid);

    // generar JWT
    const token = await generarJWT(uid, dbUser.name);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}