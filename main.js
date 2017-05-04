var express = require('express');
var path = require('path');
var app = express(); // creation du serveur
var server = require('http').createServer(app);
var bodyParser = require('body-parser')  // envoie des paramètres en POST
var io = require('socket.io')(server);
var mustacheExpress = require('mustache-express');
var app_router = require('./routes/ctrl');
var app_services = require('./services/projet')
var session = require('express-session')

app.use(session({
	secret: 'ssshhhhh',
	resave: false,
	saveUninitialized: true
}));

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({// pour gérer les URL-encoded bodies (envoie formulaire en POST)
    extended: true
}));

app.set('views', path.join(__dirname + '/www/views'));
app.use(bodyParser.json()); // permet de lire le json envoyé en POST depuis le client
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');


app.use('/api/', app_router);

// 
// le repertoire public va contenir les
// fichiers statiques
app.use(express.static('www'));

server.listen(8080); // démarrage du serveur sur le port 8080

console.log("Serveur démarré sur le port 8080");

// utile seulement pour les tests sur navigateur
app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/www/chat.html');
});

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/www/contact.html');
});

app.get('/register', function (req, res) {
    res.sendFile(__dirname + '/www/register.html');
});
app.get('/index', function (req, res) {
    res.sendFile(__dirname + '/www/index.html');
});

io.on('connection', function (socket) {
    // évenement declenché si un utilisateur rentre un message
    socket.on('chat message', function (msg) {
        if (io.sockets.adapter.rooms[msg.room].length < 2) { // s'il n'y a qu'une personne dans la salle, on enregistre dans la bdd
            timeout = app_services.getTimeout();
            app_services.addMedia(msg, timeout);
            io.to(msg.room).emit('server message', {sender: 'Serveur', type: 'text', data: 'Ce message sera transmis quand le destinataire sera connecté.'});
        }
        console.log('message in room : ' + msg.room);
        io.to(msg.room).emit('chat message', msg);
    });
    // évenement déclenché lorsqu'un utilisateur se connecte
    socket.on('is connected', function (user) {
        app_services.getAllMedias(user.emit, user.dest, function(data) {
            var length = data.length;
            if (length > 0) {
                io.to(user.room).emit('server message', {sender: 'Serveur', type: 'text', data: 'Vous avez reçu les messages suivants :'});
                app_services.deleteAllMedias(user.emit, user.dest);
            }
            for (var i = 0; i < length; i++) {
                io.to(user.room).emit('new message', {sender: user.sender, type: data[i].typemedia, data: data[i].data});
            }  
        });
        app_services.deleteExpiredMedias();
    });
    // évenement permettant de placer un utilisateur dans une room
    socket.on('room', function(room) {
        socket.join(room);
    });

});
