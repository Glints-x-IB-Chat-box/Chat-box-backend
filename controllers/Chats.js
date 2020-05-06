const Chat = require('../models/Chat')

module.exports = ({
    getChat: (req, res) => {
        Chat
        .find()
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json(err))
    },
    postChat: (req, res) => {
        const chat = new Chat({
            message: req.body.message,
            imageUrl: req.file && req.file.path,
            status: req.body.status
        })
        chat
        .save()
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json(err))
    },
    deleteChat: (req, res) => {
        Chat.findByIdAndRemove({_id: req.params.chatId})
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json(err))
    }
})