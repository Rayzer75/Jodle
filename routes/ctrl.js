var express = require('express');
var router = express.Router();
var service = require('../services/projet');

router.get('/user/contacts/:id', service.listContacts);
//router.get('/user/pos/:id', service.getPosition);
//router.put('/user/pos/:id', service.updatePosition);
//router.get('/user/media/:type/:id', service.getMedia);
router.put('/user/', service.updateUser);
router.get('/user/', service.checkUser);
router.post('/user/', service.addUser);
router.delete('/user/', service.deleteUser);
router.get('/contacts/', service.showContacts);
router.get('/parameters/',service.showParameters);
module.exports = router

