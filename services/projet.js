var db = require('../db/pq_projet.js')

function listContacts(req, res) {

    db.getContact(req.params.id, function (error, data)
    {
        if (error == null)
        {
            res.status(200).render('contact', {contact: data});
            console.log(data);
        } else
        {
            console.log(error);
            res.status(500).send(error);
        }
    })
}

function addUser(req, res) {
    var pseudo = req.body.pseudo
    var mdp = req.body.mdp
    var nom = req.body.nom
    var prenom = req.body.prenom
    var tel = req.body.tel

    db.addUser(tel, pseudo, mdp, nom, prenom, 1, function (error, data) {
        res.status(200).send('ok');
    })
}

function checkUser(req, res) {
    var pseudo = '\'' + req.query.pseudo + '\'';
    var mdp = '\'' + req.query.mdp + '\'';
    var telephone = '\'' + req.query.telephone + '\'';

    db.checkUser(mdp, telephone, pseudo, function (error, data) {
        if (error == null)
        {
            //res.status(200).send({success: 'ok', data: data});
            console.log(data);
            res.render('menu', {pseudo: data});
        } else
        {
            console.log(error);
            res.render('error_connect', {error: error});
        }
    })
}

function showContacts(req, res) {
    res.status(200).render('contacts');
}

function showParameters(req,res){
    res.status(200).render('parameters');
}

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function getTimeout() {
    var timeout = 7; // 7 jours
    var date = new Date();
    date = date.addDays(timeout);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day;
}

function addMedia(msg, timeout) {
    db.addMedia(msg.type, msg.emit, msg.dest, msg.data, timeout, function (error, data) {
        if (error) {
            console.log(error);
        }
    });
}

function getAllMedias(idEmit, idDest, callback) {
    db.getAllMedias(idEmit, idDest, function (error, data) {
        if (error == null)
        {
            console.log(data);
            callback(data);
        } else
        {
            console.log(error);
        }
    });
}

function deleteAllMedias(idEmit, idDest) {
    db.deleteAllMedias(idEmit, idDest, function (error, data) {
        if (error == null)
        {
            console.log("Deleted medias");
        } else
        {
            console.log(error);
        }
    });
}

function deleteExpiredMedias() {
    db.deleteExpiredMedias();
}

module.exports = {
    listContacts,
    addUser,
    checkUser,
    showContacts,
    showParameters,
    getTimeout,
    addMedia,
    getAllMedias,
    deleteAllMedias,
    deleteExpiredMedias
}