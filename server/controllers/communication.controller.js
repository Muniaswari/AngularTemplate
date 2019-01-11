
'use strict';

var express = require('express');
var email = require('../config/email-config');
var sms = require('../config/sms-config');
//var nodemailer = require('nodemailer');
var request = require('request');

//https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs

exports.sendemail = function (req, res) {
    var nodemailer = require('nodemailer');
    console.log(req.body);
    console.log(email);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email.user,
            pass: email.password
        }
    });

    var mailOptions = {
        from: email.user,
        to: req.body.tomail,
      subject: req.body.subject,
        text: req.body.mailbody     
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.sendSms = function (req, res) {

    var http = require("http");

    var options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "/api/sendhttp.php?country=91&sender=MSGIND&route=4&mobiles=9962911185&authkey=252185AFCUE6DR35c20eb15&encrypt=&message=techbillatesting",    
        "headers": {}
    };
    console.log(options);
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();

    
    // var accessTokenUrl = sms.smsurl;
    // var token_request = "authkey={0}" +  +
    //     "&mobiles={0}" + req.body.Destination +
    //     "&message={0}" +  +
    //     "&sender={0}" + sms.senderId +
    //     "&route={0}" + sms.SMSRoute;

    // var request_length = token_request.length;

    // // Step 1. Exchange authorization code for access token.
    // request.post(accessTokenUrl, {
    //     body: token_request,
    //     headers: { 'Content-type': 'application/x-www-form-urlencoded' }
    // },
    //     function (err, response) {
    //         res.send(response);
    //     });
};
