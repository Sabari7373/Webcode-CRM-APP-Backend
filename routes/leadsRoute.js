
const express = require("express");
const router = express.Router()
const {createLeads} = require('../controllers/leadController')

router.post("/", createLeads);

module.exports = router;