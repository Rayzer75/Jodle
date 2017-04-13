var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').settings

var db = pgp(dbconfig)



function getContact(telephone, callback)
{
    var requete = `select telephone, nom, prenom, position from public.utilisateur where telephone = ${telephone}`
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
     var requete = `select position from public.utilisateur where telephone = ${telephone}`
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
    var requete = 'select Id, TypeMedia, IdEmetteur, IdDestinataire, DateEmission, TimeOut from public.media where id = ${id} and typemedia = ${type}'
    console.log(requete);
    
    db.one(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}


function addUser(telephone, nom, prenom, position, callback){
    var requete = 'insert into public.utilisateur values(${telephone}, ${nom},${prenom}, ${position}'
    console.log(requete);
    
    db.none(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}
    
function updateUser(telephone, nom, prenom, position, callback){
    var requete = 'update public.utilisateur set  nom = ${nom}, prenom = ${prenom}, position = ${position} where Telephone = ${telephone}'
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
    var requete = 'delete from public.utilisateur where Telephone = ${telephone}'
    console.log(requete);
    
    db.none(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}

module.exports = {
  getContact,
  getPosition,
  getMedia,
  updateUser,
  addUser,
  deleteUser
};