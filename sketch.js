var dog, dogPic, happyDog, database, foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var changeGS, readGS, gameState;
var bedroomPic, gardenPic, washroomPic;
var currentTime;
//
function preload() {
    dogPic = loadImage('Dog.png');
    happyDog = loadImage('happydog.png');
    bedroomPic = loadImage('Bed Room.png');
    gardenPic = loadImage('Garden.png');
    washroomPic = loadImage('Wash Room.png')
}

function setup() {

    createCanvas(500, 400);
    database = firebase.database();
    foodObj = new Food();
    //
    foodStock = database.ref('Food');
    foodStock.on("value", readStock);
    fedTime = database.ref('FeedTime');
    fedTime.on("value", function(data) {
        lastFed = data.val();
    });

    readGS = database.ref('gameState');
    readGS.on("value", function(data) {
        gameState = data.val();
    })

    dog = createSprite(800, 200, 150, 150);
    dog.addImage(dogPic);
    dog.scale = 0.2;

    feed = createButton("Feed Mason");
    feed.position(680, 45);
    feed.mousePressed(feedDog);
    addFood = createButton("Add Food");
    addFood.position(820, 45);
    addFood.mousePressed(addFoods);
    //


}

function update(state) {
    gameState = database.ref('/').update({ gameState: state })
}

function draw() {
    //background()

    currentTime = hour()
    if (currentTime == (lastFed + 1)) {
        update("Playing")
        foodObj.garden()
    } else if (currentTime == (lastFed + 2)) {
        update("Sleeping")
        foodObj.bedroom()
    } else if (currentTime > (lastFed + 2) && currentTime <= (lastTime + 4)) {
        update("Bathing")
        foodObj.washroom()
    } else {
        update("Hungry")
        foodObj.display()
    }



    fill("white");
    textSize(15);

    if (gameState != "Hungry") {
        feed.hide();
        addFood.hide()
        dog.remove()
    } else {
        feed.show();
        addFood.hide();
        dog.addImage(dogPic)
    }
    drawSprites();
}

//
function readStock(data) {
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
}

//
function addFoods() {
    foodS++;
    database.ref('/').update({
        Food: foodS
    })
}


function feedDog() {
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
    database.ref('/').update({
        Food: foodObj.getFoodStock(),
        FeedTime: hour(),
        gameState: "Hungry"
    })
}