//window.addEventListener("load", initialise, false);

var menu = true;

var canvas;
var console;
var ctx;
var speed = 5; // pixels
var posx;
var posy;
var secs;
var mins;
var leveltext = "easy";

var towerSpeed = 0.04; // rad
var towerFireInterval = 60; // tick

var missileVelocity = 8; //pixels

var map = new Array;
var tower = new Array;
var missile;
var explosions;
var tanks;

function initialise(level) {
	canvas = document.getElementById('canvas');
	console = document.getElementById('console');
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		posx = 360;
		posy = 240;
		secs = 0;
		mins = 0;

		up = false;
		down = false;
		left = false;
		right = false;

		missile = new Array;
		explosions = new Array;
		tanks = new Array;

		missile[0] = new fireMissile(-10,-10,0,0);

		tower[0] = new buildTower(700,460,-3,30);
		tower[1] = new buildTower(10,10,0.5,40);
		tanks[0] = new tank(10,30,10,440,10,230,90,0,0.5,50);

		if (level >= 1) {
			tower[2] = new buildTower(10,460,-0.5,20);
			tower[3] = new buildTower(700,10,-4,50);
			tanks[1] = new tank(30,460,680,460,350,460,120,0,-0.5,50);
			leveltext = "medium";
		} else {
			tower.splice(2,5);
			tanks.splice(1,5);
		}

		if (level >= 2) {
			tower[4] = new buildTower(360,460,-1.5,10);
			tanks[2] = new tank(700,30,700,440,700,230,90,1,-3,50);
			leveltext = "hard";
		} else {
			tower.splice(4,3);
			tanks.splice(2,4);
		}

		if (level >= 3) {
			tower[5] = new buildTower(10,230,0,10);
			tower[6] = new buildTower(700,230,0,10);
			tanks[3] = new tank(10,30,10,440,10,230,90,1,0.5,50);
			tanks[4] = new tank(30,460,680,460,350,460,120,1,-0.5,50);
			tanks[5] = new tank(700,30,700,440,700,230,90,0,-3,50);
			leveltext = "extreme";			
		} else {
			tower.splice(5,2);
			tanks.splice(3,3)
		}

		generateMap();
		game();
	} else {
		alert("Your browser is too old. The game is not going to work for you.");
	}
}

function buildTower(x,y,dof,lf) {
	this.posx = x;
	this.posy = y;
	this.dof = dof;
	this.lf = lf;
}

function fireMissile(x,y,vx,vy) {
	this.posx = x;
	this.posy = y;
	this.velx = vx;
	this.vely = vy;
}

function explosion(x,y,r) {
	this.posx = x;
	this.posy = y;
	this.state = 0;
	this.rad = r;
}

function tank(end0x,end0y,end1x,end1y,posx,posy,speed,te,dof,lf) {
	this.end0x = end0x;
	this.end0y = end0y;
	this.end1x = end1x;
	this.end1y = end1y;
	this.posx = posx;
	this.posy = posy;
	this.speed = speed;
	this.te = te;
	this.dof = dof;
	this.lf = lf;
}

function generateMap() {
	//	0 = AIR
	//	1 = WALL
	for (i = 0; i <= 47; i+=1) {
		map[i] = new Array();
		for (j = 0; j <= 71; j+=1) {
			if (i == 0 || i == 47 || j == 0 || j == 71) {
				map[i][j] = 1;
			} else {
				map[i][j] = 0;
			}
			//map[i][j] = Math.floor(Math.random()*2);
		}
	}
}

function game() {
	tick();
	render();
	var next = setTimeout("game()",20);
}

function gameOver() {
	render();
	console.innerHTML = "<span style='color: red; font-weight: bold;'>You Died.</span><br>" + console.innerHTML;
	document.getElementById('menu').style.display = 'block';
	menu = true;

	clearTimeout(next);
}

