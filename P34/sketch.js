//Create variables here
var dog; 
var happyDog;
var database;
var foodS;
var foodStock;
var fedTime;
var lastFed;
var foodObj;
var feed ;
var addFood;
var gameState = "Hungry";
var readState;
var bedroom, garden, washroom;

function preload()
{
	//load images here
  dogImg = loadImage("Images/dogImg.png");
  dogHappy = loadImage("Images/dogImg1.png");
  bedroom = loadImage("virtual-pet-images/bedroom.png");
  garden = loadImage("virtual-pet-images/garden.png");
  washroom = loadImage("virtual-pet-images/washroom.png");
}
  


function setup() {
	createCanvas(1000, 500);
  background('rgba(0,255,0, 0.25)');
  db = firebase.database();

  //read game state from database
  //readState = db.ref('gameState');
  //readState.on(function(data){
   // gameState = data.val();
  //});  

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(dogImg);
  dog.scale = 0.4
  foodStock = db.ref('Food');
  foodStock.on("value", readStock);
  foodObj = new Food();
  feed = createButton("Feed the Dog");
  feed.position(800,350);
  feed.show();
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food")
  addFood.position(700,350);
  addFood.mousePressed(addFoods);

}


function draw() {  
background(46, 139, 87)
foodObj.display();

fedTime = db.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed = data.val();
});

fill(255,255,254);
textSize(15);
//function to update gamestates in database
function update(state){
  db.ref('/').update({
    gameState:state
  });
}
if(lastFed>=12){
  text("Last Feed : "+ lastFed%12 + " PM", 350,30);
}else if(lastFed==0){
  text("Last Feed : 12 AM",350,30);
}else{
  text("Last Feed : "+ lastFed + "AM", 350,30);
}

if(gameState != "Hungry"){
  feed.hide();
  addFood.hide();
}else{
  feed.show();
  dog.addImage(dogImg);
  addFood.show();

}
currentTime = hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
    foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("Bathing");
    foodObj.washroom();
}else{
  update("Hungry")
    foodObj.display();
}
  drawSprites();
}
function readStock(data){
foodS = data.val();
foodObj.updateFoodStock(foodS)
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0)
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)  
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//Function to read values from database

//Function to write values in database
function writeStock(x){
  if(x<=0){
    x=0
  }else{
    x=x-1
  }
  db.ref('/').update({
    Food:x
  })
}



