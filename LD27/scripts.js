window.addEventListener("load", initialize, false);

var ctx, bctx;
var p1, p2, level, hotkey;
var imgl = [];
var debug = false;

var JUMP_INTERVAL = 5;
var DJUMP_INTERVAL = 15;
var JUMP_FORCE = 12;
var SHOT_COOLDOWN = 8;
var AMMO_RECHARGE = 50;
var MAX_AMMO = 2;
var SPAWN_PROTECT = 25;

var time;

var score_p1 = 0;
var score_p2 = 0;

function Player(x,y) {
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.dbj = 1;
	this.ja = JUMP_INTERVAL;
	this.dja = DJUMP_INTERVAL;
	this.g = 0; //ground

	this.sp = SPAWN_PROTECT;

	this.sc = SHOT_COOLDOWN;
	this.ar = 0;
	this.ammo = MAX_AMMO;

	this.score = 0;

	this.kill = function (alpha) {
		for (j = 0; j < 80; j++) {
			particles[particles.length] = new Particle(this.x-10+Math.random()*20,this.y-35+Math.random()*65,alpha,this);
		}
		this.spawn();
	}
	
	this.spx = x;
	this.spy = y;
	this.spawn = function () {
		this.x = this.spx;
		this.y = this.spy;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.sp = SPAWN_PROTECT;
	}

	this.up = 0;
	this.left = 0;
	this.right = 0;
	this.shoot = 0;
}

var bullets = [];
function Bullet(x,y,d,c) {
	this.x = x;
	this.y = y;
	this.alpha = d*Math.PI-0.05+0.1*Math.random()
	this.vx = Math.cos(this.alpha)*12;
	this.vy = Math.sin(this.alpha)*12;
	this.c = c;
}

var particles = [];
function Particle(x,y,alpha,c) {
	beta = Math.random()*2*Math.PI;
	this.x = x;
	this.y = y;
	this.vx = Math.cos(alpha)*9+Math.cos(beta)*6;
	this.vy = -3+Math.sin(alpha)*9+Math.sin(beta)*6;
	this.fade = -1;
	this.c = c;
}

function initialize() {
	canvas = document.getElementById('canvas');
	if (!canvas.getContext) {
		alert("Too old browser!");
		return;
	}
	ctx = canvas.getContext('2d');
	bctx = document.getElementById('bg').getContext('2d');

	ctx.translate(-20,-20);

	ctx.save();

	p1 = new Player(60,295);
	p2 = new Player(980,295);

	loadImages();
}

function levelSelect(ttp) {
	hotkey = true;
	tt2 = -1000;
	document.getElementById("menu").style.display="none";
	document.getElementById("start").style.display="none";
	document.getElementById('level').style.display = "none";
	document.getElementById('replay').style.display = "none";
	document.getElementById('sfx').style.display = "none";
	document.getElementById('music').style.display = "none";
	newLevel();

	tt = ttp; transition1();
}

function newLevel() {
	generate();

	drawBg(true);

	ctx.clearRect(0, 0, 1020, 620);

	ctx.globalAlpha /= 1.5;
	ctx.fillStyle = "#EEE";
	ctx.fillRect(250,150,540,340);
	ctx.globalAlpha = 1;

	ctx.fillStyle = "#000";
	for (i = 0; i < level.length; i++) {
		for (j = 0; j < level[0].length; j++) {
			if (level[i][j] == 1) ctx.fillRect(260+j*20,160+i*20,20,20);
		}
	}
}

var tt;
function transition1() {
	tt--;
	if (tt <= -30) {
		document.getElementById("new").style.display="block";
		document.getElementById("tick").style.display="block";
		return;
	}
	
	ctx.clearRect(0,0,1020,620);
	ctx.globalAlpha = tt/30;
	ctx.drawImage(imgl["menu"],20,20);

	if (tt <= 0) {
		ctx.clearRect(0, 0, 1020, 620);

		ctx.globalAlpha = -tt/30;

		ctx.drawImage(imgl["new"],0,0,80,80,120,280,80,80);
		ctx.drawImage(imgl["tick"],0,0,80,80,840,280,80,80);

		ctx.globalAlpha /= 1.5;
		ctx.fillStyle = "#EEE";
		ctx.fillRect(250,150,540,340);
		ctx.globalAlpha *= 1.5;

		ctx.fillStyle = "#000";
		for (i = 0; i < level.length; i++) {
			for (j = 0; j < level[0].length; j++) {
				if (level[i][j] == 1) ctx.fillRect(260+j*20,160+i*20,20,20);
			}
		}
	}

	ctx.globalAlpha = 1;

	var next = setTimeout(transition1,15);
}

