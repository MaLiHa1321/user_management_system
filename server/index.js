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
   


// add new user
// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const result = await userCollection.insertOne({ name, email, password, blocked: false });
//     res.status(201).json({ insertedId: result.insertedId, success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// function extractUserData(req) {
//   const { name, email, password } = req.body;
//   return { name, email, password, blocked: false };
// }

// async function insertUser(userData, userCollection) {
//   return await userCollection.insertOne(userData);
// }

// function handleSuccess(res, insertedId) {
//   res.status(201).json({ insertedId, success: true });
// }

// function handleError(res, err) {
//   console.error(err);
//   res.status(500).json({ message: "Server error" });
// }

// app.post("/register", async (req, res) => {
//   const userData = extractUserData(req);
//   try {
//     const result = await insertUser(userData, userCollection);
//     handleSuccess(res, result.insertedId);
//   } catch (err) {
//     handleError(res, err);
//   }
// });



// login route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await userCollection.findOne({ email });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     if (user.blocked) {
//       return res.status(401).json({ message: "User is blocked and cannot login." });
//     }

//     // Update login time
//     const loginTime = new Date();
//     await userCollection.updateOne(
//       { email },
//       { $set: { lastLogin: loginTime } }
//     );

//     res.status(200).json({
//       success: true,
//       user: {
//         name: user.name,
//         email: user.email,
//         lastLogin: loginTime,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// function getLoginData(req) {
//   return { email: req.body.email, password: req.body.password };
// }

// async function findUserByEmail(email) {
//   return await userCollection.findOne({ email });
// }

// function isInvalidUser(user, password) {
//   return !user || user.password !== password;
// }

// function isBlocked(user) {
//   return user.blocked;
// }

// async function updateLoginTime(email) {
//   const time = new Date();
//   await userCollection.updateOne({ email }, { $set: { lastLogin: time } });
//   return time;
// }

// function sendLoginSuccess(res, user, time) {
//   res.status(200).json({
//     success: true,
//     user: { name: user.name, email: user.email, lastLogin: time },
//   });
// }

// function sendLoginError(res, msg) {
//   res.status(401).json({ message: msg });
// }

// function handleServerError(res, err) {
//   console.error("Login failed:", err);
//   res.status(500).json({ message: "Something went wrong on the server." });
// }

// app.post("/login", async (req, res) => {
//   const { email, password } = getLoginData(req);
//   try {
//     const user = await findUserByEmail(email);
//     if (isInvalidUser(user, password)) return sendLoginError(res, "Invalid email or password");
//     if (isBlocked(user)) return sendLoginError(res, "User is blocked and cannot login.");
//     const time = await updateLoginTime(email);
//     sendLoginSuccess(res, user, time);
//   } catch (err) {
//     handleServerError(res, err);
//   }
// });




// app.delete("/users", async (req, res) => {
//   const { ids } = req.body; // Array of user IDs

//   if (!Array.isArray(ids)) {
//     return res.status(400).json({ success: false, message: "Invalid ID list" });
//   }

//   try {
//     const objectIds = ids.map(id => new ObjectId(id));
//     const result = await userCollection.deleteMany({ _id: { $in: objectIds } });

//     res.status(200).json({
//       success: true,
//       deletedCount: result.deletedCount,
//     });
//   } catch (err) {
//     console.error("Deletion error:", err);
//     res.status(500).json({ success: false, message: "Server error during deletion" });
//   }
// });

// function getIdsFromRequest(req) {
//   return req.body.ids;
// }

// function isValidIdArray(ids) {
//   return Array.isArray(ids);
// }

// function respondInvalidIds(res) {
//   res.status(400).json({ success: false, message: "Invalid ID list" });
// }

// function convertToObjectIds(ids) {
//   return ids.map(id => new ObjectId(id));
// }

// async function deleteUsersByIds(objectIds) {
//   return await userCollection.deleteMany({ _id: { $in: objectIds } });
// }

// function respondWithDeletionResult(res, count) {
//   res.status(200).json({ success: true, deletedCount: count });
// }