function tick() {
	if (secs >= 60) {
		mins++;
		secs = 0;
	}
	console.innerHTML = "You survived for " + mins + "m " + Math.floor(secs) +"s on " + leveltext + " difficulty."; secs += 0.02; //"<br>pos("+posx+"|"+posy+")"
	if (up && map[Math.floor(posy/10)-2][Math.floor(posx/10)] == 0 && map[Math.floor(posy/10)-2][Math.floor(posx/10)-1] == 0) posy -= speed;
	if (down && map[Math.floor(posy/10)+1][Math.floor(posx/10)] == 0 && map[Math.floor(posy/10)+1][Math.floor(posx/10)-1] == 0) posy += speed;
	if (left && map[Math.floor(posy/10)][Math.floor(posx/10)-2] == 0 && map[Math.floor(posy/10)-1][Math.floor(posx/10)-2] == 0) posx -= speed;
	if (right && map[Math.floor(posy/10)][Math.floor(posx/10)+1] == 0 && map[Math.floor(posy/10)-1][Math.floor(posx/10)+1] == 0) posx += speed;
	
	for (i = 0; i <= tower.length-1; i++) {
		if (posx - tower[i].posx < 0) {
			angle = Math.atan((posy - tower[i].posy)/(posx - tower[i].posx)) - Math.PI;
		} else {
			angle = Math.atan((posy - tower[i].posy)/(posx - tower[i].posx));
		}
		//delta = Math.acos((15*Math.sqrt(Math.pow(posy - tower[i]["posy"],2)+Math.pow(posx - tower[i]["posx"],2)))/(Math.cos(tower[i].dof)*15+(posx - tower[i]["posx"]) + (Math.sin(tower[i].dof)*15+(posy - tower[i]["posy"]))));
		if (angle - tower[i].dof > towerSpeed) {
			tower[i].dof += towerSpeed;
		} else if (angle - tower[i].dof > 0) {
			tower[i].dof += angle - tower[i].dof;
		} else if (angle - tower[i].dof < -towerSpeed) {
			tower[i].dof -= towerSpeed;
		} else if (angle - tower[i].dof > 0) {
			tower[i].dof -= angle - tower[i].dof;
		}
		if (tower[i].lf < towerFireInterval) {
			tower[i].lf++;
		} else if (tower[i].lf >= towerFireInterval) {
			tower[i].lf = 0;
			fireTower(i);
		}
	}

	for (i = 0; i <= tanks.length-1; i++) {
 		if (tanks[i].te == 0) {
			tanks[i].posx = (tanks[i].end0x - tanks[i].end1x)/tanks[i].speed + tanks[i].posx;
			tanks[i].posy = (tanks[i].end0y - tanks[i].end1y)/tanks[i].speed + tanks[i].posy;
			if ((tanks[i].posx - tanks[i].end0x)/((tanks[i].end0x - tanks[i].end1x)/tanks[i].speed) >= 0 || (tanks[i].posy - tanks[i].end0y)/((tanks[i].end0y - tanks[i].end1y)/tanks[i].speed) >= 0)
				tanks[i].te = 1;
		} else {
			tanks[i].posx = (tanks[i].end1x - tanks[i].end0x)/tanks[i].speed + tanks[i].posx;
			tanks[i].posy = (tanks[i].end1y - tanks[i].end0y)/tanks[i].speed + tanks[i].posy;
			if ((tanks[i].posx - tanks[i].end1x)/((tanks[i].end1x - tanks[i].end0x)/tanks[i].speed) >= 0 || (tanks[i].posy - tanks[i].end1y)/((tanks[i].end1y - tanks[i].end0y)/tanks[i].speed) >= 0)
				tanks[i].te = 0;
		}
		if (posx - tanks[i].posx < 0) {
			angle = Math.atan((posy - tanks[i].posy)/(posx - tanks[i].posx)) - Math.PI;
		} else {
			angle = Math.atan((posy - tanks[i].posy)/(posx - tanks[i].posx));
		}
		if (angle - tanks[i].dof > towerSpeed) {
			tanks[i].dof += towerSpeed;
		} else if (angle - tanks[i].dof > 0) {
			tanks[i].dof += angle - tanks[i].dof;
		} else if (angle - tanks[i].dof < -towerSpeed) {
			tanks[i].dof -= towerSpeed;
		} else if (angle - tanks[i].dof > 0) {
			tanks[i].dof -= angle - tanks[i].dof;
		}
		if (tanks[i].lf < towerFireInterval) {
			tanks[i].lf++;
		} else if (tanks[i].lf >= towerFireInterval) {
			tanks[i].lf = 0;
			fireTank(i);
		}
	}

	for (i = 0; i <= missile.length-1; i++) {
		missile[i].posx += missile[i].velx;
		missile[i].posy += missile[i].vely;
		if (map[Math.floor((missile[i].posy)/10)] && map[Math.floor((missile[i].posy)/10)][Math.floor((missile[i].posx)/10)] == 1) {
			explosions[explosions.length] = new explosion(missile[i].posx,missile[i].posy,15+Math.floor(Math.random()*30));
			missile.splice(i,1);
		}
		if (missile[i].posx >= posx - 15 && missile[i].posx <= posx + 10 && missile[i].posy >= posy - 15 && missile[i].posy <= posy + 10) {
			explosions[explosions.length] = new explosion(missile[i].posx,missile[i].posy,15+Math.floor(Math.random()*30));
			missile.splice(i,1);
			gameOver();
		}
	}
}

