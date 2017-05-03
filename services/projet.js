var db = require('../db/pq_projet.js')

function listContacts(req, res) {

    db.getContact(req.params.id, function (error, data)
    {
        if (error == null)
        {
            console.log(getChatroom(data.telephone, req.session.telephone));
            res.status(200).render('contact', {contact: data, chatroom: getChatroom(data.telephone, req.session.telephone)});
            console.log(data);
        } else
        {
            console.log(error);
            res.status(500).send(error);
        }
    })
}

function getChatroom(tel1, tel2) {
    tel1.replace('\'','');
    tel1.replace('\'','');
    if (tel1 < tel2) {
        return tel1 + '-' + tel2;
    } else {
        return tel2 + '-' + tel1;
    }
}

function getContactInfo(req, res) {

    db.getContact(req.params.id, function (error, data)
    {
        if (error == null)
        {
            console.log(data);
            res.status(200).json({
                pseudo : data.pseudo,
                telephone : data.telephone        
            })
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

    db.addUser(tel, pseudo, mdp, nom, prenom, function (error, data) {
        res.status(200).send('ok');
    })
}

function checkUser(req, res) {
    var pseudo = req.query.pseudo;
    var mdp = req.query.mdp;
    var telephone = req.query.telephone;

    db.checkUser(mdp, telephone, pseudo, function (error, data) {
        if (error == null)
        {
            console.log(data);
            var sess = req.session;
            sess.pseudo = data.pseudo;
            sess.telephone = telephone;
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
        } else {
            console.log(error);
        }
    });
}

function deleteExpiredMedias() {
    db.deleteExpiredMedias();
}

function deleteUser(req,res) {
    var telephone = req.body.telephone;
    db.deleteUser(telephone, function (error, data) {
        if (error == null)
        {
            res.status(200).send('ok');
            console.log(data);
        } else
        {
            console.log(error);
        }
    })
}

function updateUser(req,res) {
    var ancien_tel = req.body.ancien_tel;
    var nouv_tel = req.body.telephone;
    var pseudo = req.body.pseudo;
    var mdp = req.body.mdp;
    
    db.updateUser(ancien_tel, nouv_tel, pseudo, mdp, function (error, data) {
        if (error == null)
        {
            res.status(200).send('ok');
            console.log(data);
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

function showProfil(req,res) {
    var telephone = req.query.telephone;
    
    db.showProfil(telephone, function(error, data) {
        if (error == null)
        {
            console.log(data);
            res.render('profil', {pseudo: data, nom: data, prenom: data, telephone: data}); 
        }
    });
}


function showIndex(req,res) {
    res.status(200).render('menu');
}

function updatePosition(req,res) {
    var telephone = req.body.telephoneG;
    var latitude = req.body.latitudeG;
    var longitude = req.body.longitudeG;
    
    db.updatePosition(latitude, longitude, telephone, function (error, data) {
        if (error == null)
        {
            console.log("OUI");
            res.status(200).send('ok');
            console.log(data);
        } else
        {
            console.log("ERROR");
            console.log(error);
        }
    })
}

function getPosition(req,res) {
    var telephone = req.params.id;
    
    db.getPosition(telephone, function (error, data) {
        if (error == null)
        {
            console.log("OUI");
            res.status(200).send({longitude: data.longitude, latitude: data.latitude});
            console.log(data);
        } else
        {
            console.log("ERROR");
            console.log(error);
        }
    })
}

function getDist(req,res) {
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    var longitudeContact = req.query.longitudeContact;
    var latitudeContact = req.query.latitudeContact;
    
    db.getDist(longitude, latitude, longitudeContact, latitudeContact, function (error, data) {
        if (error == null)
        {
            console.log("OUI");
            res.status(200).send({dist: data.dist});
            console.log(data);
        } else
        {
            console.log("ERROR");
            console.log(error);
        }
    })
}

function showChat(req,res) {
    console.log("CHAT");
    var tel = req.query.telephone;
    var pseudo = req.query.pseudo;
    console.log(tel + ' -> ' + pseudo);
    res.status(200).render('chat', {pseudo1: req.session.pseudo,
                                    tel1: req.session.telephone,
                                    pseudo2: pseudo,
                                    tel2: tel
                          });
}

module.exports = {
    listContacts,
    getContactInfo,
    addUser,
    checkUser,
    showContacts,
    showParameters,
    getTimeout,
    addMedia,
    getAllMedias,
    deleteAllMedias,
    deleteExpiredMedias,
    deleteUser,
    updateUser,
    showProfil,
    showIndex,
    updatePosition,
    getPosition,
    getDist,
    showChat
}