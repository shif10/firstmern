var express = require('express');
const auth = require('../middleware/auth')
const timetable = require('../models/timetable')
const nodemailer = require("nodemailer");
const router = express.Router()
const regusercontroller = require("../controller/regusercontroller");
const votecontroller = require("../controller/voteidcontroller");
const bodyparser = require('body-parser');
const session = require('express-session')
const config = require("../config/config")
const codidates = require("../models/condidates")
router.use(session({ secret: config.session_secret }))
const fs = require("fs");
const condidates = require('../models/condidates');
const header = require('../models/header')
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }))
const data = fs.readFileSync('./api/nsdlapi.json', 'utf-8')
const objdata = JSON.parse(data)
var image = objdata[0].image
console.log("image is ", image)


//const tble=require('../connection')

router.get('/header', function (req, res) {

    // Rendering home.ejs page
    res.render('header');
})

router.get('/condidateprofo', async (req, res) => {


    const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
    const regdata = data.home.length
    const alldata = await condidates.findOne({ _id: req.query.id })
    // Rendering home.ejs page

    res.render('condidateprofile', { alldata: alldata, mes: data, datalen: regdata });
})

router.post('/countvote', votecontroller.votecounter)


router.get('/form', regusercontroller.varifymail, function (req, res) {

    // Rendering home.ejs page
    res.render('form');
})
router.get('/404', function (req, res) {

    // Rendering home.ejs page
    res.render('404', { image: image });
});
router.get('/winner', votecontroller.winner, async (req, res) => {
    const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
    const regdata = data.home.length

    res.render('winner', { mes: data, datalen: regdata });

});


router.get('/home', auth.islogin, async (req, res) => {

    // Rendering home.ejs page

    const timetbl = await timetable.findOne({ id: "639ed5d364f626a27b4deec7" })

    const headdata = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" })
    console.log("OOuuus")

    const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
    const regdata = data.home.length

    res.render('home', { mes: data, datalen: regdata, timetable: timetbl });

});
router.get('/condidant', async (req, res) => {
    const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
    const regdata = data.home.length

    // Rendering home.ejs page
    res.render('condidant', { mes: data, datalen: regdata });
});
// router.get('/login', function (req, res) {

//     // Rendering home.ejs page
//     res.render('login');
// });
router.get('/varify', function (req, res) {

    // Rendering home.ejs page
    res.render('varify');
});
// router.get('/register', function (req, res) {

//     // Rendering home.ejs page
//     res.render('register');
// });
router.get('/otp', function (req, res) {

    // Rendering home.ejs page
    res.render('otp');
});
router.post('/otp', votecontroller.otpvarify)

router.get('/about', function (req, res) {

    // Rendering home.ejs page
    res.render('about');
});

router.get('/votesuccess', function (req, res) {

    // Rendering home.ejs page
    res.render('votesuccess');
});

router.get('/sendotp', votecontroller.resendotp)

module.exports = router

