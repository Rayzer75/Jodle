var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').settings

var db = pgp(dbconfig)



function getContact(telephone, callback)
{
    var requete = `select pseudo, telephone, nom, prenom from public.utilisateur where telephone = ${telephone}`
    console.log(requete);
    
    db.one(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })    
}

function getPosition(telephone, callback){
     var requete = `select latitude, longitude from public.utilisateur where telephone = ${telephone}`
    console.log(requete);
    
    db.one(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}

function getMedia(id, type, callback){
    var requete = `select Id, TypeMedia, IdEmetteur, IdDestinataire, DateEmission, TimeOut from public.media where id = ${id} and typemedia = ${type}`
    console.log(requete);
    
    db.one(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}


function addUser(telephone, pseudo, mdp, nom, prenom, callback){
    var requete = `insert into public.utilisateur values('${pseudo}','${mdp}','${telephone}', '${nom}','${prenom}')`
    console.log(requete);
    
    db.none(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}
    
function updateUser(ancien_telephone, nouv_telephone, pseudo, mdp, callback){
    var requete = `update public.utilisateur set pseudo = '${pseudo}', mdp = '${mdp}', telephone = '${nouv_telephone}' where Telephone = '${ancien_telephone}'`
    console.log(requete);
    
    db.none(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}

function deleteUser(telephone, callback){
    var requete = `delete from public.utilisateur where Telephone = '${telephone}'`
    console.log(requete);
    
    db.none(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}


function checkUser(mdp, telephone, pseudo, callback) {
    var requete = `select pseudo from public.utilisateur where Telephone = '${telephone}' and pseudo='${pseudo}' and mdp='${mdp}'`

    console.log(requete);

    db.one(requete, null)
            .then(function (data) {
                callback(null,data)
            })
            .catch(function (error) {
                callback(error,null)
            })
}

function showProfil(telephone, callback) {
    var requete = `select pseudo,nom,prenom,telephone from public.utilisateur where Telephone = '${telephone}'`
    
    console.log(requete);
    
    db.one(requete, null)
            .then(function (data) {
                callback(null,data)
            })
            .catch(function (error) {
                callback(error,null)
            })
}

function updatePosition(latitude, longitude, telephone, callback) {
    var requete = `update public.utilisateur set latitude = '${latitude}', longitude = '${longitude}' where telephone = '${telephone}'`
    
    console.log(requete);
    
    db.none(requete, null)
        .then(function (data) {
            callback(null,data)
        })
        .catch(function (error) {
            callback(error,null)
        })
}

module.exports = {
  getContact,
  getPosition,
  getMedia,
  updateUser,
  addUser,
  deleteUser,
  checkUser,
  showProfil,
  updatePosition
};