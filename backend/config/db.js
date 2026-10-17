const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded first
dotenv.config();

const DB_FILE = path.join(__dirname, '../data/db.json');
const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultData = {
  users: [],
  sessions: [],
  history: [],
  activities: []
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
}

let isMongoConnected = false;

// Register Mongoose Connection Lifecycle Event Listeners
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('🍃 MongoDB Mongoose Connection established successfully.');
});

mongoose.connection.on('error', (err) => {
  isMongoConnected = false;
  console.error('⚠️ MongoDB Connection Error:', err.message || err);
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.warn('⚠️ MongoDB Mongoose Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isMongoConnected = true;
  console.log('🔄 MongoDB Mongoose Connection reconnected.');
});

// Configure Mongoose Connection Manager
async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prep_ai';

  if (!mongoURI || typeof mongoURI !== 'string') {
    console.error('❌ Invalid MONGODB_URI configuration in backend/.env file.');
    return false;
  }

  // Disable command buffering so operations fail fast if DB is down instead of hanging HTTP requests
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
      autoIndex: true
    });

    isMongoConnected = mongoose.connection.readyState === 1;
    const hostInfo = conn.connection.host || 'local';
    const dbName = conn.connection.name || 'prep_ai';
    console.log(`✅ MongoDB Connection Verified -> Host: ${hostInfo} | Database: ${dbName}`);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ Primary MongoDB Connection Warning: ${err.message}. Enabling resilient storage fallback engine.`);
    return false;
  }
}

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

async function disconnectDB() {
  if (mongoose.connection && mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
      isMongoConnected = false;
      console.log('🔌 MongoDB connection closed gracefully.');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  }
}

// Resilient Backup File DB Engine for high availability
class JsonDB {
  static isConnected() {
    return isDbConnected();
  }

  static read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return defaultData;
    }
  }

  static write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Error writing to backup DB file:', e);
    }
  }

  static getCollection(name) {
    const data = this.read();
    return data[name] || [];
  }

  static saveToCollection(name, item) {
    const data = this.read();
    if (!data[name]) data[name] = [];
    const index = data[name].findIndex(i => i.id === item.id || (i.sessionId && i.sessionId === item.sessionId));
    if (index >= 0) {
      data[name][index] = item;
    } else {
      data[name].push(item);
    }
    this.write(data);
    return item;
  }

  static findById(name, id) {
    const items = this.getCollection(name);
    return items.find(i => i.id === id || i.sessionId === id);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  isDbConnected,
  JsonDB,
  getCollection: (name) => JsonDB.getCollection(name),
  saveToCollection: (name, item) => JsonDB.saveToCollection(name, item),
  findById: (name, id) => JsonDB.findById(name, id)
};
