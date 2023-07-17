window.addEventListener("load", initialise, false);
window.addEventListener("mousedown", MouseDown, false);
window.addEventListener("mouseup", MouseUp, false);

var canvas;
var ctx;
var bctx;
var map;

var menuActive = false;

var viewx = -90;
var viewy = -210;

var menux = 0;
var menuy = 0;

var MouseStartX = 0;
var MouseStartY = 0;
var MouseTarget;
var drag;

var imgl = new Array();

var coins = 23;
var workspace = 0;

var tutorial3task, tutorial4task, tutorial5task, tutorial6task, tutorial7task;

function Person(x,y) {
	this.x=x;
	this.y=y;
	this.earn=400;
	this.stay=200;
}
var people = new Array();

function loadImages() {
	ctx.fillText("Loading...", 230, 200);
	var img = [
		"grass",
		"road_0",
		"road_1",
		"road_2",
		"road_3",
		"road_4",
		"road_5",
		"road_6",
		"road_7",
		"road_8",
		"road_9",
		"road_10",
		"road_11",
		"road_12",
		"road_13",
		"road_14",
		"house_0",
		"house_1",
		"house_2",
		"house_3",
		"house_4",
		"house_5",
		"office_1",
		"office_2",
		"office_3",
		"office_4",
		"office_5",
		"office_6",
		"office_7",
		"office_8",
		"office_9",
		"park_0",
		"park_1",
		"park_2",
		"park_3",
		"sea_0",
		"sea_1",
		"sea_2",
		"sea_3",
		"sea_4",
		"sea_5",
		"sea_6",
		"sea_7"
	];
	for (i = 0; i < img.length; i++) {
		imgl[img[i]] = new Image();
		imgl[img[i]].src = "img/"+img[i]+".png";
	}
	renderbg();
	document.getElementById("soundtrack").play();
}

function initialise() {
	canvas = document.getElementById('canvas');
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		bctx = document.getElementById('background').getContext('2d');
		ctx.translate(-90,-210);
		bctx.translate(-90,-210);

		map = new Array();
		for (i=0;i<30;i++){
			map[i]=new Array();
			for (j=0;j<30;j++) {
				if (i==0) {
					if(j==0) {
						map[i][j]="s6";
					} else if (j==29) {
						map[i][j]="s7";
					} else {
						map[i][j]="s2";
					}
				} else if (i==29) {
					if(j==0) {
						map[i][j]="s5";
					} else if (j==29) {
						map[i][j]="s4";
					} else {
						map[i][j]="s0";
					}
				} else if (j==0) {
					map[i][j]="s1";
				} else if (j==29) {
					map[i][j]="s3";
				} else {
					map[i][j]="e";
				}
			}
		}
		loadImages();
		map[13][13] = "r5"
		map[13][14] = "r1"
		map[13][15] = "r1"
		map[13][16] = "r2"
		map[14][13] = "r0"
		map[14][14] = "p0"
		map[14][15] = "p1"
		map[14][16] = "r0"
		map[15][13] = "r0"
		map[15][14] = "p2"
		map[15][15] = "p3"
		map[15][16] = "r0"
		map[16][13] = "r4"
		map[16][14] = "r1"
		map[16][15] = "r1"
		map[16][16] = "r3"
		renderbg();
		game();
	}
}

function game() {
	tick();
	//render();
	var next = setTimeout("game()",20);
}



function tick() {
	tmpwork = workspace;
	for(i=0; i<people.length; i++) {
		if (people[i].earn == 0) {
			earncoin(1);
			people[i].earn = (200+Math.floor(Math.random()*401))*((tmpwork>0)?1:2);
		} else if (people[i].earn > 0) {
			people[i].earn--;
		}
		tmpwork--;
	}
}
function earncoin(n) {
	coins+=n;
	document.getElementById("coin").innerHTML = coins;
	document.getElementById("roadprice").style.color = (coins>=1)?"#ED2":"#700";
	document.getElementById("houseprice").style.color = (coins>=5)?"#ED2":"#700";
	document.getElementById("officeprice").style.color = (coins>=10)?"#ED2":"#700";
	document.getElementById("upgradeprice").style.color = (coins>=7)?"#ED2":"#700";
}

