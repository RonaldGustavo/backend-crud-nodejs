const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const app = express();
const morgan = require('morgan');

// const serviceAccount = require('dboproject-fafd1-firebase-adminsdk-jo9x6-7ebc67cfe5.json');

const corsOptions = {
  origin: '*',
};

// register cors middleware
app.use(cors(corsOptions));
true;

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// connect to db
db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('database connected'))
  .catch((err) => {
    console.log(`gagal konek ${err.message}`);
    process.exit();
  });

// membuat routes
app.get('/', (req, res) => {
  res.json({ message: 'hello world letsgo' });
});

//memangil route
require('./app/routes/todolist.route')(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
