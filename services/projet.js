var db = require('../db/pq_projet.js')

function listContacts(req, res) { 
    
    db.getContact(telephone,function(error,data)
     {
         if (error == null)
         {
             res.status(200).render('contacts', {available_contacts : data});
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
        


module.exports = {
    listContacts,
    addUser
};