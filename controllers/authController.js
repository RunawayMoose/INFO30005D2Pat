const bcrypt = require('bcryptjs');
const store = require("store2");

var Patient = require("../models/patient");


exports.loginPost = function (req, res) {
    const { username, password } = req.body; //callback,promise,async await**********
    Patient.findOne({ username: username }).then((patient) => { //.then to continue working on the promise before this, either resolve or reject the promise.
        if (!patient) {
            res.redirect('/login'); //if not find return to the login page without error message
        } else {
            bcrypt.compare(password, patient.password, (err, isMatch) => { //compare checks the submitted password with the password stored in the database
                if (isMatch) { 
                    store.set('userId', patient._id)// userID is key and patient.id is value
                    res.redirect('/patient' + '?id=' + patient._id) // store the specific patient id in the URL
                }
            })
        }
    })
}

exports.registerPost = function (req, res) {
    const { username, password } = req.body;
    Patient.findOne({ username: username }).then((patient) => {
        if (patient) {
            res.status(409).alert({ error: 'Username already exists' });
        } else {
            const newPatient = new Patient({
                username,
                password
            });
            bcrypt.genSalt(10, (err, salt) => {//gensalt function 
                bcrypt.hash(newPatient.password, salt, (err, hash) => { //hash for encryption
                    if (err) throw err;
                    newPatient.password = hash; //convert the submitted password into encrypted format
                    newPatient.save().then((patient) => { //the process of saving is also a promise
                        res.redirect('/login')
                    })
                })
            })
        }
    });
}