function renderbg() {
	bctx.clearRect(0, 0, 900, 900);
	for (i = 0; i < 30; i++) {
		for (j = 0; j < 30; j++) {
			switch(map[i][j]) {
				case "e": 	bctx.drawImage(imgl["grass"],j*30,i*30);
							break;
				case "r0": 	bctx.drawImage(imgl["road_0"],j*30,i*30);
							break;
				case "r1": 	bctx.drawImage(imgl["road_1"],j*30,i*30);
							break;
				case "r2": 	bctx.drawImage(imgl["road_2"],j*30,i*30);
							break;
				case "r3": 	bctx.drawImage(imgl["road_3"],j*30,i*30);
							break;
				case "r4": 	bctx.drawImage(imgl["road_4"],j*30,i*30);
							break;
				case "r5": 	bctx.drawImage(imgl["road_5"],j*30,i*30);
							break;
				case "r6": 	bctx.drawImage(imgl["road_6"],j*30,i*30);
							break;
				case "r7": 	bctx.drawImage(imgl["road_7"],j*30,i*30);
							break;
				case "r8": 	bctx.drawImage(imgl["road_8"],j*30,i*30);
							break;
				case "r9": 	bctx.drawImage(imgl["road_9"],j*30,i*30);
							break;
				case "r10":	bctx.drawImage(imgl["road_10"],j*30,i*30);
							break;
				case "r11":	bctx.drawImage(imgl["road_11"],j*30,i*30);
							break;
				case "r12":	bctx.drawImage(imgl["road_12"],j*30,i*30);
							break;
				case "r13":	bctx.drawImage(imgl["road_13"],j*30,i*30);
							break;
				case "r14":	bctx.drawImage(imgl["road_14"],j*30,i*30);
							break;
				case "h0":	bctx.drawImage(imgl["house_0"],j*30,i*30);
							break;
				case "h1":	bctx.drawImage(imgl["house_1"],j*30,i*30);
							break;
				case "h2":	bctx.drawImage(imgl["house_2"],j*30,i*30);
							break;
				case "h3":	bctx.drawImage(imgl["house_3"],j*30,i*30);
							break;
				case "h4":	bctx.drawImage(imgl["house_4"],j*30,i*30);
							break;
				case "h5":	bctx.drawImage(imgl["house_5"],j*30,i*30);
							break;
				case "o1":	bctx.drawImage(imgl["office_1"],j*30,i*30);
							break;
				case "o2":	bctx.drawImage(imgl["office_2"],j*30,i*30);
							break;
				case "o3":	bctx.drawImage(imgl["office_3"],j*30,i*30);
							break;
				case "o4":	bctx.drawImage(imgl["office_4"],j*30,i*30);
							break;
				case "o5":	bctx.drawImage(imgl["office_5"],j*30,i*30);
							break;
				case "o6":	bctx.drawImage(imgl["office_6"],j*30,i*30);
							break;
				case "o7":	bctx.drawImage(imgl["office_7"],j*30,i*30);
							break;
				case "o8":	bctx.drawImage(imgl["office_8"],j*30,i*30);
							break;
				case "o9":	bctx.drawImage(imgl["office_9"],j*30,i*30);
							break;
				case "p0":	bctx.drawImage(imgl["park_0"],j*30,i*30);
							break;
				case "p1":	bctx.drawImage(imgl["park_1"],j*30,i*30);
							break;
				case "p2":	bctx.drawImage(imgl["park_2"],j*30,i*30);
							break;
				case "p3":	bctx.drawImage(imgl["park_3"],j*30,i*30);
							break;
				case "s0":	bctx.drawImage(imgl["sea_0"],j*30,i*30);
							break;
				case "s1":	bctx.drawImage(imgl["sea_1"],j*30,i*30);
							break;
				case "s2":	bctx.drawImage(imgl["sea_2"],j*30,i*30);
							break;
				case "s3":	bctx.drawImage(imgl["sea_3"],j*30,i*30);
							break;
				case "s4":	bctx.drawImage(imgl["sea_4"],j*30,i*30);
							break;
				case "s5":	bctx.drawImage(imgl["sea_5"],j*30,i*30);
							break;
				case "s6":	bctx.drawImage(imgl["sea_6"],j*30,i*30);
							break;
				case "s7":	bctx.drawImage(imgl["sea_7"],j*30,i*30);
							break;
			}
		}
	}
}

