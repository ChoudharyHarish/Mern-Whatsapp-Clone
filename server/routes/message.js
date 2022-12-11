const express = require('express');
const router = express.Router();

const { getMessage, sendMessage, getAllUsers, deleteMesssages } = require("../controllers/message")

router.post("/getMessage", getMessage);
router.post("/messages", sendMessage);

router.get("/messages", getAllUsers);
router.post('/messages/delete', deleteMesssages);

module.exports = router
