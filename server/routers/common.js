const express = require('express');
const router = express.Router();
const {UploadFileController} = require('./../controllers');

const Auth = require('../middlewares/auth');

router.post('/uploadFile', [Auth.vetifyToken,UploadFileController.uploadFile.bind(UploadFileController)]);

module.exports = router;