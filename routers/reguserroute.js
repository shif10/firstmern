const express = require("express");
const bodyparser = require('body-parser');
const multer = require("multer")
const router = express.Router()
const header=require("../models/header")
const path = require("path")
const regusercontroller = require("../controller/regusercontroller");
router.use(bodyparser.json());
const votecontroller = require("../controller/voteidcontroller");
const session = require('express-session')
const config = require("../config/config")
router.use(session({ secret: config.session_secret }))
router.use(bodyparser.urlencoded({ extended: true }))
const auth = require("../middleware/auth")
require("fs")
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, path.join(__dirname, '../public/reguserimg'));

    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);

    }
});
const upload = multer({ storage: storage })







router.get('/register', auth.islogout, regusercontroller.loadregister);

router.get('/forgot', regusercontroller.loadforgot);

// router.get('/forgotpass', regusercontroller.loadforgotpass);

router.post('/forgot', regusercontroller.forgetvarify)
router.post('/register', upload.single("image"), regusercontroller.insertreguser);

router.get('/forgotpass', regusercontroller.loadforgotpass)
router.post('/forgotpass', regusercontroller.resetpasss)

router.get('/voteid', async (req, res) =>{
    const data=await header.findOne({_id:"638c7c72a61fd2cdfb3d8c68"});
    const regdata= data.home.length

    // Rendering home.ejs page
    res.render('voteid', {  mes:data,datalen:regdata });


})

router.post('/voteid', votecontroller.vote)

module.exports = router;