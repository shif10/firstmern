var express = require('express');
const loguser = require('../models/login')
const reguser = require('../models/regituser')
const alert = require('../views/js/votid')
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");
const wins = require("../models/winner")
const config = require('../config/config')
//const timetable = require('./models/timetable')
var app = express();
const mongoose = require('mongoose');//Routes
const User = require('../models/user')
const addcond = require('../addcond')
const condidates = require('../models/condidates')
const AdminBroExpressjs = require('admin-bro-expressjs')
//const url = `mongodb://localhost:27017/mydb`;
const url = `mongodb+srv://shifa:shifamemon@cluster0.xlq4f7s.mongodb.net/mydb?retryWrites=true&w=majority`;
const fs = require("fs");
const data = fs.readFileSync('./api/nsdlapi.json', 'utf-8')
const objdata = JSON.parse(data)
const votes = require('../models/votes')
const countvotes = require('../models/votescount')
const header = require('../models/header')
const alertt = require("alert")




const vote = async (req, res) => {

  try {
    const voteid = req.body.voteid;
    console.log(voteid)

    var id = req.session.user_id
    const userdata = await reguser.findOne({ _id: id })
    const email = userdata.email
    const name = userdata.firstname
    var i = 0
    console.log(objdata.length)
    for (i = 0; i < objdata.length; i++) {
      var mm = objdata[i].member_id
      if (mm == voteid) {

        var otp = Math.floor(1000 + Math.random() * 900000);

        const updatedata = await reguser.updateOne({ email: email }, { $set: { otp: otp } })
        console.log(updatedata)

        sendotp(name, email, otp)
        console.log("matched")
        console.log(mm)
        console.log(otp)

        res.render("otp", { message: email })

        break;
      }
      else {

        console.log("not matched")



      }



    }
    const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
    const regdata = data.home.length
    res.render("voteid", { message: "Please enter  your  valid id!!!", mes: data, datalen: regdata })


  } catch (error) {
    console.log(error)

  }





}

const otpvarify = async (req, res) => {

  try {


    var id = req.session.user_id

    const userdata = await reguser.findOne({ _id: id })
    const email = userdata.email
    const name = userdata.firstname
    const otp = userdata.otp
    const bodyotp = req.body.otp
    console.log("otp is", otp)
    console.log("bodyotp is", bodyotp)
    const alldata = await condidates.find({})
    console.log(alldata.firstname)

    const a = 3
    console.log(bodyotp)
    if (otp == bodyotp) {
      const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
      const regdata = data.home.length

      res.render("condidant", { alldata: alldata, mes: data, datalen: regdata })
      const updatedata = await reguser.updateOne({ email: email }, { $set: { otp: '' } })
      console.log("otp succesfull", updatedata)
    }
    else {
      console.log("have error to match")
    }
  }
  catch (error) {
    console.log(error)

  }

}


const sendotp = async (name, email, otp) => {


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
      subject: 'Otp variification ',
      html: '<p> Hii ' + name + '  your one time otp password is  <h4>  ' + otp + ' </h4> do not share it with anyone</p>'

    }
    transprter.sendMail(mailOption, function (error, info) {
      if (error) {

        console.log(error, "have error of otp")
      }
      else {
        console.log(info.response, "done otpresend");
      }
    })

  } catch (error) {
    console.log("error to sending otp", error)

  }

}

const resendotp = async (req, res) => {
  try {
    var id = req.session.user_id
  const userdata = await reguser.findOne({ _id: id })
  const email = userdata.email
  const name = userdata.firstname
  var otp = Math.floor(1000 + Math.random() * 900000);
  const updatedata = await reguser.updateOne({ email: email }, { $set: { otp: otp } })
  sendotp(name, email, otp)
  res.render("otp",{ message: email })
    
  } catch (error) {
    console.log(error)
    
  }
  

}

const votecounter = async (req, res) => {



  try {

    const cond_id = req.body.member_id
    const voter_id = req.session.user_id

    const votecount = new votes({


      c_id: cond_id,
      v_id: voter_id


    });







    const cvote = new countvotes({


      c_id: cond_id,
      number: 0,



    });
    const founddata = await votes.findOne({ v_id: voter_id })



    const foundcvote = await countvotes.findOne({ c_id: cond_id })
    if (!founddata) {
      const savevote = await votecount.save()
      console.log("data saved")

      if (!foundcvote) {


        const savecvotes = await cvote.save()
        console.log("saves", savecvotes)

        const number = savecvotes.number
        console.log(savecvotes)

        const updatedata = await countvotes.updateOne({ c_id: cond_id }, { $set: { number: number + 1 } })
        console.log(updatedata)
        res.render("votesuccess")
        console.log('id inserted')

      }
      else {
        const foundcvote = await countvotes.findOne({ c_id: cond_id })
        const number = foundcvote.number
        const updatedata = await countvotes.updateOne({ c_id: cond_id }, { $set: { number: number + 1 } })
        console.log(updatedata)
        res.render("votesuccess")
        console.log("id have but ins")
      }
    }

    else {
      const data = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
      const regdata = data.home.length
      res.render("voteid", { message: "You can vote only once !", mes: data, datalen: regdata })


    }
  }

  catch (error) {
    console.log(error)

  }




}
const winner = async (req, res) => {

  try {

    const maxvote = []
    const max = await countvotes.find()
    for (var i = 0; i < max.length; i++) {
      maxvote.push(max[i].number)
      maxvote.sort(function (a, b) {
        return a - b;
      });
      maxvote.reverse()

    }
    console.log(maxvote)
    let [m1, m2] = maxvote
    console.log(m1, m2)


    const winnersid1 = await countvotes.findOne({ number: m1 })
    const winnersid2 = await countvotes.findOne({ number: m2 })
    max1win = winnersid1.c_id
    max2win = winnersid2.c_id
    console.log("1", max1win)


    const getwin1 = await condidates.findOne({ _id: max1win })
    const getwin2 = await condidates.findOne({ _id: max2win })
    let winarr = [getwin1, getwin2]
    for (var k = 0; k <= winarr.length - 1; k++) {

      const savewin = new wins({
        name: winarr[k].name,
        share: winarr[k].share,
        email: winarr[k].email,
        image: winarr[k].image



      })

      const onewin = await wins.findOne({ email: winarr[k].email })
      const regdata = await wins.estimatedDocumentCount();
      if (!onewin & regdata <= 2) {
        const savewindata = await savewin.save()
        console.log(savewindata)
      }
      else {
        console.log("already have data")
      }
    }

    const data2 = await header.findOne({ _id: "638c7c72a61fd2cdfb3d8c68" });
    const regdata2 = data2.home.length

    res.render('winner', { mes: data2, datalen: regdata2, winarr: winarr });





  } catch (error) {
    console.log(error)

  }




}

module.exports = {

  vote,
  otpvarify,
  votecounter,
  winner,
  sendotp,
  resendotp
}
