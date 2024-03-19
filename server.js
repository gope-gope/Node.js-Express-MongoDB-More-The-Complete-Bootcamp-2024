const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 8000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// Start server
const server = app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Uncaught Rejection! Shutting down...');
  console.log(err.name, err.message);
  // close server gracefully
  server.close(() => {
    // Uncaught exception
    process.exit(1);
  });
});
