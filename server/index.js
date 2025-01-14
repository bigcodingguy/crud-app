const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create the express app
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://beh3224:P0axjCrSPJbANHlC@crud-app.rkgaw.mongodb.net/?retryWrites=true&w=majority&appName=CRUD-APP')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('DB Connection Error: ', err));

// Basic route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// After app.use(express.json());
const crudRoutes = require('./routes/crudRoutes');
app.use('/api/todos', crudRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});