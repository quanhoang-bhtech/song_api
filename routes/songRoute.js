const express = require('express');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })
const router = express.Router();
const songController = require('../controllers/songController')

router.post('/song', songController.insertRecord);
router.post('/song/import',upload.single('fileXlsx'), songController.importRecord)
router.put('/update/:id', songController.updateRecord);
router.post('/register', songController.register);
router.post('/login', songController.login);
router.delete('/delete/:id', songController.deleteRecord)
router.get('/list/:page', songController.listRecord)
module.exports = router;