function render() {
	ctx.clearRect(-90, -210, 900, 900);
	for(i=0; i<people.length; i++) {
		ctx.fillRect(people[i].x-1,people[i].y-1,2,2)
	}
}

function tutorial(n) {
	document.getElementById("tutorial"+(n-1)).style.display="none";
	if (n!=9) document.getElementById("tutorial"+n).style.display="block";
	if (n == 1) renderbg();
	if (n == 3) tutorial3task = true;
	if (n == 4) tutorial4task = true;
	if (n == 5) tutorial5task = true;
	if (n == 6) tutorial6task = true;
	if (n == 7) tutorial7task = true;
}

function buildmenu(x,y) {
	menux = x;
	menuy = y;
	document.getElementById("buildmenu").style.display="block";
	document.getElementById("buildmenu").style.left=(menux*30+viewx-29)+"px";
	document.getElementById("buildmenu").style.top=(menuy*30+viewy-19)+"px";
	document.getElementById("roadprice").style.color = (coins>=1)?"#ED2":"#700";
	document.getElementById("houseprice").style.color = (coins>=5)?"#ED2":"#700";
	document.getElementById("officeprice").style.color = (coins>=10)?"#ED2":"#700";
	if (tutorial6task) {
		if (coins<5) {
			tutorial(7);
		} else {
			tutorial7task = true;
			document.getElementById("tutorial"+6).style.display="none";
		}
		tutorial6task = false;
	}
}
function upgrademenu(x,y) {
	menux = x;
	menuy = y;
	document.getElementById("upgrademenu").style.display="block";
	document.getElementById("upgrademenu").style.left=(menux*30+viewx-29)+"px";
	document.getElementById("upgrademenu").style.top=(menuy*30+viewy-19)+"px";
	document.getElementById("upgradeprice").style.color = (coins>=7)?"#ED2":"#700";
	menuActive = true;
}
function upgrade(x,y) {
	if (coins < 7) return;
	earncoin(-7);
	workspace++;
	document.getElementById("population").innerHTML = ""+people.length+"["+workspace+"]";
	map[y][x] = "o"+(parseInt(map[y][x].substr(1,1))+1);
	renderbg();
	menucancel();
	if (tutorial5task) {
		tutorial(6);
		tutorial5task = false;
	}
}
function demolishOffice(x,y) {
	workspace -= map[y][x].substr(1,1);
	document.getElementById("population").innerHTML = ""+people.length+"["+workspace+"]";
	map[y][x] = "e";
	renderbg();
	menucancel();
}
function demolishHousemenu(x,y) {
	menux = x;
	menuy = y;
	document.getElementById("demolishHousemenu").style.display="block";
	document.getElementById("demolishHousemenu").style.left=(menux*30+viewx-29)+"px";
	document.getElementById("demolishHousemenu").style.top=(menuy*30+viewy-19)+"px";
	menuActive = true;
}
function demolishHouse(x,y) {
	people.pop();
	document.getElementById("population").innerHTML = ""+people.length+"["+workspace+"]";
	map[y][x] = "e";
	if (map[y-1][x] == "h4")
		House(x,y-1,true);
	if (map[y+1][x] == "h2")
		House(x,y+1,true);
	if (map[y][x-1] == "h5")
		House(x-1,y,true);
	if (map[y][x+1] == "h3")
		House(x+1,y,true);
	renderbg();
	menucancel();
}
function demolishRoadmenu(x,y) {
	menux = x;
	menuy = y;
	document.getElementById("demolishRoadmenu").style.display="block";
	document.getElementById("demolishRoadmenu").style.left=(menux*30+viewx-29)+"px";
	document.getElementById("demolishRoadmenu").style.top=(menuy*30+viewy-19)+"px";
	menuActive = true;
}
function demolishRoad(x,y) {
	map[y][x] = "e";
	if (map[y-1][x].substr(0,1) == "r")
		Road(x,y-1,true);
	if (map[y+1][x].substr(0,1) == "r")
		Road(x,y+1,true);
	if (map[y][x-1].substr(0,1) == "r")
		Road(x-1,y,true);
	if (map[y][x+1].substr(0,1) == "r")
		Road(x+1,y,true);
	renderbg();
	menucancel();
}
function demolishOfficemenu(x,y) {
	menux = x;
	menuy = y;
	document.getElementById("demolishRoadmenu").style.display="block";
	document.getElementById("demolishRoadmenu").style.left=(menux*30+viewx-29)+"px";
	document.getElementById("demolishRoadmenu").style.top=(menuy*30+viewy-19)+"px";
	menuActive = true;
}
function menucancel() {
	document.getElementById("buildmenu").style.display="none";
	document.getElementById("upgrademenu").style.display="none";
	document.getElementById("demolishHousemenu").style.display="none";
	document.getElementById("demolishRoadmenu").style.display="none";
	menuActive = false;
}

