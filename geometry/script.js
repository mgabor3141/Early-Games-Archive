document.onmousemove=mouseMove;

var ctx, p, up, down, left, right, mx, my, ns, paused, losthp, gothp, hpget, gameover, next, images, flare, loaded;
var difficulty = true;

//constants
var KILLPRICE = 5;
var REDUCEPRICE = 0;
var HPGETRATE = 800;

var nodeValues = new Array();
	nodeValues[0] = [4,5,6,7,8]; // speed (px)
	nodeValues[1] = [25,15,10,5,3]; // weapon (ticks)

var nodePrices = new Array(); // in credits/currency (cr)
	nodePrices[0] = [0,100,100,300,600]; // speed
	nodePrices[1] = [0,150,200,300,600]; // weapon
	nodePrices[2] = [0,400,300,300,800]; // weapon special
	nodePrices[3] = [250]; // bombs

var nodeStates = new Array();

function Player(x,y) {
	this.x = x;
	this.y = y;
	this.l = 0;		// level
	this.xp = 0;
	this.ms = nodeValues[0][0];	//move speed

	this.ccd = nodeValues[1][0];	// constant for primary weapon cooldown
	this.cd = this.ccd;	// primary weapon cooldown
	this.ss = 12;	// primary weapon shot speed
	this.bm = 0;	// bombs
	this.hp = 10;	// health
	this.cr = 0;	// credits
	this.tcr = this.cr	// score
}

var bullets = [];
function Bullet(x,y,vx,vy) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.b = 0;
}

var enemies = [];
function Enemy(l,x,y) {
	this.l = l;
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.t = 30;
}

var particles = [];
function Particle(x,y,c) {
	this.x = x;
	this.y = y;
	this.c = c;
	this.t = 0;
}

var explosions = [];
function Explosion(x,y,r) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.t = 0;
}

function preload() {
	images = new Image();
	images.onload = function(){ document.getElementById("gamestart").className = "button newgame"; loaded = true; };
	images.src = "img/images.png";
	flare = new Image();
	flare.src = "img/flare.png"
}

function initialize() {
	canvas = document.getElementById('canvas');
	if (!canvas.getContext) return;
	ctx = canvas.getContext('2d');
	ns = 150;
	paused = false;
	losthp = 0;
	gothp = 0;
	hpget = HPGETRATE;

	explosions = [];
	particles = [];
	enemies = [];
	bullets = [];

	nodeStates[0] = 0; // speed
	nodeStates[1] = 0; // weapon
	nodeStates[2] = 0; // weapon special

	document.getElementById("pausemenu").style.background = "url(img/pausemenu.png) no-repeat center top";
	document.getElementById("pausemenu").style.backgroundColor = "rgba(0,0,0,0.8)";
	document.getElementById("mainmenu").style.display = "none";
	document.getElementById("instructions").style.display = "none";
	document.getElementById("hud").style.display = "block";

	p = new Player(480,270);
	enemies[enemies.length] = new Enemy(0,800,100);
	up, down, left, right = false;
	gameover = false;

	game();
}

function game() {
	if (!paused) {
		tick();
		render();
	}
	next = setTimeout("game()",20);
}