function startGame() {
	hotkey = false;
	tt2 = -1000;

	drawBg(false);
	document.getElementById("new").style.display="none";
	document.getElementById("tick").style.display="none";
	document.getElementById('level').style.display = "none";
	document.getElementById('replay').style.display = "none";

	if (music) document.getElementById("s_menu").pause();
	if (music) document.getElementById("s_game").play();

	time = 10000;
	p1 = new Player(60,295);
	p2 = new Player(980,295);
	
	game();
}

function endScreen() {
	if (p1.score > p2.score) score_p1++;
	if (p2.score > p1.score) score_p2++;

	p1.ax = 0;
	p1.ay = 0;
	p1.vx = (120-p1.x)/30;
	p1.vy = (300-p1.y)/30;

	p2.ax = 0;
	p2.ay = 0;
	p2.vx = (920-p2.x)/30;
	p2.vy = (300-p2.y)/30;

	tt2 = 215; transition2();
}

var tt2;
function transition2() {
	ctx.clearRect(0,0,1020,620);
	render();

	if (tt2 > 200) {
		ctx.globalAlpha = (tt2-200)/30;
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0,1020,620);
		ctx.globalAlpha = 1;
	} else if (tt2 == 30) {
		document.getElementById('level').style.display = "block";
		document.getElementById('replay').style.display = "block";
		drawBg(true);

		p1.ammo = 0;
		p1.ar = 0;
		p1.sp = 0;
		p2.ammo = 0;
		p2.ar = 0;
		p2.sp = 0;

		bullets = [];
		particles = [];
	} else if (tt2 < 30 && tt2 >= 0) {
		p1.x += p1.vx;
		p1.y += p1.vy;
		p2.x += p2.vx;
		p2.y += p2.vy;

		ctx.font="bold 180pt Courier New";
		ctx.fillStyle = "#00F";
		ctx.fillText(score_p1-(p1.score > p2.score && tt2 > 0?1:0),170,350);
		ctx.fillStyle = "#F70";
		ctx.fillText(score_p2-(p2.score > p1.score && tt2 > 0?1:0),870-ctx.measureText(score_p2-(p2.score > p1.score && tt2 > 0?1:0)).width,350);
		if (tt2 == 1) {
			if (sfx) document.getElementById("s_win").play();
			hotkey = true;
		}
	} else if (tt2 < 0) {
		if (p1.score > p2.score) {
			if (p1.y >= 299) { 
				p1.vy = -JUMP_FORCE
			}
			p1.vy += 0.7;
			p1.y += p1.vy;
		}
		if (p2.score > p1.score) {
			if (p2.y >= 299) {
				p2.vy = -JUMP_FORCE;
			}
			p2.vy += 0.7;
			p2.y += p2.vy;
		}

		ctx.font="bold 180pt Courier New";
		ctx.fillStyle = "#00F";
		ctx.fillText(score_p1,170,350);
		ctx.fillStyle = "#F70";
		ctx.fillText(score_p2,870-ctx.measureText(score_p2).width,350);
	}

	if (tt2 >= 0) {
		tt2--;
	}
	if (tt2 != -1000) {
		var next = setTimeout(transition2,15);
	}
}

function loadImages() {
	var img = [
		"count",
		"menu",
		"new",
		"tick"
	];
	for (i = 0; i < img.length; i++) {
		imgl[img[i]] = new Image();
		imgl[img[i]].src = "img/"+img[i]+".png";
	}
}

function generate() {
	level = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	];

	for (i = 1; i <= 24; i++) {
		for (j = 0; j < Math.abs(i-11)/2+Math.random()*3-2; j++) {
			level[j][i] = 1;
		}
	}
	for (i = 1; i <= 24; i++) {
		for (j = 15; j > 13-Math.abs(Math.abs(i-13)-5)/2+Math.random()*3; j--) {
			level[j][i] = 1;
		}
	}
	for (i = 1; i <= 2+Math.floor(Math.random()*2); i++) {
		island(Math.floor(5+Math.random()*14),Math.floor(6+Math.random()*4));
	}
	smooth();
	level[6][1] = 0; level[7][1] = 0;
	level[6][2] = 0; level[7][2] = 0;
	level[6][23] = 0; level[7][23] = 0;
	level[6][24] = 0; level[7][24] = 0;
	level[11][1] = 1; level[12][1] = 1; level[13][1] = 1;
	level[11][2] = 1; level[12][2] = 1; level[13][2] = 1;
	level[11][23] = 1; level[12][23] = 1; level[13][23] = 1;
	level[11][24] = 1; level[12][24] = 1; level[13][24] = 1;
	level[1][11] = 0; level[1][12] = 1; level[1][13] = 1; level[1][14] = 0;
}

