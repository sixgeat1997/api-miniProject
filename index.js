require('tls').DEFAULT_MIN_VERSION = 'TLSv1'   // since TLSv1.3 default disable v1.0 
const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const app = express()
const cors = require('cors')
const router = express.Router()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))




app.post('/', (req, res) => {
    soap.createClient(url, (err, client) => {
        if (err) console.error(err);
        else {
            let user = {}
            user.username = req.body.username
            user.password = req.body.password

            // client.GetStaffDetails(user, function (err, response) {
            client.GetStudentDetails(user, function (err, response) {
                if (err) console.error(err);
                else {
                    console.log(response);
                    res.send(response);
                }
            });
        }
    });
})

app.use("*", (req, res) => res.status(404).send('404 Not found'));
app.listen(80, () => console.log('Server is ready!'))