function tick () {
	if (up && p.y > 27) p.y -= p.ms;
	if (down && p.y < 507) p.y += p.ms;
	if (left && p.x > 27) p.x -= p.ms;
	if (right && p.x < 927) p.x += p.ms;

	if (p.cd == 0) {
		angle = Math.atan((my-p.y)/(mx-p.x));
		if (mx - p.x < 0) angle += Math.PI;
		if (!gameover) bullets[bullets.length] = new Bullet(p.x,p.y,Math.cos(angle)*p.ss,Math.sin(angle)*p.ss);
		document.getElementById('s_shoot').play();
		p.cd = p.ccd;
	} else {
		p.cd--;
	}

	for (i = 0; i < enemies.length; i++) {
		if (enemies[i].t > 0) {
			enemies[i].t--;
		} else {
			angle = Math.atan((p.y-enemies[i].y)/(p.x-enemies[i].x));
			if (p.x-enemies[i].x < 0) angle += Math.PI;
			enemies[i].vx = Math.cos(angle)*4/(difficulty?1:2); // += ; *0.2
			enemies[i].vy = Math.sin(angle)*4/(difficulty?1:2);
			for (j = 0; j < enemies.length; j++) {
				if (i != j && Math.abs(enemies[i].x - enemies[j].x) <= 24 && Math.abs(enemies[i].y - enemies[j].y) <= 24) {
					angle = Math.atan((enemies[i].y - enemies[j].y)/(enemies[i].x - enemies[j].x));
					if (enemies[i].x - enemies[j].x < 0) angle += Math.PI;
					enemies[i].vx += Math.cos(angle)*0.4;
					enemies[i].vy += Math.sin(angle)*0.4;
				}
			}
			if (!gameover) enemies[i].x += enemies[i].vx;
			if (!gameover) enemies[i].y += enemies[i].vy;
			if (enemies[i].x <= 16 || enemies[i].x >= 944) {
				enemies[i].x -= enemies[i].vx;
				enemies[i].vx = 0;
			}		
			if (enemies[i].y <= 16 || enemies[i].y >= 524) {
				enemies[i].y -= enemies[i].vy;
				enemies[i].vy = 0;
			}
			if (Math.abs(p.x - enemies[i].x) <= 26 && Math.abs(p.y - enemies[i].y) <= 26) {
				p.hp--;
				losthp = 10;
				if (p.hp == 9) hpget = HPGETRATE;
				document.getElementById('s_losthp').play();
				enemies.splice(i,1);
			}
		}
	}

	for (i = 0; i < bullets.length; i++) {
		detectCollision(i);
	}

	for(i = 0; i < particles.length; i++) {
		if (particles[i].t < 5) {
			particles[i].t++;
		} else {
			particles.splice(i,1);
		}
	}

	for (i = 0; i < bombs.length; i++) {
		if (bombs[i].t == 0) {
			explosions[explosions.length] = new Explosion(bombs[i].x,bombs[i].y,500);
			document.getElementById('s_explosion').play();
			bombs.splice(i,1);
		} else {
			bombs[i].x += Math.ceil((bombs[i].tx-bombs[i].x)*0.08)
			bombs[i].y += Math.ceil((bombs[i].ty-bombs[i].y)*0.08)
			bombs[i].t--;
		}
	}

	for (i = 0; i < explosions.length; i++) {
		for (j = 0; j < enemies.length; j++) {
			//if (Math.abs(enemies[j].x-explosions[i].x) <= explosions[i].t*(explosions[i].r-10)/50 && Math.abs(enemies[j].y-explosions[i].y) <= explosions[i].t*(explosions[i].r-10)/50) {
			 if (Math.sqrt(Math.pow(enemies[j].x-explosions[i].x,2)+Math.pow(enemies[j].y-explosions[i].y,2)) <= explosions[i].t*(explosions[i].r-10)/50) {
				particles[particles.length] = new Particle(enemies[j].x,enemies[j].y,enemies[j].l);
				enemies.splice(j,1);
				if (!gameover) p.cr += KILLPRICE;
				if (!gameover) p.tcr += KILLPRICE;
			}
		}
		explosions[i].t++;
		if (explosions[i].t == 25) explosions.splice(i,1);
	}

	if (hpget == 0) {
		hpget = HPGETRATE;
		if (p.hp < 10) {
			p.hp++;
			gothp = 10;
			document.getElementById('s_gothp').play();
		}
	} else {
		hpget--;
	}

	if (ns == 0) {
		if (p.tcr >= 4100) {
			ns = 20;
		} else if (p.tcr == 0){
			ns = 30;
		} else {
			ns = Math.floor(40+Math.ceil(Math.random()*((p.tcr/100)%2?140:50))/(p.tcr/100)*0.04)+(enemies.length >= 3 ? (enemies.length*5-15) : 0);
		}
		sx = 60+Math.ceil(Math.random()*840);
		sy = 60+Math.ceil(Math.random()*420);
		switch (Math.floor(Math.random()*Math.floor(p.tcr/200))%12) {
			case (0):	enemies[enemies.length] = new Enemy(0,sx,sy);
						break;
			case (1):	enemies[enemies.length] = new Enemy(0,sx,sy-14);
						enemies[enemies.length] = new Enemy(0,sx-16,sy+16);
						enemies[enemies.length] = new Enemy(0,sx+16,sy+16);
						break;
			case (2):	enemies[enemies.length] = new Enemy(1,sx,sy);
						break;
			case (3):	enemies[enemies.length] = new Enemy(1,sx-14,sy-14);
						enemies[enemies.length] = new Enemy(1,sx-14,sy+14);
						enemies[enemies.length] = new Enemy(1,sx+14,sy-14);
						enemies[enemies.length] = new Enemy(1,sx+14,sy+14);
						break;
			case (4):	enemies[enemies.length] = new Enemy(0,sx,sy-14);
						enemies[enemies.length] = new Enemy(1,sx-16,sy+16);
						enemies[enemies.length] = new Enemy(1,sx+16,sy+16);
						break;
			case (5):	enemies[enemies.length] = new Enemy(2,sx,sy-50);
						enemies[enemies.length] = new Enemy(2,sx-42,sy-16);
						enemies[enemies.length] = new Enemy(2,sx+42,sy-16);
						enemies[enemies.length] = new Enemy(2,sx-28,sy+40);
						enemies[enemies.length] = new Enemy(2,sx+28,sy+40);
						break;
			case (6):	enemies[enemies.length] = new Enemy(0,sx-40,sy-40);
						enemies[enemies.length] = new Enemy(0,sx-40,sy);
						enemies[enemies.length] = new Enemy(0,sx-40,sy+40);
						enemies[enemies.length] = new Enemy(0,sx,sy-40);
						enemies[enemies.length] = new Enemy(1,sx,sy);
						enemies[enemies.length] = new Enemy(0,sx,sy+40);
						enemies[enemies.length] = new Enemy(0,sx+40,sy-40);
						enemies[enemies.length] = new Enemy(0,sx+40,sy);
						enemies[enemies.length] = new Enemy(0,sx+40,sy+40);
						break;
			case (7):	enemies[enemies.length] = new Enemy(3,sx,sy-50);
						enemies[enemies.length] = new Enemy(3,sx-40,sy-20);
						enemies[enemies.length] = new Enemy(3,sx+40,sy-20);
						enemies[enemies.length] = new Enemy(3,sx-40,sy+20);
						enemies[enemies.length] = new Enemy(3,sx+40,sy+20);
						enemies[enemies.length] = new Enemy(3,sx,sy+50);
						break;
			case (8):	enemies[enemies.length] = new Enemy(3,sx-40,sy-40);
						enemies[enemies.length] = new Enemy(3,sx-40,sy);
						enemies[enemies.length] = new Enemy(3,sx-40,sy+40);
						enemies[enemies.length] = new Enemy(3,sx,sy-40);
						enemies[enemies.length] = new Enemy(3,sx,sy);
						enemies[enemies.length] = new Enemy(3,sx,sy+40);
						enemies[enemies.length] = new Enemy(3,sx+40,sy-40);
						enemies[enemies.length] = new Enemy(3,sx+40,sy);
						enemies[enemies.length] = new Enemy(3,sx+40,sy+40);
						break;
			case (9):	enemies[enemies.length] = new Enemy(2,sx,sy);
						enemies[enemies.length] = new Enemy(3,sx-10,sy-10);
						enemies[enemies.length] = new Enemy(3,sx-10,sy);
						enemies[enemies.length] = new Enemy(3,sx-10,sy+10);
						enemies[enemies.length] = new Enemy(3,sx,sy-10);
						enemies[enemies.length] = new Enemy(3,sx,sy+10);
						enemies[enemies.length] = new Enemy(3,sx+10,sy-10);
						enemies[enemies.length] = new Enemy(3,sx+10,sy);
						enemies[enemies.length] = new Enemy(3,sx+10,sy+10);
						break;
			case (10):	enemies[enemies.length] = new Enemy(3,sx-40,sy-40);
						enemies[enemies.length] = new Enemy(3,sx-40,sy);
						enemies[enemies.length] = new Enemy(3,sx-40,sy+40);
						enemies[enemies.length] = new Enemy(3,sx,sy-40);
						enemies[enemies.length] = new Enemy(3,sx,sy);
						enemies[enemies.length] = new Enemy(3,sx,sy+40);
						enemies[enemies.length] = new Enemy(3,sx+40,sy-40);
						enemies[enemies.length] = new Enemy(3,sx+40,sy);
						enemies[enemies.length] = new Enemy(3,sx+40,sy+40);
						break;
			case (11):	enemies[enemies.length] = new Enemy(1,sx,sy);
						enemies[enemies.length] = new Enemy(2,sx-10,sy-10);
						enemies[enemies.length] = new Enemy(2,sx-10,sy);
						enemies[enemies.length] = new Enemy(2,sx-10,sy+10);
						enemies[enemies.length] = new Enemy(2,sx,sy-10);
						enemies[enemies.length] = new Enemy(2,sx,sy+10);
						enemies[enemies.length] = new Enemy(2,sx+10,sy-10);
						enemies[enemies.length] = new Enemy(2,sx+10,sy);
						enemies[enemies.length] = new Enemy(2,sx+10,sy+10);
		}
	}
	ns--;
	if (enemies.length == 0 && ns >= 20) ns = 20;
	document.getElementById("console").innerHTML = p.cr + " [" + p.tcr + "] | " + ns + " | hp: "+p.hp+" ("+hpget+")";
	if (p.cr > document.getElementById("hud").innerHTML) { 
		document.getElementById("hud").innerHTML = parseInt(document.getElementById("hud").innerHTML)+2;
	} else {
		document.getElementById("hud").innerHTML = p.cr;
	}

	if (p.hp <= 0 && !gameover) {
		gameover = true;
		hpget = -1;
		ns = -1;
		explosions[explosions.length] = new Explosion(p.x,p.y,1000);
		document.getElementById('s_explosion').play();
	}
	if (gameover && explosions.length == 0) {
		document.getElementById("pausemenu").style.background = "url(img/gameover.png) no-repeat center top";
		document.getElementById("pausemenu").style.backgroundColor = "rgba(0,0,0,0.8)";
		pausemenu();
	}
}

