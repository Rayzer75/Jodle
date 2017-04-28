var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').settings

var db = pgp(dbconfig)



function getContact(telephone, callback)
{
    var requete = `select pseudo, telephone, nom, prenom, position from public.utilisateur where telephone = ${telephone}`
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


function addUser(telephone, pseudo, mdp, nom, prenom, position, callback){
    var requete = `insert into public.utilisateur values('${pseudo}','${mdp}','${telephone}', '${nom}','${prenom}', '${position}')`
    console.log(requete);
    
    db.none(requete, null)
            .then(function (data)  {
                callback(null, data)
    })
            .catch(function(error)  {
                callback(error, null)
    })      
}
    
function updateUser(telephone, pseudo,mdp, nom, prenom, position, callback){
    var requete = `update public.utilisateur set  nom = ${nom}, prenom = ${prenom}, pseudo = ${pseudo}, mdp = ${mdp}, position = ${position} where Telephone = ${telephone}`
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
    var requete = `delete from public.utilisateur where Telephone = ${telephone}`
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
    var requete = `select pseudo from public.utilisateur where Telephone = ${telephone} and pseudo=${pseudo} and mdp=${mdp}`

    console.log(requete);

    db.one(requete, null)
            .then(function (data) {
                callback(null,data)
            })
            .catch(function (error) {
                callback(error,null)
            })
}

function addMedia(typeMedia, emit, dest, data, timeout, callback) {
    var requete = `INSERT INTO public.media(typemedia, idemetteur, iddestinataire, data, timeout) VALUES('${typeMedia}', '${emit}', '${dest}', '${data}', to_date('${timeout}', 'YY:MM:DD'))`;
    console.log(requete);
    db.any(requete, null)
            .then(function (data) {
                callback(null,data);
            })
            .catch(function (error) {
                callback(error,null);
            });
}

function getAllMedias(emit, dest, callback) {
    var requete = `SELECT typemedia, data FROM public.media WHERE timeout > CURRENT_DATE AND iddestinataire = '${dest}' AND idemetteur = '${emit}'`;
    console.log(requete);
    db.any(requete, null)
            .then(function (data) {
                callback(null,data);
            })
            .catch(function (error) {
                callback(error,null);
            });
}

function deleteAllMedias(emit, dest, callback) {
    var requete = `DELETE FROM public.media WHERE timeout > CURRENT_DATE AND iddestinataire = '${dest}' AND idemetteur = '${emit}'`;
    console.log(requete);
    db.none(requete, null)
            .then(function (data) {
                callback(null,data);
            })
            .catch(function (error) {
                callback(error,null);
            });
}

function deleteExpiredMedias() {
    var requete = `DELETE FROM public.media WHERE timeout < CURRENT_DATE`;
    db.any(requete);
}

module.exports = {
  getContact,
  getPosition,
  getMedia,
  updateUser,
  addUser,
  deleteUser,
  checkUser,
  addMedia,
  getAllMedias,
  deleteAllMedias,
  deleteExpiredMedias
};