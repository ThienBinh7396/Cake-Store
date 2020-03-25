const express = require('express');
const router = express.Router();
const {UploadFileController, CommonController} = require('./../controllers');

const Auth = require('../middlewares/auth');

router.post('/uploadFile', [Auth.vetifyToken,UploadFileController.uploadFile.bind(UploadFileController)]);

router.get('/getCommuneDistrictFromCity', [CommonController.getDataAddressByCity]);

module.exports = router;