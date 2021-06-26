const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectID
const app = express()
app.use(cors())
app.use(bodyParser.json())
require('dotenv').config()
const port = 5000


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhtxa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const blogsCollection = client.db("retro-tech-blogs").collection("blogs");
    const adminsCollection = client.db("retro-tech-blogs").collection("admins");

    console.log('database Connected yahoo!!!');


    app.post('/addBlogs', (req, res) => {
        const newBlogs = req.body
        console.log('adding services', newBlogs)
        blogsCollection.insertOne(newBlogs)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/blogs', (req, res) => {
        blogsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body
        console.log('adding admin', newAdmin)
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/admins', (req, res) => {
        adminsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })


    app.delete('/delete/:id', (req, res) => {
        blogsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)

            })
    })


});


app.get('/', (req, res) => {
    res.send('Hello World!!!!')
})

app.listen(process.env.PORT || port)