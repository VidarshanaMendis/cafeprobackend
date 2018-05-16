const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Restaurant = require('../models/restaurant');
var sleep = require('system-sleep');

router.post('/restaurantregister',(req,res,next) => {
    console.log("register called");
    const newRestaurant = new Restaurant({
        restname:req.body.restname,
        city:req.body.city,
        address:req.body.address,
        website:req.body.website,
        telephone:req.body.telephone,
        openinghours:req.body.openinghours,
        comments:new Object(),
        approve:req.body.approve,
        reject:req.body.reject,
        imagelink:req.body.imagelink

    });
    Restaurant.addRestaurant(newRestaurant,(err,restaurant)=> {
        if(err) {
            res.json({success: false, msg:'failed to register'})
            console.log("failed to register");
        }if(restaurant){
            res.json({success:true, msg: "registered successfully"})
            console.log("registered successfully");
        }
    });
});

router.post("/name",function (req,res){
    console.log("search by name, call received ");
    console.log(req.body.restname);
    Restaurant.getRestaurantByName(req.body.restname, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not found",error : err});
            console.log("data not found");
        }
        if(restaurant){
            res.json({state:true,msg:"data found",restaurant:restaurant});
            console.log("data found");
            console.log(restaurant);
        }
    });
});


router.post("/city",function (req,res){
    console.log("search by city, call received ");
    console.log(req.body.city);
    Restaurant.getRestaurantByCity(req.body.city, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not found",error : err});
            console.log("data not found");
        }
        if(restaurant){
            res.json({state:true,msg:"data found",restaurant:restaurant});
            console.log("data found");
            console.log(restaurant);
        }
    });
});


router.post ("/savecomment", function(req,res){

    console.log(req.body);
    const data = {
        id:req.body._id,
        comments:req.body.comments
    };
    console.log("/savecomment call received");
    Restaurant.saveComment(data, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not inserted"});
        }
        if(restaurant){
            res.json({state:true,msg:"data inserted"});
        }
    });
});

router.post ("/savecommentnew", function(req,res){

    console.log(req.body);
    commentrate=0;

    var AYLIENTextAPI = require('aylien_textapi');
    var textapi = new AYLIENTextAPI({
        application_id: "d7346eb8",
        application_key: "44cf50900d86dc09f808b9ee999ba5a9"
    });

    textapi.sentiment(
        {
            'text': req.body.lastcomment
        }
        , function(error, response) {
            if (error === null) {
                console.log(response);

            commentrate =(response.polarity_confidence)*5;
            commentrate = commentrate.toFixed(2);

            commentrate = Number(commentrate);

            console.log("commentrate :" +commentrate);
            }
        });

    sleep(2000);

    var keys = Object.keys(req.body.comments);
    console.log(keys);
    var last = keys[keys.length-1];

    console.log(last);

    var lastcom={
        comment:req.body.lastcomment,
        rate:commentrate
    };
    console.log(lastcom);

    req.body.comments[last]=lastcom;


    const data = {
        id:req.body._id,
        comments:req.body.comments
       // rate:apiresponse.body.polarity_confidence
    };
    var total=0;
    var frating=0
    for(var i=0;i<keys.length;i++){
        var value=data.comments[keys[i]].rate;
        console.log(value);
        total=total+value;
    }
    console.log(total);
    frating=(total/keys.length);
    console.log("final rating: "+frating);

    frating=frating.toFixed(2);
    frating=Number(frating);
    const fdata = {
        id:req.body._id,
        comments:req.body.comments,
        rating:frating
        // rate:apiresponse.body.polarity_confidence
    };

    console.log(fdata);

    console.log("/savecomment call received");
    Restaurant.saveComment(fdata, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not inserted"});
        }
        if(restaurant){
            res.json({state:true,msg:"data inserted"});
        }
    });
});



router.post("/id",function(req,res){
    console.log("search by id call received, id :" + req.body.id);
    Restaurant.restaurantById(req.body.id, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not found",error : err});
        }
        if(restaurant){
            res.json({state:true,msg:"data found",restaurant:restaurant});
        }
    });
});

router.post("/getrestaurants",function(req,res){
    console.log("search by id call received, id :" + req.body.id);
    Restaurant.getRestaurants(req.body.id, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not found",error : err});
        }
        if(restaurant){
            res.json({state:true,msg:"data found",restaurant:restaurant});
        }
    });
});

router.post("/deleterestaurant",function(req,res){
    console.log("delete called :" + req.body._id);
    Restaurant.deleterestaurant(req.body._id, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not found",error : err});
        }
        if(restaurant){
            res.json({state:true,msg:"data found",restaurant:restaurant});
        }
    });
});

router.post("/approverestaurants",function(req,res){
    console.log("approve called :" + req.body._id);
    Restaurant.approverestaurant(req.body._id, function(err,restaurant){
        if(err){
            res.json({state:false,msg:"data not found",error : err});
        }
        if(restaurant){
            res.json({state:true,msg:"data found",restaurant:restaurant});
        }
    });
});



module.exports = router;
