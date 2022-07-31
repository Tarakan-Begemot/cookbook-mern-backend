const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');
const cors = require('cors');
const e = require('express');
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
    db = getDb();
  }
});

app.get('/', (req, res) => {
  res.send('All good');
});

app.get('/recipes', (req, res) => {
  let recipes = [];

  db.collection('recipes')
    .find()
    .sort({ title: 1 })
    .forEach((recipe) => recipes.push(recipe))
    .then(() => {
      res.status(200).json(recipes);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch' });
    });
});

app.get('/recipes/:recipe', (req, res) => {
  let recipe = req.params.recipe
    .replaceAll('-', ' ')
    .split(' ')
    .map((el) => el.charAt(0).toUpperCase() + el.slice(1))
    .join(' ');
  console.log(recipe);

  db.collection('recipes')
    .findOne({ title: recipe })
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((err) => {
      res.status(500).json({ err: 'Can not fetch recipe' });
    });
});

// app.post('/add_recipe', (req, res) => {
//   const recipe = req.body;

//   db.collection('recipes')
//     .insertOne(recipe)
//     .then((result) => {
//       res.status(201).json(result);
//     })
//     .catch((err) => {
//       res.status(500).json({ err: 'Could not create a new recipe' });
//     });
// });

// app.delete('/recipes/:recipe', (req, res) => {
//   if (ObjectId.isValid(req.params.recipe)) {
//     db.collection('recipes')
//       .deleteOne({ _id: ObjectId(req.params.recipe) })
//       .then((recipe) => {
//         res.status(200).json(recipe);
//       })
//       .catch((err) => {
//         res.status(500).json({ err: 'Can not delete recipe' });
//       });
//   } else {
//     res.status(500).json({ error: 'Not valid recipe name' });
//   }
// });

// app.patch('/recipes/:recipe', (req, res) => {
//   const updates = req.body;

//   if (ObjectId.isValid(req.params.recipe)) {
//     db.collection('recipes')
//       .updateOne({ _id: ObjectId(req.params.recipe) }, { $set: updates })
//       .then((recipe) => {
//         res.status(200).json(recipe);
//       })
//       .catch((err) => {
//         res.status(500).json({ err: 'Can not update recipe' });
//       });
//   } else {
//     res.status(500).json({ error: 'Not valid recipe name' });
//   }
// });
