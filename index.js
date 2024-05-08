// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

require('dotenv').config()

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// MongoDB URI
const mongoURI = process.env.MONGO_URL

// Connect to MongoDB
mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Define schema
const SubscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

// Create model
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

// Subscribe route
app.post('/subscribe', (req, res) => {
    const newSubscription = new Subscription({
        email: req.body.email,
    });

    newSubscription
        .save()
        .then((subscription) => {
            res.json(subscription);
        })
        .catch((err) => {
            res.status(400).json({ error: 'Unable to subscribe. Email may already be subscribed.' });
        });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
