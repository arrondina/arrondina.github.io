const express = require('./node_modules/express');
const bodyParser = require('./node_modules/body-parser');
const MongoClient = require('./node_modules/mongodb').MongoClient;

const webapp = express();
webapp.use(bodyParser.json());
const uri = "mongodb+srv://lrjsales:5CC3pLqE80E3JZWq@cluster0.ackb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
        const database = client.db("BVDB");
        const userCollection = database.collection("Users");

        webapp.post('./login-form', (req, res) => {
            const formData = req.body;
            collection.insertOne(formData)
                .then(result => {
                    res.send('Data inserted successfully! YAY');
                })
                .catch(err => {
                    console.error('Error inserting Data: ', err);
                    res.status(500).send('Error inserting data');
                });
        });

        webapp.listen(3000, () => {
            console.log('Server listening on port 3000');
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB: ', err);
    });