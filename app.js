require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Student = require('./models/Student');
 // your uploaded file is Student.js in project root

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,)

  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // support PUT & DELETE via ?_method=PUT
app.use(express.static('public'));

// ---------- Routes ----------

// Index - list students (READ)
app.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render('index', { students });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// New form (CREATE - form)
app.get('/students/new', (req, res) => {
  res.render('new');
});

// Create (CREATE - action)
app.post('/students', async (req, res) => {
  try {
    const { name, age, course, photo } = req.body;
    await Student.create({ name, age: age ? Number(age) : undefined, course, photo });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).send('Failed to create student');
  }
});

// Show single student (READ)
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.render('show', { student });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit form (UPDATE - form)
app.get('/students/:id/edit', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    res.render('edit', { student });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update (UPDATE - action)
app.put('/students/:id', async (req, res) => {
  try {
    const { name, age, course, photo } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, age: age ? Number(age) : undefined, course, photo }, { runValidators: true });
    res.redirect(`/students/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(400).send('Failed to update student');
  }
});

// Delete (DELETE)
app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete student');
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
