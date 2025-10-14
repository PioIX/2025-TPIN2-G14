/*var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('front/public'));

app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

app.post('/login', async function login(req, res) {
    if (!req.body.numero_telefono || !req.body.contraseña) {
        return res.send({ res: false, message: "Los campos no pueden estar vacíos." });
    } else {
        const comprobar = await realizarQuery(
            `SELECT * FROM Usuarios WHERE numero_telefono = ${req.body.numero_telefono} AND contraseña = '${req.body.contraseña}'`
        );
        console.log(comprobar)
        if (comprobar.length > 0) {
            res.send({ res: true, idLogged: comprobar[0].id_usuario });
        } else {
            res.send({ res: false });

        }
    }



});


app.post('/register', async function (req, res) {
    console.log(req.body);
    const comprobar = await realizarQuery(
        `SELECT * FROM Usuarios WHERE numero_telefono = ${req.body.numero_telefono}`
    );

    if (comprobar.length == 0) {
        const respuesta = await realizarQuery(`INSERT INTO Usuarios (contraseña, foto_perfil, numero_telefono, descripcion, nombre, apellido)
        VALUES ('${req.body.contraseña}', '${req.body.foto_perfil}', ${req.body.numero_telefono}, '${req.body.descripcion}', '${req.body.nombre}', '${req.body.apellido}')`)
        res.send({ res: true, idLogged: respuesta.insertId })
    } else {
        res.send({ res: false })
    }
})

app.post('/chats', async function (req, res) {
    console.log(req.body)
    const chats = await realizarQuery(` SELECT DISTINCT
          c.id_chat,
          c.es_grupo,
          c.nombre_grupo AS nombre,
          c.foto_grupo   AS foto,
          c.descripcion  AS descripcion
      FROM UsuariosPorChat upc
      INNER JOIN Chats c 
          ON upc.id_chat = c.id_chat
      WHERE upc.id_usuario = ${req.body.idLogged}
        AND c.es_grupo = 1

      UNION

      -- Chats privados (solo info del otro usuario)
      SELECT 
          c.id_chat,
          c.es_grupo,
          CONCAT(u.nombre, ' ', u.apellido) AS nombre,
          u.foto_perfil AS foto,
          u.descripcion AS descripcion
      FROM UsuariosPorChat upc
      INNER JOIN Chats c 
          ON upc.id_chat = c.id_chat
      INNER JOIN UsuariosPorChat upc2 
          ON upc2.id_chat = c.id_chat 
         AND upc2.id_usuario <> ${req.body.idLogged}
      INNER JOIN Usuarios u 
          ON u.id_usuario = upc2.id_usuario
      WHERE upc.id_usuario = ${req.body.idLogged}
        AND c.es_grupo = 0;`)
    if (chats.length > 0) {
        res.send({ chats })
    } else {
        res.send({ res: false })
    }

})

app.post('/mensajes', async function (req, res) {
    console.log(req.body)
    const msj = await realizarQuery(`SELECT m.id_mensaje,
        m.mensaje,
        m.hora_de_envio,
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.foto_perfil
        FROM Mensajes m
        JOIN Usuarios u ON m.id_usuario = u.id_usuario
        WHERE m.id_chat = ${req.body.idChat}
        ORDER BY m.hora_de_envio ASC`)
    if (msj.length > 0) {
        res.send({ msj })
    } else {
        res.send({ res: false })
    }
})

app.post('/enviarMensaje', async function (req, res) {
    console.log(req.body)
    const respuesta = await realizarQuery(`INSERT INTO Mensajes (mensaje, hora_de_envio, id_usuario, id_chat)
    VALUES ('${req.body.mensaje}', NOW(), ${req.body.id_usuario}, ${req.body.id_chat})`)
    if (respuesta != null) {
        res.send({ res: true })
    } else {
        res.send({ res: false })
    }
})*/