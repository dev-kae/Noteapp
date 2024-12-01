const express = require('express');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/notes', notesRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
