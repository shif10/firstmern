const express = require("express");
const bodyparser = require('body-parser');
const multer = require("multer")
const router = express.Router()
const path = require("path")
const auth = require("../middleware/auth")

const session = require('express-session')
const config = require("../config/config")
router.use(session({ secret: config.session_secret }))
const regusercontroller = require("../controller/regusercontroller");
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }))









router.get('/login', auth.islogout, regusercontroller.loadlogin)

router.get('/',auth.islogout, regusercontroller.loadlogin);
router.get('/logout',regusercontroller.logoutuser);
router.post('/login', regusercontroller.loginvarify);



//router.post('/forgotpass',regusercontroller.resetpasss);



module.exports = router; 