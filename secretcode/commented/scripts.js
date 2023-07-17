var colors = ["#0000FF","#00FF00","#FF0000","#FFFF00","#00FFFF","#FF00FF","#000000","#CCCCCC"];

var selection = [null,null,null,null]; // itt tárolódik a kiválasztás (alsó sor), négy szám ami a fenti színek közül az egyik sorszáma
var target = [null,null,null,null]; // itt tárolódik a secret (felsõ sor), szintén 4 színsorszám (vagy null, azaz üres (a null érték nem egyenlõ a 0 értékkel!))
var attnum = 0; // próbálkozás sorszáma

// <--- egysoros komment kezdése

/* <--- többsoros komment kezdése
	szintaxis: varos = ["Budapest","Praga","NY"]
	ez egy tömb. az értékek nullától számozva vannak. visszakeresés: 'varos[1]' --> "Praga"-t ad vissza
	az index változót is elfogad:
	
	a = 2;
	b = varos[a];

	b értéke "NY"   
*/

function init() { // ez meghívódik a játék betöltésekor
	for (i = 0; i <= 7; i++) { // jobb oldali gombok kiszínezése a fenti színekkel
		document.getElementById("color"+i).style.backgroundColor = colors[i];
	}

	for (i = 0; i <= 3; i++) { // a négy secret szín: négy randomszám 0-7ig
		target[i] = Math.floor(Math.random()*8);
	}
}

function addColor(num) { // meghívódik amikor hozzáadsz egy színt a kiválasztottakhoz (LOL), 'num' paraméter, szín sorszám
	for (i = 0; i <= 3; i++) { // a 'selection' tömb elejérõl elmegy az elsõ null (üres, nem foglalt) selection dobozig, és odarakja a num paraméter értékét
		if (selection[i] == null) {
			selection[i] = num;
			break;
		}
	}

	for (i = 0; i <= 3; i++) { // megjeleníti a selectiont (ugye a változó ('selection') az nem látszik, az csak a memóriában van)
		document.getElementById("select"+i).style.backgroundColor = colors[selection[i]]; // ezek ilyen kinézeti dolgok, programozás szempontjából lényegtelen, ezekkel ne foglalkozz
	}
}

function enterColors() { // amikor rányomsz alul a gombra (vagy enter) akkor hívódik meg, ez a lényeg!
	if (attnum > 14) return; // ha elfogytak a próbálkozások => return, azaz leáll, nem megy tovább a function-ben
	for (i = 0; i <= 3; i++) { // ha valamelyik selection üres (null) => return
		if (selection[i] == null) return;
	}

	for (i = 0; i <= 3; i++) { // kijelzés (színezés)
		document.getElementById(i+"att"+attnum).style.backgroundColor = colors[selection[i]];
	}

	yellow = 0; // na itt jön a te ötleted, a csekkolás
	red = 0; // inicializálunk két változót, red és yellow, ide fogjuk pakolni a végeredményt
	selchecked = []; // selchecked azaz selection checked, ide jönnek azoknak a selection mezõknek a sorszámai, amiket már nem kell nézni
	checked = []; // uganez csak a secret (aka target) mezõk sorszámaival
	for (i = 0; i <= 3; i++) { //sárgák keresése
		if (selection[i] == target[i]) { // ha a két érték ugyanaz, egyezést találtunk
			yellow++; // sárgák számát növeljük. szintaxis: "a++" ugyanaz mint hogy "a = a + 1" csak rövidítve
			checked[checked.length] = i; // megjegyezzük hogy se ezt a selection-t
			selchecked[selchecked.length] = i; // se ezt a target-et már ne nézzük
		}
	}
	for (i = 0; i <= 3; i++) { // pirosak
		loop: for (j = 0; j <= 3; j++) { // <-- EZ a 'loop' címkéjû for (sor eleje), simán el van nevezve h hivatkozni lehessen rá (lásd lentebb) | am. meg: egymásba ágyazott for ciklus: végigmegyünk minden 'selection'-ön, de minden lépésben minden 'target'en is: a targeteket 4*4=16-szor néztük
			if (j != i && selection[i] == target[j]) { // ha egyezést találtunk, nem azonos sorszámú mezõkön
				for (k = 0; k < checked.length; k++) { // a mezõ része-e a nem csekkolandó targeteknek
					if (j == checked[k]) continue loop; // ha igen, továbblévük a 'loop' címkéjû ciklusban
				}
				for (k = 0; k < selchecked.length; k++) { // illetve része-e a nem csekkolandó selection-öknek
					if (i == selchecked[k]) continue loop; // ha igen, továbblépünk
				}
				red++; // ha nem, találtunk egy pirosat
				checked[checked.length] = j; // és ezeket a mezõket hozzáadjuk a nem csekkolandóakhoz
				selchecked[selchecked.length] = i; // szintax: "a = [3,1,4,1,5];" a tömb, hossza: "a.length" 5-öt ad vissza.
			} // 'a' utolsó elemének elemszáma 4 (0-tól kezdtünk számozni), tehát egy új elem elemszáma pont a.length lesz
		} // tehát "a[a.length] = 10;" után a tömbünk új értéke (tartalma) [3,1,4,1,5,10] lesz. hozzátoldottunk a tömb végéhez.
	}

	for (i = 0; i < red; i++) { // kiírás
		document.getElementById("red"+attnum).innerHTML += "&bull;";
	}
	for (i = 0; i < yellow; i++) {
		document.getElementById("yellow"+attnum).innerHTML += "&bull;";
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = "#FFFFFF";
	}

	//console.log("red: " + red + " yellow: "+yellow);
	if (yellow == 4 && red == 0) showTarget(); // ha nyert: megmutatjuk a megoldást
	if (attnum == 14) { showTarget(); alert("You suck!");} // ha vesztett, megrovásban részesítjük

	selection = [null,null,null,null]; // töröljük a selection-t
	attnum++; // megnöveljük a próbálkozások számát
} // idáig tartott a lényeg

function showTarget() {
	for (i = 0; i <= 3; i++) { // poén lelövése (target megmutatása)
		document.getElementById("target"+i).innerHTML = "";
		document.getElementById("target"+i).style.backgroundColor = colors[target[i]];
	}
}

function clearColor(num) { // selection-bõl törlés (az alábbi kommenteket eleve odírtam, még magamnak)
	if (num == 5) { // Backspace (clear last color)
		for (i = 3; i >= 0; i--) {
			if (selection[i] != null) {
				selection.splice(i,1);
				break;
			}
		}
	} else if (num == 4) { // Clear all
		selection = [null,null,null,null];
	} else { // Clear specific
		selection.splice(num,1);
	}

	for (i = 0; i <= 3; i++) {
		document.getElementById("select"+i).style.backgroundColor = (selection[i] == null)?"#FFFFFF":colors[selection[i]];
	}
}

function keyDown(e) { // billentyûk kezelése
	//console.log(e.keyCode);
	switch (e.keyCode) {
		case (32):	enterColors();
					e.preventDefault();
					break;
		case (13):	enterColors()
					e.preventDefault();
					break;
		case (49):	addColor(0);
					break;
		case (50):	addColor(1);
					break;
		case (51):	addColor(2);
					break;
		case (52):	addColor(3);
					break;
		case (53):	addColor(4);
					break;
		case (54):	addColor(5);
					break;
		case (55):	addColor(6);
					break;
		case (56):	addColor(7);
					break;
		case (8):	clearColor(5);
					e.preventDefault();
	}
}