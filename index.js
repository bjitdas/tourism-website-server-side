const { MongoClient } = require('mongodb');
const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

//connecting mongodb app

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odmwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

  try {
    await client.connect();
    const database = client.db('tourismPark');
    const servicesCollection = database.collection('database');
    const bookingCollection = database.collection('orders');

    // GET API

    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();

      res.send(services)
    })

    // Get Single Service

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const service = await servicesCollection.findOne(query);

      res.json(service)
    })

    //Get orders api
    app.get('/orders', async (req, res) => {
      const cursor = bookingCollection.find({});
      const orders = await cursor.toArray()

      res.json(orders)
    })


    // POST API

    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service)

      res.json(result)
    })

    //POST BOOKING API

    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await bookingCollection.insertOne(order);

      res.json(result)
    })

    // Delete an order api

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await servicesCollection.deleteOne(query);
      res.json(result)
    })



  }
  finally {
    // await client.close();
  }

}

run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})