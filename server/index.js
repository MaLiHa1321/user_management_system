// const express = require('express')
// const app = express()
// const cors = require('cors')
// const serverless = require("serverless-http");
// const jwt = require('jsonwebtoken');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// require('dotenv').config()
// const port = process.env.PORT || 5000;
// app.use(cors())
// app.use(express.json())
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntnzcww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const client = new MongoClient(uri, {
//   serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true,}
// });

// let userCollection;

// async function run() {
//   try {
//      await client.connect();
//    const database = client.db("User_Management");
//    userCollection = database.collection("user");
//     await userCollection.createIndex({ email: 1}, { unique: true });


// async function checkBlockedUser(req, res, next) {
//   try {
//     // Email could come from body, query, or headers depending on your frontend
//     const email = req.body.email || req.query.email;
//     if (!email) return res.status(401).json({ success: false, message: "Unauthorized: Email missing" });

//     const user = await userCollection.findOne({ email });
//     if (!user) return res.status(401).json({ success: false, message: "Unauthorized: User not found" });

//     if (user.blocked) {
//       return res.status(401).json({ success: false, message: "You are blocked. Please contact admin." });
//     }

//     next();
//   } catch (err) {
//     console.error("Middleware error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// }

// function extractUserData(req) {
//   const { name, email, password } = req.body;
//   return { name, email, password, blocked: false };
// }

// function getRequestIds(req) {
//   return req.body.ids;
// }

// function validateIdArray(ids) {
//   return Array.isArray(ids) && ids.length > 0;
// }

// function toObjectIds(ids) {
//   return ids.map(id => new ObjectId(id));
// }

// function sendError(res, status, msg) {
//   res.status(status).json({ success: false, message: msg });
// }

// function sendSuccess(res, data) {
//   res.status(200).json({ success: true, ...data });
// }

// function logAndSendServerError(res, label, err) {
//   console.error(`${label} error:`, err);
//   res.status(500).json({ success: false, message: "Server error" });
// }
// app.post("/register", async (req, res) => {
//   try {
//     const userData = extractUserData(req);
//     const existingUser = await userCollection.findOne({ email: userData.email, name:userData.name });
//     if (existingUser) return sendError(res, 400, "User already registered with this email.");
//     const result = await userCollection.insertOne(userData);
//     res.status(201).json({ insertedId: result.insertedId, success: true });
//   } catch (err) {
//     logAndSendServerError(res, "Registration", err);
//   }
// });
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userCollection.findOne({ email });
//     if (!user || user.password !== password) return sendError(res, 401, "Invalid email or password");
//     if (user.blocked) return sendError(res, 401, "User is blocked and cannot login.");
//     const lastLogin = new Date();
//     await userCollection.updateOne({ email }, { $set: { lastLogin } });
//     sendSuccess(res, { user: { name: user.name, email, lastLogin } });
//   } catch (err) {
//     logAndSendServerError(res, "Login", err);
//   }
// });
//  app.get("/users", checkBlockedUser, async (req, res) => {
//   try {
//    const users = await userCollection.find().toArray();
//    res.status(200).json(users);
//   } catch (err) {
//     console.error(err);
//    res.status(500).json({ message: "Server error" });
//  }
// });
// app.delete("/users", async (req, res) => {
//   try {
//     const ids = getRequestIds(req);
//     if (!validateIdArray(ids)) return sendError(res, 400, "Invalid ID list");
//     const objectIds = toObjectIds(ids);
//     const result = await userCollection.deleteMany({ _id: { $in: objectIds } });
//     sendSuccess(res, { deletedCount: result.deletedCount });
//   } catch (err) {
//     logAndSendServerError(res, "Deletion", err);
//   }
// });
// app.patch("/users/block", async (req, res) => {
//   try {
//     const ids = getRequestIds(req);
//     if (!validateIdArray(ids)) return sendError(res, 400, "No user IDs provided");
//     const objectIds = toObjectIds(ids);
//     const result = await userCollection.updateMany({ _id: { $in: objectIds } }, { $set: { blocked: true } });
//     sendSuccess(res, { modifiedCount: result.modifiedCount });
//   } catch (err) {
//     logAndSendServerError(res, "Block", err);
//   }
// });
// app.patch("/users/unblock", async (req, res) => {
//   try {
//     const ids = getRequestIds(req);
//     if (!validateIdArray(ids)) return sendError(res, 400, "No user IDs provided");
//     const objectIds = toObjectIds(ids);
//     const result = await userCollection.updateMany({ _id: { $in: objectIds } }, { $set: { blocked: false } });
//     sendSuccess(res, { modifiedCount: result.modifiedCount });
//   } catch (err) {
//     logAndSendServerError(res, "Unblock", err);
//   }
// });
//    // await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//      // await client.close();
//   }
// }
// run().catch(console.dir);
// app.get('/', (req, res) => {
//   res.send('User Managemnet are on live')
// })
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntnzcww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let userCollection;

async function run() {
  try {
    await client.connect();
    const database = client.db("User_Management");
    userCollection = database.collection("user");
    await userCollection.createIndex({ email: 1 }, { unique: true });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run().catch(console.dir);

// Middleware: Blocked user check
async function checkBlockedUser(req, res, next) {
  try {
    const email = req.body.email || req.query.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized: Email missing" });

    const user = await userCollection.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized: User not found" });

    if (user.blocked) {
      return res.status(401).json({ success: false, message: "You are blocked. Please contact admin." });
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Helper functions
function extractUserData(req) {
  const { name, email, password } = req.body;
  return { name, email, password, blocked: false };
}

function getRequestIds(req) {
  return req.body.ids;
}

function validateIdArray(ids) {
  return Array.isArray(ids) && ids.length > 0;
}

function toObjectIds(ids) {
  return ids.map(id => new ObjectId(id));
}

function sendError(res, status, msg) {
  res.status(status).json({ success: false, message: msg });
}

function sendSuccess(res, data) {
  res.status(200).json({ success: true, ...data });
}

function logAndSendServerError(res, label, err) {
  console.error(`${label} error:`, err);
  res.status(500).json({ success: false, message: "Server error" });
}

// Routes
app.post("/register", async (req, res) => {
  try {
    const userData = extractUserData(req);
    const existingUser = await userCollection.findOne({ email: userData.email });
    if (existingUser) return sendError(res, 400, "User already registered with this email.");
    const result = await userCollection.insertOne(userData);
    res.status(201).json({ insertedId: result.insertedId, success: true });
  } catch (err) {
    logAndSendServerError(res, "Registration", err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userCollection.findOne({ email });
    if (!user || user.password !== password) return sendError(res, 401, "Invalid email or password");
    if (user.blocked) return sendError(res, 401, "User is blocked and cannot login.");
    const lastLogin = new Date();
    await userCollection.updateOne({ email }, { $set: { lastLogin } });
    sendSuccess(res, { user: { name: user.name, email, lastLogin } });
  } catch (err) {
    logAndSendServerError(res, "Login", err);
  }
});

app.get("/users", checkBlockedUser, async (req, res) => {
  try {
    const users = await userCollection.find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/users", async (req, res) => {
  try {
    const ids = getRequestIds(req);
    if (!validateIdArray(ids)) return sendError(res, 400, "Invalid ID list");
    const objectIds = toObjectIds(ids);
    const result = await userCollection.deleteMany({ _id: { $in: objectIds } });
    sendSuccess(res, { deletedCount: result.deletedCount });
  } catch (err) {
    logAndSendServerError(res, "Deletion", err);
  }
});

app.patch("/users/block", async (req, res) => {
  try {
    const ids = getRequestIds(req);
    if (!validateIdArray(ids)) return sendError(res, 400, "No user IDs provided");
    const objectIds = toObjectIds(ids);
    const result = await userCollection.updateMany({ _id: { $in: objectIds } }, { $set: { blocked: true } });
    sendSuccess(res, { modifiedCount: result.modifiedCount });
  } catch (err) {
    logAndSendServerError(res, "Block", err);
  }
});

app.patch("/users/unblock", async (req, res) => {
  try {
    const ids = getRequestIds(req);
    if (!validateIdArray(ids)) return sendError(res, 400, "No user IDs provided");
    const objectIds = toObjectIds(ids);
    const result = await userCollection.updateMany({ _id: { $in: objectIds } }, { $set: { blocked: false } });
    sendSuccess(res, { modifiedCount: result.modifiedCount });
  } catch (err) {
    logAndSendServerError(res, "Unblock", err);
  }
});

app.get('/', (req, res) => {
  res.send('User Management API is live');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
