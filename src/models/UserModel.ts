const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoURI = 'mongodb://127.0.0.1:27017/founditpracticedb';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    // Start your server or perform other operations
  })
  .catch((error : any) => {
    console.error('MongoDB connection error:', error);
    // Handle the connection error
  });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'items',
    },
  ],
  img: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