function detectCollision(i) {
	bullets[i].x += bullets[i].vx;
	bullets[i].y += bullets[i].vy;
	if (nodeStates[2] >= 2) {
		if (bullets[i].x <= 5 || bullets[i].x >= 955) {
			if (bullets[i].b == 1) {
				bullets.splice(i,1);
				return;
			} else {
				bullets[i].vx = -bullets[i].vx;
				bullets[i].b++;
			}
		}
		if (bullets[i].y <= 5 || bullets[i].y >= 535) {
			if (bullets[i].b == 1) {
				bullets.splice(i,1);
				return;
			} else {
				bullets[i].vy = -bullets[i].vy;
				bullets[i].b++;
			}
		}
	} else if (bullets[i].x <= 5 || bullets[i].x >= 955 || bullets[i].y <= 5 || bullets[i].y >= 535) {
		bullets.splice(i,1);
		return;
	}
	for (j = 0; j < enemies.length; j++) {
		if (enemies[j].t == 0 && Math.abs(bullets[i].x - enemies[j].x) <= 15 && Math.abs(bullets[i].y - enemies[j].y) <= 15) {
			if (enemies[j].l == 0) {
				particles[particles.length] = new Particle(enemies[j].x,enemies[j].y,0);
				document.getElementById("s_collide").play();
				enemies.splice(j,1);
				p.cr += KILLPRICE;
				p.tcr += KILLPRICE;
			} else {
				particles[particles.length] = new Particle(enemies[j].x,enemies[j].y,enemies[j].l);
				if ((nodeStates[2] >= 1 && Math.floor(Math.random()*2) == 1) || (nodeStates[2] >= 3)) {
					if (enemies[j].l >= 2) {
						particles[particles.length] = new Particle(enemies[j].x,enemies[j].y,enemies[j].l);
						document.getElementById("s_collide").play();
						enemies[j].l--;
						enemies[j].vx += bullets[i].vx*0.8;
						enemies[j].vy += bullets[i].vy*0.8;
						p.cr += 2*REDUCEPRICE;
						p.tcr += 2*REDUCEPRICE;
					} else if (enemies[j].l <= 1) {
						particles[particles.length] = new Particle(enemies[j].x,enemies[j].y,enemies[j].l);
						document.getElementById("s_collide").play();
						enemies.splice(j,1);
						p.cr += KILLPRICE+REDUCEPRICE;
						p.tcr += KILLPRICE+REDUCEPRICE;
					}
				} else {
					particles[particles.length] = new Particle(enemies[j].x,enemies[j].y,enemies[j].l);
					document.getElementById("s_collide").play();
					enemies[j].l--;
					enemies[j].vx += bullets[i].vx*0.8;
					enemies[j].vy += bullets[i].vy*0.8;
					p.cr += REDUCEPRICE;
					p.tcr += REDUCEPRICE;
				}
			}
			if (nodeStates[2] == 4 && bullets[i].b == 0) {
				angle = Math.atan(bullets[i].vy/bullets[i].vx);
				if (mx - p.x < 0) angle += Math.PI;
				bullets[bullets.length] = new Bullet(bullets[i].x,bullets[i].y,Math.cos(angle+Math.PI/6)*p.ss,Math.sin(angle+Math.PI/6)*p.ss);
				bullets[bullets.length-1].b = 1;
				bullets[bullets.length] = new Bullet(bullets[i].x,bullets[i].y,Math.cos(angle-Math.PI/6)*p.ss,Math.sin(angle-Math.PI/6)*p.ss);
				bullets[bullets.length-1].b = 1;
			}
			bullets.splice(i,1);
			return;
		}
	}
}

