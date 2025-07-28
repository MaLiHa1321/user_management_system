const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntnzcww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

     await client.connect();
   const database = client.db("User_Management");
   const userCollection = database.collection("user");


   // latest code
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


// register user
app.post("/register", async (req, res) => {
  try {
    const userData = extractUserData(req);
    const result = await userCollection.insertOne(userData);
    res.status(201).json({ insertedId: result.insertedId, success: true });
  } catch (err) {
    logAndSendServerError(res, "Registration", err);
  }
});

// login user
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

// get all user
 app.get("/users", async (req, res) => {
  try {
   const users = await userCollection.find().toArray();
   res.status(200).json(users);
  } catch (err) {
    console.error(err);
   res.status(500).json({ message: "Server error" });
 }
});

// delete user
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

// block user
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

// unblock user
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
   

    // Connect the client to the server	(optional starting in v4.7)
   
    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
     // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})