function island(x,y) {
	for (j = x; j < x+Math.floor(2+Math.random()*6); j++) {
		level[y][j] = 1;
	}
	for (j = x+Math.floor(-3+Math.random()*8); j < x+Math.floor(2+Math.random()*7); j++) {
		level[y+1][j] = 1;
	}
}

function smooth() {
	for (i = 1; i < 23; i++) {
		for (j = 9; j < 15; j++) {
			oc = 0;
			if (level[j][i] == 1) {
				for (k = -1; k <= 1; k++) {
					for (l = -1; l <= 1; l++) {
						if (level[j+l][i+k] == 0) oc++;
					}
				}
			}
			if (oc >= 5) level[j][i] = 0;
		}
	}
}

function game() {
	tick();
	render();
	if (time > 0 || p1.score == p2.score) {
		if (time > -1000)time -= 15;
		var next = setTimeout(game,15);
	} else {
		endScreen();
	}
}

function tick() {
	handlePlayer(p1);
	handlePlayer(p2);

	for (i = 0; i < bullets.length; i++) {
		bullets[i].x += bullets[i].vx;
		bullets[i].y += bullets[i].vy;
		target = bullets[i].c == p1?p2:p1;

		if (
			bullets[i].x >= target.x-10 &&
			bullets[i].x <= target.x+10 &&
			bullets[i].y >= target.y-40 &&
			bullets[i].y <= target.y+25 &&
			!target.sp
		) {
			(bullets[i].c == p1?p2:p1).kill(bullets[i].alpha);
			bullets[i].c.score++;
			bullets.splice(i,1);
			if (sfx) document.getElementById("s_shatter").play();
		} else if (level[Math.floor(bullets[i].y/40)][Math.floor(bullets[i].x/40)] == 1) {
			bullets.splice(i,1);
		}
	}

	for (i = 0; i < particles.length; i++) {
		if (particles[i].fade > 0) {
			particles[i].fade--;
		} else if (particles[i].fade == 0) {
			particles.splice(i,1);
		} else if (level[Math.floor(particles[i].y/40)][Math.floor(particles[i].x/40)] == 1) {
			particles[i].fade = 150;
			particles[i].vx = 0;
			particles[i].vy = 0;
		} else {
			particles[i].vy += 0.7; // G
			particles[i].x += particles[i].vx;
			particles[i].y += particles[i].vy;
		}
	}
}

