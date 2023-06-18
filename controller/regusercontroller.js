
const reguser = require('../models/regituser');
const loguser = require('../models/login');
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const { updateOne, rawListeners } = require('../models/coonection');
const user = require('../models/user');
const config = require('../config/config')
const randomstring = require('randomstring')
const timetable = require('../models/timetable')
const fs = require('fs');
const header=require('../models/header')

const data = fs.readFileSync('./api/nsdlapi.json', 'utf-8')
const objdata = JSON.parse(data)





const securepassword = async (password) => {
    try {
        const passhash = await bcrypt.hash(password, 8);
        return passhash;

    } catch (error) {
        console.log(error.message)

    }

}
const varifymail = async (req, res) => {
    try {
        const updateinfo = await reguser.updateOne({ _id: req.query.id }, { $set: { is_varified: 1 } })
        console.log(updateinfo)
        console.log(req.query.id)
        res.render("login")


    } catch (error) {
        console.log("er")

    }

}

const sendvarifymail = async (name, email, user_id) => {


    try {

        const transprter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: config.smtpmail,
                pass: config.smtppassword

            }
        });


        const mailOption = {
            from: config.smtpmail,
            to: email,
            subject: 'For mail varification ',
            html: '<p> hii  ' + name + '   please click here to varifie <a onClick="varifymail();" href="http://localhost:5000/form?id=' + user_id + '">verify mail</a> your account that its you.and your id is' + user_id + '</p>'

        }
        transprter.sendMail(mailOption, function (error, info) {
            if (error) {

                console.log(error, "have error of mail")
            }
            else {
                console.log(info.response);
            }
        })

    } catch (error) {
        console.log("error to sending mail")

    }

}

const loadregister = async (req, res) => {
    try {

        res.render('register')

    }
    catch (error) {
        console.log("it haves error");
    }
}

//loginload


const insertreguser = async (req, res) => {
    try {

        const ps = await securepassword(req.body.password);
        const Reguser = new reguser({

            firstname: req.body.fname,
            lastname: req.body.lname,
            birthday: req.body.Birthday,
            gender: req.body.gender,
            email: req.body.email,
            password: ps,
            state: req.body.state,
            city: req.body.city,
            image: req.file.image,
            phone: req.body.phone,
            is_admin: 0
        });
        const email = req.body.email;
        const name = req.body.firstname;




        const userdata = await reguser.findOne({ email: email })



        if (!userdata) {
            const regdata = await Reguser.save();
            console.log(email)

            if (regdata) {
                sendvarifymail(req.body.fname, req.body.email, regdata._id);
                res.render('varify', { fnm: email })
                if (regdata.is_varified === 1) {
                    res.render('home', { name: name })
                    console.log("varified")
                }
            }
            else {
                res.render('register', { message: "failed to varify" })
            }


        }
        else {
            res.render('register', { message: "Email alredy exist,Please use another one!!!! " })
            console.log("email already exist")


        }
    } catch (error) {
        console.log(error.message)

    }
}


//loginvarify

const loadlogin = async (req, res) => {
    try {
        res.render('login')

    }
    catch (error) {
        console.log("kndkk")
    }
}
const loadforgot = async (req, res) => {
    try {
        res.render('forgot')

    }
    catch (error) {
        console.log("kndkk")
    }
}





const loadforgotpass = async (req, res) => {
    try {
        const token = req.query.token;
        const tokendata = await reguser.findOne({ token: token })
        console.log(token)
        console.log(tokendata._id)

        if (tokendata) {
            res.render('forgotpass', { user_id: tokendata._id })

            console.log("ifdata")
        }
        else {

            res.render('404', { message: "Token is invalid" })
            console.log("invalid")

        }

    }
    catch (error) {
        console.log("kndkkerror of id", error)
    }
}


const resetpasss = async (req, res) => {

    try {
        
        const pass = req.body.password;
        const user_id = req.body.user_id;
        const securepass = await securepassword(pass)

        console.log(pass)
        const updatepass = await reguser.findByIdAndUpdate({ _id: user_id }, { $set: { password: securepass, token: '' } })
        console.log(updatepass)

        res.render('login')







    } catch (error) {
        console.log(error)

    }
}

const loginvarify = async (req, res) => {
    try {



        const ps = await securepassword(req.body.password);
        const Loguser = new loguser({

            email: req.body.email,
            password: ps,
            logintime: Date.now()


        })
        const logdata = await Loguser.save();

        const password = req.body.password
        const email = req.body.email



        const userdata = await reguser.findOne({ email: email })



        if (userdata) {
            const passcheck = await bcrypt.compare(password, userdata.password)

            if (passcheck) {
                if (userdata.is_varified === 0) {
                    res.render('login', { message: "Please varify your mail!!!!" })
                }
                else {
                    const name = userdata.firstname
                    console.log(name)
                
                    //const data=timetable.Rounds;
                    const timetbl=await timetable.findOne({id:"639ed5d364f626a27b4deec7"})

                    const data=await header.findOne({_id:"638c7c72a61fd2cdfb3d8c68"});
                    const regdata= data.home.length
                    
                    req.session.user_id = userdata._id;
                    res.render('home', { name: name,mes:data,datalen:regdata,timetable:timetbl });

                }

            }
            else {
                res.render('login', { message: "email or password is incorrect!!!!" })
            }

        }
        else {
            res.render('login', { message: "email and password is incorrect!!!!" })

        }

    } catch (error) {
        console.log("log error", error)

    }
}


const timetables = async (req, res) => {


    try {





    } catch (error) {

    }
}


const logoutuser = async (req, res) => {


    try {
        const email = req.body.email;
        const updatedata = await loguser.updateOne({ $set: { logouttime: Date.now() } })

        console.log(updatedata)
        const b = req.session.destroy();

        if (b) {
            res.redirect("login")
        }



    } catch (error) {
        console.log("logout error", error)

    }
}



const sendresetmail = async (name, email, token) => {


    try {

        const transprter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: config.smtpmail,
                pass: config.smtppassword

            }
        });


        const mailOption = {
            from: config.smtpmail,
            to: email,
            subject: 'For reset  password ',
            html: '<p> hii  ' + name + '   please click here to  <a href="http://localhost:5000/forgotpass?token=' + token + '">Reset</a> your password' + token + '</p>'

        }
        transprter.sendMail(mailOption, function (error, info) {
            if (error) {

                console.log(error, "have error of mail")
            }
            else {
                console.log(info.response);
            }
        })

    } catch (error) {
        console.log("error to sending mail")

    }

}




const forgetvarify = async (req, res) => {

    try {

        const email = req.body.email;
        console.log(email)
        const userdata = await reguser.findOne({ email: email })

        if (userdata) {


            const token = randomstring.generate()
            if (userdata.is_varified === 0) {
                res.render("forgot", { message: "Please varify your mail first" })

            }
            else {
                const updatedata = await reguser.updateOne({ email: email }, { $set: { token: token } })

                sendresetmail(userdata.firstname, userdata.email, token)
                res.render("forgot", { message: "Check your mail to reset your password" })



            }


        }
        else[
            res.render("forgot", { message: "Incorrect email  address please enter correct mail" })
        ]



    } catch (error) {
        console.log(error)

    }
}
module.exports = {
    loadregister,
    insertreguser,
    varifymail,
    loadlogin,
    loginvarify,
    logoutuser,
    forgetvarify,
    loadforgot,
    loadforgotpass,
    resetpasss,

}