function render() {
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, 720, 480);

	for (i = 0; i <= 47; i+=1) {
		for (j = 0; j <= 71; j+=1) {
			switch (map[i][j]) {
				case (1):	ctx.fillStyle = "#000";
							ctx.fillRect(j*10, i*10, 10, 10);
							break;
				case (2):	ctx.fillStyle = "#0F0";
							ctx.fillRect(j*10, i*10, 10, 10);
							break;
			}
		}
	}

	ctx.strokeStyle = "#000";
	ctx.fillStyle = "#0F0";
	for (i = 0; i <= tower.length-1; i++) {
		ctx.fillRect(tower[i].posx,tower[i].posy,10,10);
		ctx.beginPath();
		ctx.lineTo(tower[i].posx+5, tower[i].posy+5);
		ctx.lineTo(tower[i].posx+5+Math.cos(tower[i].dof)*15, tower[i].posy+5+Math.sin(tower[i].dof)*15);
		ctx.stroke();
	}

	ctx.fillStyle = "#603";
	for (i = 0; i <= tanks.length-1; i++) {
		ctx.fillRect(tanks[i].posx,tanks[i].posy,10,10);
		ctx.beginPath();
		ctx.lineTo(tanks[i].posx+5, tanks[i].posy+5);
		ctx.lineTo(tanks[i].posx+5+Math.cos(tanks[i].dof)*15, tanks[i].posy+5+Math.sin(tanks[i].dof)*15);
		ctx.stroke();
	}

	ctx.fillStyle = "#F00";
	for (i = 0; i <= missile.length-1; i++) {
		ctx.fillRect(missile[i].posx-2,missile[i].posy-2,4,4);
	}

	ctx.fillStyle = "#F00";
	ctx.strokeStyle = "#A00";
	for (i = 0; i <= explosions.length-1; i++) {
		if (explosions[i].state <= 5) {
			ctx.beginPath();
			ctx.arc(explosions[i].posx,explosions[i].posy,explosions[i].rad*explosions[i].state/5,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			explosions[i].state++;
		} else {
			explosions.splice(i,1);
		}
	}

	ctx.fillStyle = "#00A"
	ctx.fillRect(posx-15,posy-15,25,25);
	ctx.fillStyle = "#0CF"
	ctx.fillRect(posx-4.5,posy-4.5,4,4);
}

function fireTower(towerno) {
	newno = missile.length;
	missile[newno] = new fireMissile(tower[towerno].posx+5,tower[towerno].posy+5,missileVelocity*Math.cos(tower[towerno].dof),missileVelocity*Math.sin(tower[towerno].dof));
}

function fireTank(tankno) {
	newno = missile.length;
	missile[newno] = new fireMissile(tanks[tankno].posx+5,tanks[tankno].posy+5,missileVelocity*Math.cos(tanks[tankno].dof),missileVelocity*Math.sin(tanks[tankno].dof));
}

var up = false;
var down = false;
var left = false;
var right = false;

function bill(e) {
	if (menu) {
		switch(e.keyCode) {
			case (86): 	document.getElementById('menu').style.display = 'none'; menu = false; initialise(0);
						break;
			case (66):	document.getElementById('menu').style.display = 'none'; menu = false; initialise(1);
						break;
			case (78):	document.getElementById('menu').style.display = 'none'; menu = false; initialise(2);
						break;
			case (77):	document.getElementById('menu').style.display = 'none'; menu = false; initialise(3);
		}
	} else {
		switch(e.keyCode) {
			case (38): 	up = true;
						break;
			case (40):	down = true;
						break;
			case (37):	left = true;
						break;
			case (39):	right = true;
		}
	}
}
function billfel(e) {
	switch(e.keyCode) {
		case (38): 	up = false;
					break;
		case (40):	down = false;
					break;
		case (37):	left = false;
					break;
		case (39):	right = false;
	}
}