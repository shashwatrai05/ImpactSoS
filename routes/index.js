const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => { res.redirect('/register') })

router.get('/register', (req, res) => {
    res.render('register')
});

router.post('/register', async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        phone_number: req.body.phone_number,
        gender: req.body.gender,
        blood_group: req.body.blood_group,
        emergency_contact: req.body.emergency_contact,
        alert_time: req.body.alert_time
    });
    let user = await newUser.save()
    res.json({success: true, accessToken: user._id})
})

router.get('/dashboard', (req, res) => {
    res.render("dashboard")
})

router.get('/dashinfo', async (req, res) => {
    const user = await User.findById(req.query.accessToken)
    res.json({success: true, user: user})
})

router.get('/alert', (req, res) => {
    res.render("alert")
})

router.get('/phone', (req, res) => {
    res.send("Please open this website on your phone's browser.");
})

module.exports = router