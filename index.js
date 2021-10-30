const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000 ;



app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffrgt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('bdTour');
        const toursCollection = database.collection('tours');
        const booking_Collection = database.collection("books");


        //Get Tours List

        app.get('/tours' , async(req , res)=>{
            const cursor = toursCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        //Add Data To Database

        app.post("/books/add", async (req, res) => {
      const tour = req.body;
      const result = await booking_Collection.insertOne(tour);
      res.json(result);
      console.log(result)
    });

    //Delete 
    app.delete('/books/:id' , async(req , res)=>{
        const id = req.params.id;
        const query = { _id: (id) };
        const result= await booking_Collection.deleteOne(query);
        console.log('this' , result)
        res.json(result);
    })

    //get booking data 
    app.get('/books' , async(req , res)=>{
        const cursor = booking_Collection.find({});
        const books = await cursor.toArray();
        res.json(books)
    })



    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/' , (req , res) =>{
    res.send('server running');
});

app.listen(port , ()=>{
    console.log('server at' , port)
})