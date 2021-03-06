var express = require('express');
var router = express.Router();
var service = require('../services/projet');

router.get('/user/:id', service.getContactInfo);
router.get('/user/contacts/:id', service.listContacts);
router.get('/user/pos/:id', service.getPosition);
router.get('/distance/', service.getDist);
router.put('/user/pos/', service.updatePosition);
router.put('/user/', service.updateUser);
router.get('/user/', service.checkUser);
router.post('/user/', service.addUser);
router.delete('/user/', service.deleteUser);
router.get('/contacts/', service.showContacts);
router.get('/parameters/',service.showParameters);
router.get('/profil/',service.showProfil);
router.get('/menu/',service.showIndex);
router.get('/chat/',service.showChat);
module.exports = router

