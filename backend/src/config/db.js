const mongoose = require('mongoose');

if (process.env.USE_MEMORY_DB === 'true') {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  const connectMemoryDB = async () => {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to in-memory MongoDB at ${uri}`);
  };

  module.exports = connectMemoryDB;
} else {
  const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  };

  module.exports = connectDB;
}
