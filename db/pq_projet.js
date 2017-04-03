var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').settings

var db = pgp(dbconfig)

function getListeContacts(monId, callback)
{
    var requete = `select telephone, nom, prenom, position from public.utilisateur where trigo = ${trigo}`
    console.log(requete);
    
    db.any(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })    
}
