const express = require("express")
const hrController = require('../controller/hrAuthController')
const router = express.Router()

router.post('/login',hrController.login)
router.post('/register',hrController.register)

module.exports= router
