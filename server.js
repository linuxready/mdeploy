const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
let db;

async function go() {
    try {
        let client = new MongoClient('mongodb+srv://yama:colourblue@buster.dwwxlkq.mongodb.net/ToDoApp?retryWrites=true&w=majority&appName=buster', { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db('ToDoApp');
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

go();

app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    try {
        let items = await db.collection('items').find().toArray();
        res.send(`<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
              <form method="POST" action="/create-item">
                <div class="d-flex align-items-center">
                  <input name="item" autofocus autocomplete="off" placeholder="What needs doing?" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form> 
            </div>
            
            <ul class="list-group pb-5">
            ${items.map(function (item) {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${item.text}</span>
                <div>
                  <button  data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                  <button class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
              </li>`
        }).join('')}
          </ul>
          </div>
        </body> 
        </html>`);
    } catch (error) {
        res.status(500).send('An error occurred while retrieving items');
        console.error('Failed to retrieve items', error);
    }
});

app.post('/create-item', async (req, res) => {
    try {
        await db.collection('items').insertOne({ text: req.body.item });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('An error occurred while creating item');
        console.error('Failed to create item', error);
    }
});