function House(x,y,r) {
	if (coins < 5) return;
	if (map[y][x].substr(0,1) != "h") {
		earncoin(-5);
		people[people.length] = new Person(x,y);
		document.getElementById("population").innerHTML = ""+people.length+"["+workspace+"]";
	}
	if (map[y-1][x] == "h0" || map[y-1][x] == "h1") {
		map[y][x] = "h4";
		map[y-1][x] = "h2";
	} else if (map[y+1][x] == "h0" || map[y+1][x] == "h1") {
		map[y][x] = "h2";
		map[y+1][x] = "h4";
	} else if (map[y][x-1] == "h0" || map[y][x-1] == "h1") {
		map[y][x] = "h3";
		map[y][x-1] = "h5";
	} else if (map[y][x+1] == "h0" || map[y][x+1] == "h1") {
		map[y][x] = "h5";
		map[y][x+1] = "h3";
	} else {
		map[y][x] = "h"+Math.floor(Math.random()*2);
	}
	renderbg();
	document.getElementById("buildmenu").style.display="none";
	menuActive = false;
	if (tutorial3task) {
		tutorial(4);
		tutorial3task = false;
	}
	if (tutorial7task) {
		tutorial(8);
		tutorial7task = false;
	}
}
function Office(x,y) {
	if (coins < 10) return;
	earncoin(-10);
	workspace++;
	document.getElementById("population").innerHTML = ""+people.length+"["+workspace+"]";
	map[y][x] = "o1";
	renderbg();
	document.getElementById("buildmenu").style.display="none";
	menuActive = false;
	if (tutorial4task) {
		tutorial(5);
		tutorial4task = false;
	}
}
function Road(x,y,r) {
	if (coins < 1) return;
	if (r) earncoin(-1);
	if (map[y-1][x].substr(0,1) == "r") {
		if (map[y+1][x].substr(0,1) == "r") {
			if (map[y][x-1].substr(0,1) == "r") {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r10";
					if (r) Road(x+1,y,false);
					if (r) Road(x-1,y,false);
					if (r) Road(x,y+1,false);
					if (r) Road(x,y-1,false);
				} else {
					map[y][x] = "r7";
					if (r) Road(x-1,y,false);
					if (r) Road(x,y+1,false);
					if (r) Road(x,y-1,false);
				}
			} else {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r9";
					if (r) Road(x+1,y,false);
					if (r) Road(x,y+1,false);
					if (r) Road(x,y-1,false);
				} else {
					map[y][x] = "r0";
					if (r) Road(x,y+1,false);
					if (r) Road(x,y-1,false);
				}
			}
		} else {
			if (map[y][x-1].substr(0,1) == "r") {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r8";
					if (r) Road(x-1,y,false);
					if (r) Road(x+1,y,false);
					if (r) Road(x,y-1,false);
				} else {
					map[y][x] = "r3";
					if (r) Road(x-1,y,false);
					if (r) Road(x,y-1,false);
				}
			} else {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r4";
					if (r) Road(x+1,y,false);
					if (r) Road(x,y-1,false);
				} else {
					map[y][x] = "r13";
					if (r) Road(x,y-1,false);
				}
			}
		}
	} else {
		if (map[y+1][x].substr(0,1) == "r") {
			if (map[y][x-1].substr(0,1) == "r") {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r6";
					if (r) Road(x+1,y,false);
					if (r) Road(x-1,y,false);
					if (r) Road(x,y+1,false);
				} else {
					map[y][x] = "r2";
					if (r) Road(x-1,y,false);
					if (r) Road(x,y+1,false);
				}
			} else {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r5";
					if (r) Road(x+1,y,false);
					if (r) Road(x,y+1,false);
				} else {
					map[y][x] = "r11";
					if (r) Road(x,y+1,false);
				}
			}
		} else {
			if (map[y][x-1].substr(0,1) == "r") {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r1";
					if (r) Road(x-1,y,false);
					if (r) Road(x+1,y,false);
				} else {
					map[y][x] = "r12";
					if (r) Road(x-1,y,false);
				}
			} else {
				if (map[y][x+1].substr(0,1) == "r") {
					map[y][x] = "r14";
					if (r) Road(x+1,y,false);
				} else {
					map[y][x] = "r0";
				}
			}
		}
	}
	renderbg();
	document.getElementById("buildmenu").style.display="none";
	menuActive = false;
}

