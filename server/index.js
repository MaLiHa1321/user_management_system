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
//    console.log("Connected to MongoDB user_management database");

// add new user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await userCollection.insertOne({ name, email, password, blocked: false });
    res.status(201).json({ insertedId: result.insertedId, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Check users
// login route
// login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.blocked) {
      return res.status(401).json({ message: "User is blocked and cannot login." });
    }

    // Update login time
    const loginTime = new Date();
    await userCollection.updateOne(
      { email },
      { $set: { lastLogin: loginTime } }
    );

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        lastLogin: loginTime,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userCollection.find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/users", async (req, res) => {
  const { ids } = req.body; // Array of user IDs

  if (!Array.isArray(ids)) {
    return res.status(400).json({ success: false, message: "Invalid ID list" });
  }

  try {
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await userCollection.deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Deletion error:", err);
    res.status(500).json({ success: false, message: "Server error during deletion" });
  }
});

// app.patch("/users/:id/block", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await userCollection.findOne({ _id: new ObjectId(id) });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const newStatus = !user.blocked; // toggle

//     const updateResult = await userCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { blocked: newStatus } }
//     );

//     if (updateResult.modifiedCount === 1) {
//       return res.status(200).json({ success: true, blocked: newStatus });
//     } else {
//       return res.status(500).json({ success: false, message: "Update failed" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Batch block users
app.patch("/users/block", async (req, res) => {
  const { ids } = req.body; // array of user IDs
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "No user IDs provided" });
  }

  try {
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await userCollection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { blocked: true } }
    );
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Batch block error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Batch unblock users
app.patch("/users/unblock", async (req, res) => {
  const { ids } = req.body; // array of user IDs
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "No user IDs provided" });
  }

  try {
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await userCollection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { blocked: false } }
    );
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Batch unblock error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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