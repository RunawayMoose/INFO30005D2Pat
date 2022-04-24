const store = require("store2");

var Patient = require("../models/patient");
var Record = require("../models/record");

exports.patientGet = async function (req, res) {
    if (!req.query.id) {
        res.redirect('/')
    } else {
        let patient = await Patient.findById(req.query.id)
        let records = await Record.find().where('_id').in(patient.record).lean().exec();
        res.render('patient', { username: patient.username, records: records })
    }
}

exports.patientPost = async function (req, res) {
    try { 
        req.body.patient = store.get('userId')
        for (var key in req.body) {
            if (req.body[key] == '') //display empty data 
                req.body[key] = "-";
        }
        let newRecord = await new Record(req.body).save();
        let patient = await Patient.findOneAndUpdate(
            { _id: store.get('userId') }, //store.get the user id saved before hand from authcontroller
            { $push: { record: newRecord._id } }); //excute the act of pushing the new record id into data base
        res.redirect('/patient' + '?id=' + store.get('userId')) //reload the page with the display of updated records
    } catch (err) {
        res.redirect('/patient' + '?id=' + store.get('userId'))
        // potential error message can be added
    }
}