const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send('hello world')
})

router.get('/crashes', (req, res) => {
    Report.find({}, (err, reports) => {
        if (err) {
            console.log(err)
        } else {
            res.json(reports)
        }
    })
})

router.get('/user', (req, res) => {
    User.findById(req.query.token).then(user => {
        res.json(user);
    })
})

router.get('/user/resonance', (req, res) => {
    try {
        User.findById(req.query.token).then(user => {
            user.resonance_id = req.query.resonance_id;
            user.save();
            res.json({ success: true })
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/user/socket', (req, res) => {
    try {
        User.findById(req.query.token).then(user => {
            user.socket_id = req.query.socket_id;
            user.save();
            res.json({ success: true })
        })
    } catch (err) {
        console.log(err);
    }

})

router.get('/user/success', (req, res) => {
    User.findById(req.query.token).then(user => {
        user.karma = user.karma + 10;
        user.save()
        res.json({ success: true })
    })
})

router.post('/user/record', (req, res) => {
    User.findById(req.query.token).then(user => {
        user.past_records.push(req.body);
        user.save();
        res.json({ success: true })
    })
})

router.post('/report', async (req, res) => {
    const report = new Report({
        victim: req.body.victim,
        location: req.body.location,
        date: new Date()
    })
    await report.save()
    res.json({ success: true })
})

module.exports = router