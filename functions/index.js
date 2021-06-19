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




const app = express();
app.get("/test", (req, res)=>{
  res.send("boom");
});

const temp = async ()=>{
  const food_documents=await db.collection("food_items").orderBy('food_ID').limit(200).get()
  const food_items = food_documents.docs.map(doc=>{
    const food_item=doc.data()
    const diet = food_item.diet
    const cuisine = food_item.cuisine
    const course = food_item.course
    const cat=food_item.category
    const tags = food_item.tags
    const title = food_item.recipe_title
    let tempList = [title,diet,cuisine,course,cat,tags]
    let content = ''
    tempList.forEach(line=>{
      content=content+line+' '
    })
    return {
      id:String(food_item.food_ID),
      content
    }
  })
  recommender.train(food_items);
  const similarDocuments = recommender.getSimilarDocuments('60', 0, 10);//Tortilla Pizza With Tomato, Onion And Capsicum
  console.log(similarDocuments);
  const ids = similarDocuments.map(a=>parseInt(a.id))
  food_documents.forEach(doc=>{
    if(doc.data().food_ID==60)
      console.log(doc.data())
    if(ids.includes(doc.data().food_ID)){
      console.log(doc.data().recipe_title)
    }
  })
  /* const tempp = [
    { id: '6211', score: 0.4376086749517294 },
    { id: '60', score: 0.25909080562598147 },
    { id: '731', score: 0.25580052359543837 },
    { id: '3001', score: 0.1723457815431644 },
    { id: '2301', score: 0.17165451431763643 },
    { id: '3263', score: 0.16429231390633733 },
    { id: '314', score: 0.1624882516747639 },
    { id: '5072', score: 0.1596799388071619 },
    { id: '100', score: 0.12986960389202515 },
    { id: '500', score: 0.12898062801034865 }
  ]
  const ids = tempp.map(a=>parseInt(a.id))
  const res = await db.collection('food_items').get()
  res.forEach(doc=>{
    console.log()
    if(ids.includes(doc.data().food_ID)){
      console.log(doc.data())
    }
  }) */
  
  /* abc.docs.forEach(doc=>{
    console.log(doc.data())
  })  */
//const model = await ml.getModel('foodenie')
//model.toJSON()
 /*    const abc=await db.collection("users").get()
    abc.docs.forEach(doc=>console.log(doc.data())) */
/*     fs.createReadStream('csv/food_recipes_new.csv')
    .pipe(csv())
    .on('data',async function (row)  {
      row.food_ID=parseInt(row.food_ID)
      await db.collection("food_items").add(row)
 
    })
    .on('end', function () {
      }) */

}
temp()
exports.app = functions.https.onRequest(app);