function render() {
	ctx.clearRect(0,0,960,540);
	ctx.globalAlpha = 1-losthp*0.08;
	if (!gameover) ctx.drawImage(images,54*p.l,0,54,54,p.x-24,p.y-24,54,54);
	ctx.globalAlpha = 1;

	ctx.fillStyle = "#0F0";
	for (i = 0; i < bullets.length; i++) {
		ctx.drawImage(images,17*nodeStates[2],54,17,17,bullets[i].x-8.5,bullets[i].y-8.5,17,17);
	}

	for (i = 0; i < explosions.length; i++) {
		ctx.drawImage(images,128,104,200,200,explosions[i].x-explosions[i].t*(explosions[i].r-10)/50,explosions[i].y-explosions[i].t*(explosions[i].r-10)/50,explosions[i].t*(explosions[i].r-10)/25,explosions[i].t*(explosions[i].r-10)/25);
	}
	
	for(i = 0; i < particles.length; i++) {
		ctx.drawImage(images,particles[i].c*32,103+particles[i].t*32,32,32,particles[i].x-24,particles[i].y-24,48,48);
	}

	for (i = 0; i < enemies.length; i++) {
		if (enemies[i].t > 0) ctx.globalAlpha = 1-enemies[i].t*0.03;
		ctx.drawImage(images,32*enemies[i].l,71,32,32,enemies[i].x-(16+enemies[i].t*0.3),enemies[i].y-(16+enemies[i].t*0.3),32+enemies[i].t*0.6,32+enemies[i].t*0.6);
		ctx.globalAlpha = 1;
	}

	for (i = 0; i < bombs.length; i++) {
		ctx.globalAlpha = 0.9;
		if ((bombs[i].t >= 72 && bombs[i].t <= 78) || (bombs[i].t >= 32 && bombs[i].t <= 38) || (bombs[i].t >= 22 && bombs[i].t <= 28)) ctx.globalAlpha = 0.95;
		if ((bombs[i].t >= 74 && bombs[i].t <= 76) || (bombs[i].t >= 34 && bombs[i].t <= 36) || (bombs[i].t >= 24 && bombs[i].t <= 26)) ctx.globalAlpha = 1;
		ctx.drawImage(flare,bombs[i].x-440,bombs[i].y-100);
		ctx.globalAlpha = 1;
	}

	for (i = 0; i < p.bm; i++) {
		ctx.drawImage(images,104,54,17,17,5+i*17,498,17,17);
	}

	for (i = 1; i < p.hp; i++) {
		ctx.drawImage(images,85,54,19,17,-9+i*14,518,19,17);
	}
	if (gothp > 0) {
		ctx.globalAlpha = 1-gothp*0.1;
		ctx.drawImage(images,85,54,19,17,-9+i*14+gothp*3,518,19,17);
		ctx.globalAlpha = gothp*0.1;
		ctx.drawImage(images,128,54,50,50,455-5*(10-gothp),245-5*(10-gothp),50+10*(10-gothp),50+10*(10-gothp));
		ctx.globalAlpha = 1;
		gothp--;
	} else if (p.hp > 0) {
		ctx.drawImage(images,85,54,19,17,-9+i*14,518,19,17);
	}
	if (losthp > 0) {
		ctx.globalAlpha = losthp*0.1;
		ctx.drawImage(images,85,54,19,17,35+i*14-losthp*3,518,19,17);
		ctx.globalAlpha = 1;
		losthp--;
	}
}

