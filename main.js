var express = require('express');
var path = require('path');
var app = express(); // creation du serveur
var server = require('http').createServer(app);
var bodyParser = require('body-parser')  // envoie des paramètres en POST
var io = require('socket.io')(server);
var mustacheExpress = require('mustache-express');
var app_router = require('./routes/ctrl');
var app_services = require('./services/projet')

app.use(bodyParser.urlencoded({     // pour gérer les URL-encoded bodies (envoie formulaire en POST)
  extended: true
})); 

app.set('views', path.join(__dirname + '/www/views'));
app.use(bodyParser.json()) // permet de lire le json envoyé en POST depuis le client
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');


app.use('/api/', app_router);

/*io.on('connect', function (socket){
    console.log("Start animation");
    surface_services.animationOn(socket)
    
    socket.on('disconnect', function(){
        console.log("Stop animation")
        surface_services.animationOff(socket)
    })
})*/

// 
// le repertoire public va contenir les
// fichiers statiques
app.use(express.static('www'));

server.listen(8080); // démarrage du serveur sur le port 8080

console.log("Serveur démarré sur le port 8080");

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/www/chat.html');
});

app.get('/contact', function(req, res){
	res.sendFile(__dirname + '/www/contact.html');
});

app.get('/register', function(req, res){
	res.sendFile(__dirname + '/www/register.html');
});
app.get('/index', function(req, res){
	res.sendFile(__dirname + '/www/index.html');
});

app.get('/index', function(req, res){
	res.sendFile(__dirname + '/www/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
