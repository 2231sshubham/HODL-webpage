const express = require('express');
const axios = require('axios');
const config = require('./config');
const bitbnsApi = require('bitbns');
const bitbns = new bitbnsApi();
const {sequelize,Coin} = require('./models')

const app = express();
app.use(express.static(__dirname + "/Public"));
app.set('view engine', 'ejs');
app.use(express.json());




async function HODL(){

  // WAZIRX

  let wzx = await axios.get("https://api.wazirx.com/api/v2/tickers/btcinr")
  name = "Wazirx";
  buy = wzx.data.ticker.buy;
  sell = wzx.data.ticker.sell;
  last = wzx.data.ticker.last;
  try {
    const user = await Coin.create({name,last,buy,sell});
  } catch (e) {
    console.log(e);
  }



  // BITBNS

  bitbns.fetchTickers(async function (error, data) {
    name = "Bitbns";
    buy = data.BTC.highest_buy_bid;
    sell = data.BTC.lowest_sell_bid;
    last = data.BTC.last_traded_price;
    try {
      const user = await Coin.create({name,last,buy,sell});

    } catch (e) {
      console.log(e);
    }

  });



  // COLODAX

  let colodax = await axios.get("https://colodax.com/api/ticker");
  name = "Colodax";
  buy = colodax.data.BTC_INR.lowestAsk;
  sell = colodax.data.BTC_INR.highestBid;
  last = colodax.data.BTC_INR.last_price;
  try {
    const user = await Coin.create({name,last,buy,sell});
  } catch (e) {
    console.log(e);
  }



  // ZEBPAY

  let zebpay = await axios.get("https://www.zebapi.com/pro/v1/market");
  name = "Zebpay";
  buy = zebpay.data[43].buy;
  sell = zebpay.data[43].sell;
  last = zebpay.data[43].market;
  try {
    const user = await Coin.create({name,last,buy,sell});
  } catch (e) {
    console.log(e);
  }




  // COINDCX

  let coindcx = await axios.get("https://public.coindcx.com/exchange/ticker");
  name = "Coindcx";
  buy = coindcx.data[0].ask;
  sell = coindcx.data[0].bid;
  last = coindcx.data[0].last_price;
  try {
    const user = await Coin.create({name,last,buy,sell});
  } catch (e) {
    console.log(e);
  }

}


// Auto-update database

setInterval(async()=>{await HODL()}, 60000);


// Get request for home route

app.get("/", async function (req, res) {

      await HODL().then().catch(err => console.log(err));

  let coins = [];
  try {
    coins = await Coin.findAll({
      limit: 5,
      where:{},
      order: [ [ 'createdAt', 'DESC' ]]
    });
  } catch (e) {
    console.log(e);
  }

  let total=0;
  coins.forEach(i => {
    total+= parseInt(i.last);
  })

  let avg = total/5;
  res.render("index",{coins:coins,avg:avg});
});


// Get request to update page

app.get("/refresh",async (req,res) => {

  try {
    const coins = await Coin.findAll({
        limit: 5,
        order: [ [ 'createdAt', 'DESC' ]]
      });
    let total=0;
    coins.forEach(i => {
      total+= parseInt(i.last);
    })
    let avg = total/5;
    return res.json({coins:coins,avg:avg});
  } catch (e) {
    console.log(e);
  }
});


// Listen to port 3000

app.listen(3000,async function() {
  console.log("Server started at 3000");
  await sequelize.authenticate();
});
