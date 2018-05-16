const mongoose = require('mongoose');
const config = require('../config/database');

var AYLIENTextAPI = require('aylien_textapi');
var textapi = new AYLIENTextAPI({
    application_id: "d7346eb8",
    application_key: "44cf50900d86dc09f808b9ee999ba5a9"
});

const RestSchema = mongoose.Schema({
    restname:{
        type:String
    },
    city: {
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    website:{
        type:String,
        
    },
    telephone:{
        type:String,
    },
    openinghours:{
        type:String,
    },
    comments:Object,

    rating:Number,

    lastcomment:String,

    imagelink:String,

    userid:String,

    reject:Boolean,
    approve:Boolean

});

const Restaurant = module.exports=mongoose.model('restaurant',RestSchema);

module.exports.getRestaurantById = function (id,callback){
    Restaurant.findById(id, callback);
}

module.exports.getUsername = function (restname, callback){
    const query = {restname: restname}
    Restaurant.findOne(query,callback);
}
module.exports.addRestaurant = function (newRestaurant,callback){
    newRestaurant.save(callback);
}
module.exports.getRestaurantByName = function (name,callback){
    const query ={restname:name};
    console.log(name);
    Restaurant.find(query,callback);
    //Restaurant.find( { $text: { $search: query } },callback )
}

module.exports.getRestaurantByCity = function (city,callback){
    const query ={city:city};
    console.log(city);
    Restaurant.find(query,callback);
    //Restaurant.find( { $text: { $search: query } },callback )
}

module.exports.saveComment = function (data,callback){
    Restaurant.findById(data.id, function (err, restaurant) {
        if (err) {
            res.send({error: err});
        }

        restaurant.set(
            {
                comments: data.comments,
                rating:data.rating

            }
        );
        restaurant.save(callback);
    });
};


module.exports.restaurantById = function (id,callback){
    const query = {_id : id};
    Restaurant.findOne(query,callback);
};

module.exports.getRestaurants = function (id,callback){
    const query = {approve: false,
        reject:false};

    //Restaurant.findOne(query,callback);
    Restaurant.find(query,callback)
};

module.exports.deleterestaurant = function (id,callback){

    Restaurant.findById(id, function (err, restaurant) {
        if (err) {
            res.send({error: err});
        }

        restaurant.set(
            {
                reject:true

            }
        );
        console.log("delete called");
        restaurant.save(callback);
    });

    //Restaurant.findOne(query,callback);
    //Restaurant.updateOne(id,callback)
};

module.exports.approverestaurant = function (id,callback){

    Restaurant.findById(id, function (err, restaurant) {
        if (err) {
            res.send({error: err});
        }

        restaurant.set(
            {
                approve:true

            }
        );
        restaurant.save(callback);
    });

};

