var Money =50;
var HP =100;
var Points = 0;
var FPS = 60;
var clock = 0;
// 創造 img HTML 元素，並放入變數中
var crosshairImg = document.createElement("img");
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var btnImg = document.createElement("img");
var towerImg = document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src = "images/rukia.gif";
btnImg.src = "images/tower-btn.png"
towerImg.src = "images/tower.png"
crosshairImg.src = "images/crosshair.png"
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if(clock%50 == 0){
		var newEnemy = new Enemy();
		enemies.push(newEnemy);
	}
	// 將背景圖片畫在 canvas 上的 (0,0) 位置s
	ctx.drawImage(bgImg,0,0);
	for (var i=0;i<enemies.length;i++){
		if(enemies[i].hp<=0){
		enemies.splice(i,1);
		Money+= 1
		Points+= 1
		}else{
		enemies[i].move();
		ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y);
		}
	}
	ctx.drawImage(btnImg,btn.x,btn.y,64,64);
	for (var i = 0; i < towers.length; i++) {
		towers[i].searchEnemy();
		if(towers[i].aimingEnemyId != null){
			var id = towers[i].aimingEnemyId;
			ctx.drawImage(crosshairImg,enemies[id].x,enemies[id].y)
		}
		
		ctx.drawImage(towerImg,towers[i].x,towers[i].y);
		
	}
	if(isbuilding==true){
	  ctx.drawImage(towerImg,cursor.x - cursor.x%32,cursor.y - cursor.y%32);
	}
	ctx.font = "24px Arial"
	ctx.fillStyle = "blue"
	ctx.fillText("HP:"+ HP,480,32);
	ctx.fillText("Money:"+ Money,300,32);
	ctx.fillText("Points:"+ Points,120,32);
	if(HP <=0){
        clearInterval(intervalID);
        ctx.font = "24px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText("Game over",109,32);
	}
}

// 執行 draw 函式
var intervalID = setInterval(draw, 1000/FPS);

var enemyPath = [
{x:64,y:448},
{x:64,y:64},
{x:160,y:64},
{x:160,y:256},
{x:224,y:256},
{x:224,y:64},
{x:320,y:64},
{x:320,y:160},
{x:352,y:160},
{x:352,y:320},
{x:128,y:320},
{x:128,y:384},
{x:512,y:384},
{x:512,y:160},
]


function Enemy () {
	this.x=64,
	this.y=480-32,
	this.hp = 100;
	this.speedX=0,
	this.speedY=64,
	this.pathDes=0, 
	this.move= function(){
		if(isCollided(enemyPath[this.pathDes].x,enemyPath[this.pathDes].y,this.x,this.y,64/FPS,64/FPS)){
			this.x=enemyPath[this.pathDes].x;
			this.y=enemyPath[this.pathDes].y;
			this.pathDes++;
			if(this.pathDes == enemyPath.length){
				this.hp = 0
				HP -=10;
				return;
			}
			if(enemyPath[this.pathDes].y < this.y){
				//up
				this.speedX=0;
				this.speedY=-64;
			}else if(enemyPath[this.pathDes].x > this.x){
				//right
				this.speedX=64;
				this.speedY=0;
			}else if(enemyPath[this.pathDes].y > this.y){
				//down
				this.speedX=0;
				this.speedY=64;
			}else if(enemyPath[this.pathDes].x < this.x){
				//left
				this.speedX=-64;
				this.speedY=0;
			}
		}else{
			this.x += this.speedX/FPS;
			this.y += this.speedY/FPS;
		}
	}
}
var enemies = [];

var btn ={
x:576,
y:416
}

var cursor ={
x:100,
y:200
}
function Tower () {
this.x=0;
this.y=0;
this.range=128;
this.aimingEnemyId= null;
this.searchEnemy=function(){
		this.readyToShootTime-= 1/FPS
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if(this.readyToShootTime<=0){
					this.shoot(i);
					this.readyToShootTime = this.fireRate;
				}
				return;
			}
		}
		// 如果都沒找到，會進到這行，清除鎖定的目標
		this.aimingEnemyId = null;
	};
this.shoot = function(id){
		ctx.beginPath();
		ctx.moveTo(this.x+16,this.y);
		ctx.lineTo(enemies[id].x+16,enemies[id].y+16);
		ctx.strokeStyle = 'blue';
		ctx.lineWidth = 3;
		ctx.stroke();
		enemies[id].hp-=this.damage;
	};
this.fireRate= 0.1;
this.readyToShootTime =0.1;
this.damage=5;
}
var towers=[];
$("#game-canvas").on("mousemove", mousemove);
function mousemove(event){
cursor.x=event.offsetX
cursor.y=event.offsetY

}
var isbuilding =false 
$("#game-canvas").on("click",mouseclick)
function mouseclick () {
	if(cursor.x>576 && cursor.y>416){
		isbuilding=true;
	}else{
		if(isbuilding==true){
			if(Money >= 25){
				var newTower = new Tower ();
			newTower.x=cursor.x - cursor.x%32;
		    newTower.y=cursor.y - cursor.y%32;
		    towers.push(newTower);
		    Money-= 25;
		}
	}
		isbuilding=false;
	}
}
function isCollided(pointX,pointY,targetX,targetY,targetWidth,targetHeight){
if(targetX <= pointX &&
	    	  pointX <= targetX + targetWidth &&
   targetY <= pointY &&
	    	  pointY <= targetY + targetHeight ){
		return true;
	}else{
		return false;
	}

}

