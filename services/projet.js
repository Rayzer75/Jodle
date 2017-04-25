var db = require('../db/pq_projet.js')

function listContacts(req, res) { 
    
    db.getContact(req.params.id,function(error,data)
     {
         if (error == null)
         {
             res.status(200).render('contact', {contact : data});
             console.log(data);
         }
         else
         {
             console.log(error);
             res.status(500).send(error);
         }
    })
}

function addUser(req,res){
        var pseudo = req.body.pseudo
        var mdp = req.body.mdp
        var nom = req.body.nom
        var prenom = req.body.prenom
        var tel = req.body.tel
        
    db.addUser(tel, pseudo, mdp, nom, prenom, 1,function () {
        res.status(200).send("ok");
    })
}
        
function checkUser(req,res) {
    var pseudo = req.body.pseudo;
    var mdp = req.body.mdp;
    var telephone = req.body.telephone;
    
    db.checkUser(mdp,telephone,pseudo,function (data) {
        res.status(200).send("ok");
        res.pseudo = data;
    })
}

function showContacts(req, res) {
    res.status(200).render('contacts');
}

module.exports = {
    listContacts,
    addUser,
    checkUser,
    showContacts
}