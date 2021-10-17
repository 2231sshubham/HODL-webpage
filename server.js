const express = require('express');
const axios = require('axios');
const config = require('./config');
const mongoose = require("mongoose");
const Doc = require("./models/model");

name = config.name;
pass = config.pass;
var url = "mongodb+srv://" + name + ":" + pass + "@email-editor.kre0j.mongodb.net/HODL";
mongoose.connect(url)


const app = express();
app.use(express.static(__dirname + "/Public"));
app.set('view engine', 'ejs');
app.use(express.json());

function HODL(){
  axios.get("https://api.wazirx.com/api/v2/tickers")
  .then(async function(ans){

    var data = ans.data;
    var keys = Object.keys(ans.data)
    var count=0;

    for(let i=0;i<10;i++){
      const doc = await Doc.updateOne(
          {name:data[keys[i]].name},
          {
          name : data[keys[i]].name,
          last:data[keys[i]].last,
          buy:data[keys[i]].buy,
          sell:data[keys[i]].sell,
          volume:data[keys[i]].volume,
          base_unit:data[keys[i]].base_unit
        },
        {upsert:true}
      )
    }
  });
}

app.get("/",async function(req,res){
  HODL();
  const arr = await Doc.find({},{
    _id:0,
    name :1,
    last:1,
    buy:1,
    sell:1,
    volume:1,
    base_unit:1
  })
  res.render('index.ejs',{arr:arr});

});

app.listen(3000,function(req,res){
  console.log("Server started at 3000");
});
