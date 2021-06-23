const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const firebase = require("firebase");
const fs = require('fs')
require("firebase/firestore");
const serviceAccount = require("./foodenie-firebase-adminsdk-wqm1o-fca8971757.json");
const firebaseConfig = require("./firebase-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodenie-default-rtdb.firebaseio.com"
});
firebase.initializeApp(firebaseConfig);

const ContentBasedRecommender = require("content-based-recommender");
const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});

const db = firebase.firestore();


const app = express();
const food_documents = JSON.parse(fs.readFileSync('./food_items.json')).items

app.get("/trending", async (req, res) => {
  const item = await db.collection("food_items").orderBy("rank", "desc").limit(1).get();
  const max_rank = item.docs.map(res => res.data())

  return res.json(max_rank[0]);
});


app.put("/food_eaten/:food_id", async (req, res) => {
  const food_id = req.params.food_id;


  // const item = await db.collection("food_items").doc(food_id).get();
  const food = await db.collection("food_items").where('food_ID', '==', parseInt(food_id)).get();

  const food_data = food.docs.map(res => res.data())

  //TODO: 
  return res.json(food.docs.id);

  const updated = await db.collection("food_items")
    .doc(food.id)
    .update({
      rank: 20
    });

  return res.json(updated);
  // return res.json(max_rank[0]);
  //   db.collection("users").doc("frank").update({
  //     "age": 13,
  //     "favorites.color": "Red"
  // });
})


app.get("/recommend", async (req, res) => {
  try {
    const recFoodId = req.query.foodId
    const food_items = food_documents.map(food_item => {
      const diet = food_item.diet
      const cuisine = food_item.cuisine
      const course = food_item.course
      const cat = food_item.category
      const tags = food_item.tags
      const title = food_item.recipe_title
      let tempList = [title, diet, cuisine, course, cat, tags]
      let content = ''
      tempList.forEach(line => {
        content = content + line + ' '
      })
      return {
        id: String(food_item.food_ID),
        content
      }
    })
    recommender.train(food_items);
    const similarDocuments = recommender.getSimilarDocuments(recFoodId, 0, 10);//Poriyal s (South Indian Sabzi)
    const ids = similarDocuments.map(a => parseInt(a.id))
    console.log(ids)
    const food_result = await db.collection("food_items").where('food_ID', 'in', ids).get();
    const rec_foods = food_result.docs.map(res => res.data())
    res.status(200).json({
      result: rec_foods
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      result: error
    })
  }
})



app.listen(8000, () => {
  console.log("server is listening to 8000 port");

  // category "Indian Chinese s"
  // course "Main Course"
  // cuisine "Indo Chinese"
  // diet "Vegetarian"
  // food_ID 1200
  // rank 2
  // recipe_title "Spicy Schezwan Vegetable Noodles "
  // tags "Party Food s|Indian Lunch s|Office Lunch Box s|Bachelor s|Noodle s" 
})

exports.app = functions.https.onRequest(app);
/*
const temp = async ()=>{

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
  const similarDocuments = recommender.getSimilarDocuments('60', 0, 10);//Poriyal s (South Indian Sabzi)
  console.log(similarDocuments);
  const ids = similarDocuments.map(a=>parseInt(a.id))
  food_documents.forEach(doc=>{
    if(ids.includes(doc.data().food_ID)){
      console.log(doc.data().recipe_title)
    }
  })

}
temp() */


/*
const temp = async ()=>{
  let str;
  const result=await db.collection("food_items").where('course','==','Indian Breakfast').limit(100).get()
  const temp_documents = JSON.parse(fs.readFileSync('./food_items.json')).items
  result.docs.forEach(res=>{
    temp_documents.push(res.data())
  })
  //const food_documents=result.docs.map(doc=>doc.data())
  str=JSON.stringify({
    items:temp_documents
  })
fs.writeFileSync('food_items.json',str)
}

temp()

const temp = async ()=>{
  const temp_documents = JSON.parse(fs.readFileSync('./food_items.json')).items
  let ary=[]
  temp_documents.forEach(res=>{
    ary.push(res.food_ID)
  })
  console.log(ary)
  const temp_1=await db.collection("food_items").where('food_ID','not-in',ary).get()
  temp_1.docs.forEach(async doc=>{
    await doc.ref.delete()
  })
  const bleh = await db.collection("food_items").get()
  console.log(bleh.size)
  const temp_documents = JSON.parse(fs.readFileSync('./food_items.json')).items
  temp_documents.forEach(async obj=>{
    await db.collection("food_items").add(obj)
  })
}
*/


/* db.collection("food_items").orderBy('food_ID').limit(700).get().then(result=>{
  const food_documents=result.docs.map(doc=>doc)

}) */