function MouseDown(e) {
	if (e == null) e = window.event;
	var target = e.target != null ? e.target : e.srcElement;
	if ((e.button == 1 && window.event != null || e.button == 0) && target.className == 'field') {
		MouseTarget = target;
		MouseStartX = e.clientX;
		MouseStartY = e.clientY;
		document.onmousemove = MouseMove;
		document.body.focus();
        document.onselectstart = function () { return false; };
        target.ondragstart = function() { return false; };
        return false;
	}
}

function MouseMove(e) {
	if (e == null) var e = window.event; 

	menucancel();
	if (viewx + e.clientX - MouseStartX >= -180 && viewx + e.clientX - MouseStartX <= 0) {
		ctx.translate(e.clientX - MouseStartX,0);
		bctx.translate(e.clientX - MouseStartX,0);
		viewx += e.clientX - MouseStartX;
		renderbg();
	}
	MouseStartX = e.clientX;
	if (viewy + e.clientY - MouseStartY >= -420 && viewy + e.clientY - MouseStartY <= 0) {
		ctx.translate(0,e.clientY - MouseStartY);
		bctx.translate(0,e.clientY - MouseStartY);
		viewy += e.clientY - MouseStartY;
		renderbg();
	}
	MouseStartY = e.clientY;
	drag = true;
}

function MouseUp(e) {
	if (e == null) e = window.event;
	document.onmousemove = null;
	document.onselectstart = null;
	MouseTarget.ondragstart = null;
	MouseTarget = null;
	if (!drag) {
		if (menuActive) {
			menucancel();
		}
		tilex=Math.floor((e.clientX-viewx)/30);
		tiley=Math.floor((e.clientY-viewy)/30);
		if (map[tiley][tilex] == "e" && (map[tiley+1][tilex].substr(0,1) == "r" || map[tiley-1][tilex].substr(0,1) == "r" || map[tiley][tilex+1].substr(0,1) == "r" || map[tiley][tilex-1].substr(0,1) == "r"))
			buildmenu(tilex,tiley)
		else if (map[tiley][tilex].substr(0,1) == "o")
			if (map[tiley][tilex].substr(1,1) < 9)
				upgrademenu(tilex,tiley)
			else demolishOfficemenu(tilex,tiley)
		else if (map[tiley][tilex].substr(0,1) == "h")
			demolishHousemenu(tilex,tiley)
		else if (map[tiley][tilex].substr(0,1) == "r")
			demolishRoadmenu(tilex,tiley)
		else return;
		menuActive = true;
	}
	drag = false;
}