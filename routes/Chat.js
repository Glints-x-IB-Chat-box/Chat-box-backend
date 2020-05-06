const express = require('express');
const ChatController = require('../controllers/Chats')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destinantion:(req, file, cb) => {
        cb(null, './public/chatImage/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false);
    }
}
const upload = multer({storage:storage, limits:{
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})
router.get('/getchat', ChatController.getChat)
router.post('/postchat', upload.single('imageUrl'),ChatController.postChat)
router.delete('/deletechat/:chatId', ChatController.deleteChat)

module.exports = router