function handlePlayer(p) {
	p.vy += 0.7; // G (0.7)
	if (p.up && p.g && !p.ja) {
		p.ja = JUMP_INTERVAL;
		p.dja = DJUMP_INTERVAL;
		p.vy = -JUMP_FORCE;
		p.g = 0;
		p.dbj = 1;
		p.ax = 0;
		if (sfx) document.getElementById("s_jump1").play();
	} else if (p.up && p.dbj && !p.dja) {
		p.ja = JUMP_INTERVAL;
		p.vy = -JUMP_FORCE;
		p.dbj = 0;
		if (p.left) { p.vx = -5; p.ax = -1; } 
		if (p.right) { p.vx = 5; p.ax = 1; }
		if (sfx) document.getElementById("s_jump2").play();
	}
	if (
		level[Math.floor((p.y+p.vy+25)/40)][Math.floor((p.x+9)/40)] == 0 &&
		level[Math.floor((p.y+p.vy+25)/40)][Math.floor((p.x-10)/40)] == 0
	) {
		if (
			level[Math.floor((p.y+p.vy-40)/40)][Math.floor((p.x+9)/40)] == 0 &&
			level[Math.floor((p.y+p.vy-40)/40)][Math.floor((p.x-10)/40)] == 0
		) {
			p.y += p.vy;
			if (p.g == 1) {
				p.g = 0;
				p.dbj = 1;
				p.dja = DJUMP_INTERVAL;
			}
		} else {
			p.vy = 0;
			p.y = Math.round(p.y/40)*40;
		}
	} else {
		p.vy = 0;
		p.y = Math.round(p.y/40)*40+15;
		p.g = 1;
		if (p.ja > 0) p.ja--;
	}
	if (p.dja > 0) p.dja--;
	
	if (p.left) { p.ax = p.g?-1:-0.3; }
	if (p.right) { p.ax = p.g?1:0.3; }
	if (p.g && !p.left && !p.right) if (Math.abs(p.vx) < 0.1) {p.ax = 0; p.vx = 0; } else p.ax = -p.vx/4;

	p.vx += p.ax;
	p.vx = Math.abs(p.vx)>5?(p.vx<0?-5:5):p.vx;

	if (
		level[Math.floor((p.y-40)/40)][Math.floor((p.x+p.vx+10)/40)] == 0 &&
		level[Math.floor((p.y-40)/40)][Math.floor((p.x+p.vx-10)/40)] == 0 &&
		level[Math.floor(p.y/40)][Math.floor((p.x+p.vx+10)/40)] == 0 &&
		level[Math.floor(p.y/40)][Math.floor((p.x+p.vx-10)/40)] == 0 &&
		level[Math.floor((p.y+24)/40)][Math.floor((p.x+p.vx+10)/40)] == 0 &&
		level[Math.floor((p.y+24)/40)][Math.floor((p.x+p.vx-10)/40)] == 0
	) {
		p.x += p.vx;
	} else {
		p.vx = 0;
		p.ax = 0;
		p.x = Math.round(p.x/40)*40+10*(p.x%40>20?-1:1);
	}

	if (p.shoot == true && p.ammo > 0 && !p.sc && !p.sp) {
		bullets[bullets.length] = new Bullet(p.x,p.y-20,(eval(p) == p1)?(p1.x-p2.x>0?1:0):(p1.x-p2.x>0?0:1),eval(p));
		p.ammo--;
		p.sc = SHOT_COOLDOWN;
		if (sfx) document.getElementById("s_shoot").play();
	}
	if (p.sc > 0) p.sc--;

	if (p.ammo < MAX_AMMO) {
		if (p.ar == AMMO_RECHARGE) {
			p.ammo++;
			p.ar = 0;
		} else {
			p.ar++;
		}
	}

	if (p.sp > 0) p.sp--;
}

function drawBg(blur) {
	blur = (typeof blur === "undefined") ? 0 : blur;
	bctx.clearRect(0, 0, 1020, 620);

	bctx.fillStyle = "#000";
	for (i = 0; i < level.length; i++) {
		for (j = 0; j < level[0].length; j++) {
			if (level[i][j] == 1) bctx.fillRect(j*40-20,i*40-20,40,40);
		}
	}

	if (blur) {
		//bctx.globalAlpha = 0.3;
		//bctx.fillRect(0,0,1020,620);
		//bctx.globalAlpha = 1;
		stackBlurCanvasRGBA('bg', 0, 0, 1040, 640, 16);
		//document.getElementById('bg').style.webkitFilter = "blur(5px)";
	} else {
		//document.getElementById('bg').style.webkitFilter = "blur(0px)";
	}
}

