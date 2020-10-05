const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const nodemailer = require("nodemailer");

const mongoose = require('mongoose')
const User = require('../model/userRegister')

mongoose.connect('mongodb://localhost:27017/authdb', { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (!error) {
        console.log("Connection Success");
    }
    else {
        console.log("connection Not success");
    }
});

router.get('/', (req, res) => {
    res.send('Sever Say Hii')
})

router.post('/register', (req, res) => {
    console.log('regData=', req.body, req.body.status = 0)
    let userData = req.body
    User.find({ username: userData.username }, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            if (user.length > 0) {
                res.send(false);
            }
            else {
                let user = new User(userData, userData.status = 0)
                user.save((error, reguser) => {
                    if (error) {
                        console.log(error)
                    } else {
                        let payload = { subject: reguser._id }
                        let token = jwt.sign(payload, 'secret')
                        res.status(200).send({ token:token, status:true })
                        // sendMail(user, info => {
                        //     console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
                        //     res.send(info);
                        // });
                    }
                })
            }
        }

    })
})

router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({ username: userData.username }, (error, user) => {
        if (error) {
            console.log(error)
        } else {
            if (!user) {
                res.status(401).send('Invalid Email')
            } else {
                if (user.password !== userData.password) {
                    res.status(401).send('Invalid Password')
                } else {
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'secret')
                    res.status(200).send({ token })
                }
            }
        }
    })
})

router.post('/event', verifyToken, (req, res) => {
    let events = ["user", "Ravi"]
    res.json(events)

})

router.post('/special', verifyToken, (req, res) => {
    let events = ["user"]
    res.json(events)
})

function verifyToken(req, res, next) {
    if (!req.headers.authoriaztion) {
        return res.status(401).send('unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('unauthorized user')
    }
    let payload = jwt.verify(token, 'secret')
    if (!payload) {
        return res.status(401).send('unauthorized user')
    }
    req.userId = payload.subject
    next()
}



async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'rkbk1997@gmail.com',
            pass: 'shyamsundarlal'
        }
    });

    let mailOptions = {
        from: '"No _reply"<example.gimail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Wellcome User 👻", // Subject line
        html: `<h1>Hi ${user.email}</h1><br>
              <p>Your Account Conform link-</p>
              <a href='http://localhost:4201/${user.email}'>Click Here..</a>
              <h4>Thanks for joining us</h4>`
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    callback(info);
}




module.exports = router;