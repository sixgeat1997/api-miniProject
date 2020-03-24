require('tls').DEFAULT_MIN_VERSION = 'TLSv1'   // since TLSv1.3 default disable v1.0 
const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const app = express()
const cors = require('cors')


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let posts = [
    { 'id': 0, 'activity': 'Open house', 'address': 'male domitory', 'date': '12/4/63', 'name': 'Por', 'hours': 3, 'people': 20 },
    { 'id': 1, 'activity': 'Open house', 'address': 'male domitory', 'date': '12/4/63', 'name': 'Por', 'hours': 3, 'people': 50 }
]

app.get('/', (req, res) => {
    res.json(posts)
})

app.post('/post', (req, res) => {
    var post = {}
    post.id = posts.length > 0 ? posts[posts.length - 1].id + 1 : 0
    post.activity = req.body.activity
    post.address = req.body.address
    post.date = req.body.date
    post.name = req.body.name
    post.hours = +req.body.hours
    post.people = +req.body.people
    posts.push(post)
    res.json({ message: "success" })
})

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

app.put('/update/:id_post', (req, res) => {
    let id = req.params.id_post
    let index = posts.findIndex(p => (p.id === +id))
    posts[index].activity = req.body.activity
    posts[index].address = req.body.address
    posts[index].date = req.body.date
    posts[index].name = req.body.name
    posts[index].hours = +req.body.hours
    posts[index].people = +req.body.people
    res.json({ message: 'post updated!' + req.params.id_post });
})

app.delete('/delete/:id_post', (req, res) => {
    let id = req.params.id_post
    let index = posts.findIndex(p => p.id === +id)
    posts.splice(index, 1)
    res.json({ message: 'Post deleted: ' + req.params.bear_id });
})

app.use("*", (req, res) => res.status(404).send('404 Not found'));
app.listen(80, () => console.log('Server is ready!'))