function render() {
	ctx.clearRect(0, 0, 1020, 620);
	
	ctx.font="bold 13pt Courier New";

	ctx.globalAlpha = p1.sp == SPAWN_PROTECT?0:(p1.sp > 0?0.5:1);
	ctx.fillStyle = "#00F";
	ctx.fillRect(p1.x-10,p1.y-40,20,65);
	ctx.fillStyle = "#F70";
	for(i = 0; i < p1.score; i++) {
		ctx.fillRect(p1.x-10,p1.y-36+i*4+Math.floor(i/5)*2,20,2);
	}
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#00F";
	if (debug) {
		ctx.fillText("x = "+p1.x+" | y = "+p1.y+" | vx = "+p1.vx+" | vy = "+p1.vy, 100, 50);
		ctx.fillText("up = "+p1.up+" | g = "+p1.g+" | dbj = "+p1.dbj+" | s = "+p1.shoot, 100, 65);
	}

	ctx.globalAlpha = p2.sp == SPAWN_PROTECT?0:(p2.sp > 0?0.5:1);
	ctx.fillStyle = "#F70";
	ctx.fillRect(p2.x-10,p2.y-40,20,65);
	ctx.fillStyle = "#00F";
	for(i = 0; i < p2.score; i++) {
		ctx.fillRect(p2.x-10,p2.y-36+i*4+Math.floor(i/5)*2,20,2);
	}
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#F70";
	if (debug) {
		ctx.fillText("x = "+p2.x+" | y = "+p2.y+" | vx = "+p2.vx+" | vy = "+p2.vy, 100, 80);
		ctx.fillText("up = "+p2.up+" | g = "+p2.g+" | dbj = "+p2.dbj+" | s = "+p2.shoot, 100, 95);
	}

	for (i = 0; i < particles.length; i++) {
		ctx.fillStyle = particles[i].c==p1?"#00F":"#F70";
		ctx.fillRect(particles[i].x-2.5,particles[i].y-2.5,5,5);
	}

	for (i = 0; i < bullets.length; i++) {
		ctx.fillStyle = bullets[i].c==p1?"#00F":"#F70";
		ctx.fillRect(bullets[i].x-4,bullets[i].y-4,8,8);
	}

	ctx.fillStyle = "#00F";
	for (i = 0; i < p1.ammo; i++) {
		ctx.fillRect(40, 590-i*25, AMMO_RECHARGE, 5);
	}
	ctx.fillRect(40, 590-p1.ammo*25, p1.ar, 5);

	ctx.fillStyle = "#F70";
	for (i = 0; i < p2.ammo; i++) {
		ctx.fillRect(1000-AMMO_RECHARGE, 590-i*25, AMMO_RECHARGE, 5);
	}
	ctx.fillRect(1000-p2.ar, 590-p2.ammo*25, p2.ar, 5);

	ctx.drawImage(imgl['count'],0,Math.ceil(time/1000)*40+40,60,40,490,30,60,40);

	if (debug) {
		ctx.fillStyle = "#3F3";
		ctx.fillRect(p1.x-1,p1.y-1,2,2);
		ctx.fillRect(p2.x-1,p2.y-1,2,2);
	}
}

function updateBegin() {
	if (!hotkey) return;
	if (p1.up && p2.up) {
		startGame();
		document.getElementById("tick").style.backgroundImage = "url(img/tick.png)";
		document.getElementById("replay").style.backgroundImage = "url(img/replay.png)";
	} else if (p1.up) {
		document.getElementById("tick").style.backgroundImage = "url(img/tick_left.png)"
		document.getElementById("replay").style.backgroundImage = "url(img/replay_left.png)"
	} else if (p2.up) {
		document.getElementById("tick").style.backgroundImage = "url(img/tick_right.png)"
		document.getElementById("replay").style.backgroundImage = "url(img/replay_right.png)"
	} else {
		document.getElementById("tick").style.backgroundImage = "url(img/tick.png)";
		document.getElementById("replay").style.backgroundImage = "url(img/replay.png)";
	}
}

var sfx = true;
function sfxToggle() {
	sfx = !sfx;
	if (sfx) {
		document.getElementById('sfx').style.backgroundPosition = '0 0';
	} else {
		document.getElementById('sfx').style.backgroundPosition = '0 -64px';
	}
}

var music = true;
function musicToggle() {
	music = !music;
	if (music) {
		document.getElementById('music').style.backgroundPosition = '0 0';
		document.getElementById("s_menu").play();
	} else {
		document.getElementById('music').style.backgroundPosition = '0 -64px';
		document.getElementById("s_menu").pause();
		document.getElementById("s_game").pause();
	}
}

function keyd(e) {
	//console.log(e.keyCode);
	switch(e.keyCode) {
		case (87): 	p1.up = true;
					updateBegin();
					e.preventDefault();
					break;
		case (65):	p1.left = true;
					e.preventDefault();
					break;
		case (68):	p1.right = true;
					e.preventDefault();
					break;
		case (32):	p1.shoot = true;
					e.preventDefault();
					break;
		case (73): 	p2.up = true;
					updateBegin();
					e.preventDefault();
					break;
		case (74):	p2.left = true;
					e.preventDefault();
					break;
		case (76):	p2.right = true;
					e.preventDefault();
					break;
		case (13):	p2.shoot = true;
					e.preventDefault();
					break;
		case (80): 	debug = !debug;
					e.preventDefault();
	}
}

function keyu(e) {
	switch(e.keyCode) {
		case (87): 	p1.up = false;
					updateBegin();
					break;
		case (65):	p1.left = false;
					break;
		case (68):	p1.right = false;
					break;
		case (32):	p1.shoot = false;
					break;
		case (73): 	p2.up = false;
					updateBegin();
					break;
		case (74):	p2.left = false;
					break;
		case (76):	p2.right = false;
					break;
		case (13):	p2.shoot = false;
	}
}