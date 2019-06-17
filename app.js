const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const S = require('string');
const path = require('path');


var app = express()

app.use(express.static(path.join(__dirname,"/public")));
app.set('views','./src/views');
app.set('view engine','ejs');



const apiKey = 'key';
const url = 'https://api.torn.com/faction';
var UsageData = [];




  app.get('/', function (req, res) {


  	axios.get(url, {
    params: {
        selections: 'armorynewsfull',
        key : apiKey
    }
  })
  .then(function (response) {
  	UsageData = [];
    var arr = response.data['armorynews'];
    for( key in arr) {
      if (S(arr[key].news).contains(`filled one of the faction's Empty Blood Bag items.`)){
        var index = arr[key].news.indexOf('</a>')
        var newString = arr[key].news.substring(0,index+4)
        var name = newString.replace(/<[^>]+>/g, '');
        var tempData = {
          "name" : name,
          "profile" : newString,
          "count" : 1
        }
        var pointer = -1;
        if(UsageData.length > 1) {
          pointer = _.findIndex(UsageData,function(o) { return o.name === tempData.name});
         
        }
        if(pointer > -1) {
          UsageData[pointer].count += 1;
        } else {
          UsageData.push(tempData);
        }
      }
      
      
    }
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
    //console.log(UsageData);
    var finalData = _.orderBy(UsageData, ['count'],['desc']);
    res.render('index',{
        title:"Library",
        data: finalData
    });
    
  });  
   
  })
  
app.listen(4000, () => {
    console.log('Server started on port 4000')
})