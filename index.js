const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();



app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pyz6p0u.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const serviceCollection = client.db('healYourHeart').collection('services');
        const reviewCollection = client.db('healYourHeart').collection('reviews');
        const myServiceCollection = client.db('healYourHeart').collection('myServices');


        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const detail = await serviceCollection.findOne(query);
            res.send(detail);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;

            const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });

            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        // my added services
        app.post('/myServices', async (req, res) => {
            const service = req.body;
            const result = await myServiceCollection.insertOne(service);
            res.send(result);
        });

        app.get('/myServices', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = myServiceCollection.find(query);
            const myServices = await cursor.toArray();
            res.send(myServices);
        });

    }

    finally {

    }
}
run().catch(err => console.log(err));







app.get('/', (req, res) => {
    res.send("Heal you heart server running...")
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})