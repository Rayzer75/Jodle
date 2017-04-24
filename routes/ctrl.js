var express = require('express');
var router = express.Router();
var service = require('../services/projet')

router.get('/user/contacts/:id', service.listContacts);
router.get('/user/pos/:id', service.getPosition);
router.get('/user/pos/:id', service.updatePosition);
router.post('/user/media/:type/:id', service.getMedia);
router.put('/user/', service.updateUser);
router.get('/user', service.addUser);
router.get('/user', service.deleteUser);
        
module.exports = router

