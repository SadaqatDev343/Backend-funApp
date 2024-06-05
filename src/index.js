// module imports
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// file imports
const FirebaseManager = require('./utils/firebase-manager');
const ErrorResponse = require('./utils/error-response');

// variable initializations
const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// mount routes
app.post('/api/v1/calculate', (req, res, next) => {
  const { num1: n1, num2: n2, operation } = req.body;
  if (!n1 || !n2 || !operation)
    return next(new ErrorResponse('Missing Parameters', 400));

  const num1 = Number(n1);
  const num2 = Number(n2);

  let result;

  switch (operation) {
    case '+':
    case 'add':
      result = num1 + num2;
      break;
    case '-':
    case 'subtract':
      result = num1 - num2;
      break;
    case 'x':
    case '*':
    case 'multiply':
      result = num1 * num2;
      break;
    default:
      return res.status(400).json('Invalid operation');
  }
  return res.status(200).json({ result });
});

app.post('/api/v1/send-notification', async (req, res, next) => {
  const { fcm, title, body, data } = req.body;
  await new FirebaseManager().sendNotificationToSingle({
    fcm: fcm.toString(),
    title,
    body,
    data,
  });
  return res.status(200).json({ success: true });
});

app.use('/ping', (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: 'Brother: I am live and working ' });
});
app.all('/*', (req, res) => {
  res.json({ success: false, message: ' Invalid URL' });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log(process.env.NODE_ENV.toUpperCase());

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Server shutting down gracefully.');
  process.exit(0);
});
