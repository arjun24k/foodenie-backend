const functions = require("firebase-functions");
const express = require("express");
const fs = require('fs');
const csv = require('csv-parser')
var admin = require("firebase-admin");
const firebase = require("firebase").default
require("firebase/firestore")


var serviceAccount = require("./foodenie-firebase-adminsdk-wqm1o-fca8971757.json");
var firebaseConfig = require("./firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodenie-default-rtdb.firebaseio.com"
});
firebase.initializeApp(firebaseConfig);

const ContentBasedRecommender = require('content-based-recommender')
const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});

const db = firebase.firestore()
const ml = admin.machineLearning()

const food_documents = await db.collection("food_items").orderBy('food_ID').limit(1000).get()


const app = express();
app.get("/test", (req, res) => {
  res.send("boom");
});

app.get("/reccommend", async (req, res) => {
  try {

  } catch (error) {

  }
})

exports.app = functions.https.onRequest(app);