var bombs = new Array();
function Bomb(x,y) {
	this.x = p.x;
	this.y = p.y;
	this.tx = x;
	this.ty = y;
	this.t = 100;
}
function throwBomb() {
	if (p.bm > 0) {
		p.bm--;
		bombs[bombs.length] = new Bomb(mx,my);
		document.getElementById('s_shoot').play();
	}
}

function pausemenu() {
	if (gameover) {
		redrawNodes();
		document.getElementById("pausemenu").style.display = "block";
		document.getElementById("menubutton").style.display = "block";
		paused = true;
	} else {
		if (paused) {
			document.getElementById("pausemenu").style.display = "none";
			toolout();
			paused = false;
		} else {
			redrawNodes();
			document.getElementById("pausemenu").style.display = "block";
			paused = true;
		}
	}
}

// public code copied from w3schools.com

function setCookie(c_name,value,exdays) {
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

// end of copied code

function redrawNodes() {
	document.getElementById("hud").innerHTML = p.cr;
	for (i = 0; i <= 2; i++) {
		for (j = 1; j <= 4; j++) {
			if (nodeStates[i] >= j) {
				document.getElementById(i+"_"+j).src = "img/node_"+((j==1)?"first_gotten":((j==4)?"max_gotten":"gotten"))+".png";
				document.getElementById(i+"__"+j).onclick = "";
				document.getElementById(i+"__"+j).onmouseover = "";
			} else {
				document.getElementById(i+"_"+j).src = "img/node_"+((j==1)?"first_available":((j==4)?"max_available":"available"))+".png";
				document.getElementById(i+"__"+j).onclick = function(){buyNode(this.id)};
				document.getElementById(i+"__"+j).onmouseover = function(){tooltip(this.id)};
				document.getElementById(i+"__"+j).onmouseout = function(){toolout()};
				document.getElementById("mask"+i+"_"+j).style.display = (nodePrices[i][j] <= p.cr && nodeStates[i]+1 == j) ? "none" : "block";
			}
		}
	}
	document.getElementById("mask3_1").style.display = (250 <= p.cr && p.bm < 9) ? "none" : "block";
	document.getElementById("bmn").innerHTML = p.bm;
	document.getElementById("bmn").style.backgroundImage = "url(img/node_bm_"+(p.bm == 9?"gotten":"available")+".png)";
	if (getCookie("highscore"+difficulty) == null || getCookie("highscore"+difficulty) < p.tcr) {
		setCookie("highscore"+difficulty,p.tcr,1);
	}
	document.getElementById("score").innerHTML = p.tcr + "<br><span>"+getCookie("highscore"+difficulty)+"</span>"
	render();
}

function buyNode(id) {
	c = id.charAt(0);
	n = id.charAt(3);
	if (!gameover && nodePrices[c][n] <= p.cr && nodeStates[c]+1 == n) {
		nodeStates[c]++;
		p.cr -= nodePrices[c][n];
		document.getElementById("hud").innerHTML = p.cr;
		p.l = nodeStates[0];
		p.ms = nodeValues[0][nodeStates[0]];
		p.ccd = nodeValues[1][nodeStates[1]];
		redrawNodes();
		toolout();
	}
}

var tooltexts = new Array();
	tooltexts[0] = ["","+25% Movement speed","+25% Movement speed","+25% Movement speed","+25% Movement speed"];
	tooltexts[1] = ["","3.3 shots per second","5 shots per second","10 shots per second","17 shots per second"];
	tooltexts[2] = ["","50% chance to destroy two levels on impact","Bullets bounce from walls","100% chance to destroy two levels on impact","Bullet splits into two bullets on impact"];
	tooltexts[3] = ["","Throw grenades with the SHIFT or the V key"];
function tooltip(id) {
	c = id.charAt(0);
	n = id.charAt(3);
	document.getElementById("tip").innerHTML = tooltexts[c][n];
	document.getElementById("tip").style.top = (180 + 80*c) + "px";
	document.getElementById("tip").style.left = (120 + 156*n) + "px";
	document.getElementById("tip").style.display = "block";
}
function toolout() {
	document.getElementById("tip").style.display = "none";
}

function keyDown(e) {
	switch(e.keyCode) {
		case (32):	pausemenu();
					e.preventDefault();
					break;
		case (27):	pausemenu();
					break;
		case (87): 	up = true;
					break;
		case (65): 	left = true;
					break;
		case (83): 	down = true;
					break;
		case (68): 	right = true;
					break;
		case (86):	throwBomb();
					break;
		case (16):	throwBomb();
					break;
		//case (67):	paused = !paused;
					//break;
		case (73):	document.getElementById("console").style.display = document.getElementById("console").style.display != "block" ? "block" : "none";
	}
}
function keyUp(e) {
	switch(e.keyCode) {
		case (87): 	up = false;
					break;
		case (65): 	left = false;
					break;
		case (83): 	down = false;
					break;
		case (68): 	right = false;
	}
}
function mouseMove(e) {
	if (e == null) var e = window.event;
	mx = e.clientX;
	my = e.clientY;
}