// function respondDeletionError(res, error) {
//   console.error("Deletion error:", error);
//   res.status(500).json({ success: false, message: "Server error during deletion" });
// }

// app.delete("/users", async (req, res) => {
//   const ids = getIdsFromRequest(req);
//   if (!isValidIdArray(ids)) return respondInvalidIds(res);
//   try {
//     const objectIds = convertToObjectIds(ids);
//     const result = await deleteUsersByIds(objectIds);
//     respondWithDeletionResult(res, result.deletedCount);
//   } catch (error) {
//     respondDeletionError(res, error);
//   }
// });



// Batch block users
// app.patch("/users/block", async (req, res) => {
//   const { ids } = req.body; // array of user IDs
//   if (!Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ success: false, message: "No user IDs provided" });
//   }

//   try {
//     const objectIds = ids.map(id => new ObjectId(id));
//     const result = await userCollection.updateMany(
//       { _id: { $in: objectIds } },
//       { $set: { blocked: true } }
//     );
//     res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
//   } catch (err) {
//     console.error("Batch block error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// function getUserIds(req) {
//   return req.body.ids;
// }

// function isEmptyOrInvalid(ids) {
//   return !Array.isArray(ids) || ids.length === 0;
// }

// function respondWithMissingIds(res) {
//   res.status(400).json({ success: false, message: "No user IDs provided" });
// }

// function toObjectIds(ids) {
//   return ids.map(id => new ObjectId(id));
// }

// async function blockUsers(objectIds) {
//   return await userCollection.updateMany({ _id: { $in: objectIds } }, { $set: { blocked: true } });
// }

// function respondWithBlockResult(res, count) {
//   res.status(200).json({ success: true, modifiedCount: count });
// }

// function handleBlockError(res, err) {
//   console.error("Batch block error:", err);
//   res.status(500).json({ success: false, message: "Server error" });
// }

// app.patch("/users/block", async (req, res) => {
//   const ids = getUserIds(req);
//   if (isEmptyOrInvalid(ids)) return respondWithMissingIds(res);
//   try {
//     const objectIds = toObjectIds(ids);
//     const result = await blockUsers(objectIds);
//     respondWithBlockResult(res, result.modifiedCount);
//   } catch (err) {
//     handleBlockError(res, err);
//   }
// });


// Batch unblock users
// app.patch("/users/unblock", async (req, res) => {
//   const { ids } = req.body; // array of user IDs
//   if (!Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ success: false, message: "No user IDs provided" });
//   }

//   try {
//     const objectIds = ids.map(id => new ObjectId(id));
//     const result = await userCollection.updateMany(
//       { _id: { $in: objectIds } },
//       { $set: { blocked: false } }
//     );
//     res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
//   } catch (err) {
//     console.error("Batch unblock error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// function getUnblockIds(req) {
//   return req.body.ids;
// }

// function isUnblockInputInvalid(ids) {
//   return !Array.isArray(ids) || ids.length === 0;
// }

// function respondUnblockInputError(res) {
//   res.status(400).json({ success: false, message: "No user IDs provided" });
// }

// function mapToObjectIds(ids) {
//   return ids.map(id => new ObjectId(id));
// }

// async function unblockUsersById(objectIds) {
//   return await userCollection.updateMany({ _id: { $in: objectIds } }, { $set: { blocked: false } });
// }

// function sendUnblockResult(res, count) {
//   res.status(200).json({ success: true, modifiedCount: count });
// }

// function handleUnblockError(res, err) {
//   console.error("Batch unblock error:", err);
//   res.status(500).json({ success: false, message: "Server error" });
// }

// app.patch("/users/unblock", async (req, res) => {
//   const ids = getUnblockIds(req);
//   if (isUnblockInputInvalid(ids)) return respondUnblockInputError(res);
//   try {
//     const objectIds = mapToObjectIds(ids);
//     const result = await unblockUsersById(objectIds);
//     sendUnblockResult(res, result.modifiedCount);
//   } catch (err) {
//     handleUnblockError(res, err);
//   }
// });
















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