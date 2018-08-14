class menuButton{
  constructor(name, text, onclick, icon){
    this.name = name;
    this.icon = icon || "play";
    this.onclick = onclick || `console.log('missing onclick in button');`;
    this.text = text || "unnamed";
  }
  getHtml(){
    let html = `<button id="`+ this.name + `" onclick="` + this.onclick + `">`;
    if(this.icon){
      html += `<div class="icon">` + cg.icons.get(this.icon) + `</div>`;
    }
    html += `<div>` + this.text + `</div></button>`
    return html;
  }
  toggle(){
	if(this.icon == "play"){
	  this.icon = "wait";
	}else{
	  this.icon = "play";
	}
  }
}

Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

window.cg.toolsettings = {
    autospawn : 0,
    autospawn_limit : 15,
    autospawn_interval : 1000,
    autoupgrade : 0,
    autoupgrade_min : 3,
    autoupgrade_interval : 5000,
    autowalls : 0,
};

window.cg.wallstrategy = [];
window.cg.menuButtons = [];
cg.menuButtons.push(new menuButton("spawnbot","Keep Spawning", "cg.toggleautospawn(); hideMenu();"));
cg.menuButtons.push(new menuButton("upgradebot","Upgrade Minions", "cg.toggleupgradehelper(); hideMenu();"));
cg.menuButtons.push(new menuButton("wallbot","Rebuild Walls", "cg.togglewallspam(); hideMenu();"));

window.cg.clearToolsettings = function(){
	if(cg.toolsettings.autospawn === 1){
		cg.toolsettings.autospawn = 0;
		cg.menuButtons[0].toggle();
	}
	if(cg.toolsettings.autoupgrade === 1){
		cg.toolsettings.autoupgrade = 0;
		cg.menuButtons[1].toggle();
	}
	if(cg.toolsettings.autowalls === 1){
		cg.toolsettings.autowalls = 0;
		cg.menuButtons[2].toggle();
	}
	window.cg.wallstrategy = [];
}

window.cg.arrayRandom = function(t) {
	return t[Math.floor(Math.random() * t.length)]
}

window.cg.toggleautospawn = function(){
	if(cg.toolsettings.autospawn === 0){
		cg.toolsettings.autospawn = 1;
		window.cg.spawninterval = setInterval(cg.SpawnMinion, cg.toolsettings.autospawn_interval);
		cg.messages.show("activated auto-spawner!");
	}else{
		cg.toolsettings.autospawn = 0;
		clearInterval(cg.spawninterval);
		cg.messages.show("deactivated auto-spawner!");
	}
	cg.menuButtons[0].toggle();
}

window.cg.setautospawnlimit = function(){
	cg.toolsettings.autospawn_limit = document.getElementById("sendlimit").value;
	document.getElementById("sendlimit_label").innerHTML = document.getElementById("sendlimit").value;
}

window.cg.setautospawninterval = function(){
	cg.toolsettings.autospawn_interval = document.getElementById("sendinterval").value;
	document.getElementById("sendinterval_label").innerHTML = document.getElementById("sendinterval").value + 'ms';
	clearInterval(cg.spawninterval);
	window.cg.spawninterval = setInterval(cg.SpawnMinion, cg.toolsettings.autospawn_interval);
}

window.cg.checklimit = function(){
	let i = (cg.toolsettings.autospawn_limit/30).toFixed(2);
	if(cg.game.state.players[cg.game.playerIndex].minion_limit < i){
		return true;
	}else{
		return false;
	}
}

window.cg.SpawnMinion = function() {
	if (2 === cg.game.status && 0 === cg.game.state.warmup) {
		if(cg.checklimit() === true){
			const t = [];
			for (let e, o = 1; o < 6; o++)
				(e = cg.game.state.players[cg.game.playerIndex].factories[o]).stacks_current > 0 && 0 === e.cooldown_seconds && t.push(e);
			if (t.length){
				const e = cg.arrayRandom(t);
				cg.gameserver.emit("ActivateFactory", {index: e.index,position: 0});
			}
		}
	}
}

window.cg.toggleupgradehelper = function(){
	if(cg.toolsettings.autoupgrade === 0){
		cg.toolsettings.autoupgrade = 1;
		window.cg.upgradeinterval = setInterval(cg.tryUpgrade, cg.toolsettings.autoupgrade_interval);
		cg.messages.show("activated upgrade-helper!");
	}else{
		cg.toolsettings.autoupgrade = 0;
		clearInterval(cg.upgradeinterval);
		cg.messages.show("deactivated upgrade-helper!");
	}
	cg.menuButtons[1].toggle();
}

window.cg.tryUpgrade = function() {
	if (2 === cg.game.status && 0 === cg.game.state.warmup) {
		let i = (cg.toolsettings.autoupgrade_min/30).toFixed(2);
		if(cg.game.state.players[cg.game.playerIndex].minion_limit > i){
			const t = [];
			for (let e, o = 1; o < 6; o++)
				(e = cg.game.state.players[cg.game.playerIndex].factories[o]).hasOwnProperty("stacks_current") === true && 0 === e.cooldown_seconds && t.push(e);
			if (t.length){
				const e = cg.arrayRandom(t);
				e.upgradeLowest();
			}
		}
	}
}

window.cg.setautoupgrademin = function(){
	cg.toolsettings.autoupgrade_min = document.getElementById("limitminimum").value;
	document.getElementById("limitminimum_label").innerHTML = document.getElementById("limitminimum").value;
}

window.cg.setautoupgradeinterval = function(){
	cg.toolsettings.autoupgrade_interval = document.getElementById("upgradeinterval").value;
	document.getElementById("upgradeinterval_label").innerHTML = document.getElementById("upgradeinterval").value + 'ms';
	clearInterval(cg.upgradeinterval);
	window.cg.upgradeinterval = setInterval(cg.tryUpgrade, cg.toolsettings.autoupgrade_interval);
}

window.cg.togglewallspam = function(){
	if(cg.toolsettings.autowalls === 0){
		cg.toolsettings.autowalls = 1;
		window.cg.wallinterval = setInterval(cg.trywall, 500);
		cg.messages.show("activated wallrebuilder!");
	}else{
		cg.toolsettings.autowalls = 0;
		clearInterval(cg.wallinterval);
		cg.messages.show("deactivated wallrebuilder!");
	}
	cg.menuButtons[2].toggle();
}

window.cg.trywall = function(){
	if(cg.wallstrategy.length){
		if(cg.game.state.players[cg.game.playerIndex].factories[0].stacks_current > 0){
			for(var i = 0; i < cg.wallstrategy.length; i++){
				var arr = cg.wallstrategy[i].split(",");
				arr[0] = parseInt(arr[0]);
				arr[1] = parseInt(arr[1]);
				if(cg.isValidPosition(arr[0],arr[1])){
					cg.gameserver.emit("ActivateFactory", {index: 0,position: cg.networkablePosition(arr)});
					break;
				}
			}
		}
	}
}

// REQUIRES HACK INTO COREGROUNDS.JS
window.cg.recordtile = function(arr){
	var str = arr[0] +','+ arr[1];
	if(cg.wallstrategy.indexOf(str) === -1){
		cg.wallstrategy.push(str);
	}
}

window.cg.settile = function(str){
	if(cg.wallstrategy.indexOf(str) === -1){
		cg.wallstrategy.push(str);
		let last = cg.wallstrategy.length - 1
		document.getElementById(str).innerHTML = last+1;
		document.getElementById(str).style["background-color"] = "rgba(0, 204, 0, 0.8)";
	}else{
		cg.wallstrategy.remove(str);
		document.getElementById(str).innerHTML = "";
		document.getElementById(str).style["background-color"] = "rgba(255, 255, 255, 0.1)";
	}
}

window.cg.showstrategy = function(){
	if(cg.wallstrategy.length){
		for(var i = 0; i < cg.wallstrategy.length; i++){
			var id = String(cg.wallstrategy[i]);
			document.getElementById(id).innerHTML = i+1;
			document.getElementById(id).style["background-color"] = "rgba(0, 204, 0, 0.8)";
		}
		cg.messages.show("Restored strategy");
	}
}

window.cg.isValidPosition = function(x,y){
    let found  = false;
    for(let e in cg.game.state.entities){
      if(cg.game.state.entities.hasOwnProperty(e)){
        let nx = cg.game.state.entities[e].x/128|0;
        let ny = cg.game.state.entities[e].y/128|0;
        if(nx === x && ny === y){
            return false;
        }
      }
    }
    return true;
}

window.cg.pointToTile = function(t, e) {
	const o = [];
	return o.push(t / 128 | 0), o.push(e / 128 | 0), o
}

window.cg.networkablePosition = function(t){
	let e;
	e = {
		x: 128 * (t[0] + .5),
		y: 128 * (t[1] + .5)
	};
	return 1 === cg.game.playerIndex && (e = cg.flipCoordinates(e)), e.x = e.x / 128 * 1e3, e.y = e.y / 128 * 1e3, e.x | e.y << 16
}
window.cg.flipCoordinates = function(t){
	t.x = Math.abs(t.x - 1920);
	t.y = Math.abs(t.y - 896);
	return t;
}

window.showtoolMenu = function() {
	let e = "";
	let i = cg.toolsettings.autospawn_limit;
	let ii = cg.toolsettings.autospawn_interval;
	let c = cg.toolsettings.autoupgrade_min;
	let cc = cg.toolsettings.autoupgrade_interval;
		e += '<button><div>CG-Helper</div></button>';
		e += '<div class="menu-spacer"></div>';
		cg.menuButtons.forEach(function(b){
			e += b.getHtml();
			if(b.name == "spawnbot"){
				if(cg.toolsettings.autospawn === 1){
					e += '<div class="form-item form-range">';
					e += '<label for="sendlimit">Spawn until<span id="sendlimit_label">'+ i +'</span></label>';
					e += '<input type="range" value="'+ i +'" step="3" min="3" max="30" id="sendlimit" oninput="cg.setautospawnlimit()" onchange="cg.setautospawnlimit()">';
					e += '</div>';
					e += '<div class="form-item form-range">';
					e += '<label for="sendinterval">Spawninterval<span id="sendinterval_label">'+ ii +'ms</span></label>';
					e += '<input type="range" value="'+ ii +'" step="250" min="500" max="10000" id="sendinterval" oninput="cg.setautospawninterval()" onchange="cg.setautospawninterval()">';
					e += '</div>';
				}
			}
			if(b.name == "upgradebot"){
				if(cg.toolsettings.autoupgrade === 1){
					e += '<div class="form-item form-range">';
					e += '<label for="limitminimum">Minimum alive units<span id="limitminimum_label">'+ c +'</span></label>';
					e += '<input type="range" value="'+ c +'" step="3" min="3" max="'+ i +'" id="limitminimum" oninput="cg.setautoupgrademin()" onchange="cg.setautoupgrademin()">';
					e += '</div>';
					e += '<div class="form-item form-range">';
					e += '<label for="upgradeinterval">Try Upgrade every <span id="upgradeinterval_label">'+ cc +'ms</span></label>';
					e += '<input type="range" value="'+ cc +'" step="1000" min="1000" max="10000" id="upgradeinterval" oninput="cg.setautoupgradeinterval()" onchange="cg.setautoupgradeinterval()">';
					e += '</div>';
				}
			}
			if(b.name == "wallbot"){
				e += new menuButton("wbgrid","Wallstrategy", "cg.screens.show('inkmenu'); cg.showstrategy(); hideMenu();","modify").getHtml();
				if(cg.toolsettings.autowalls === 1){
				}
			}
			e += '<div class="menu-spacer"></div>';
		});
		e += '<div class="menu-spacer"></div>';
		e += '<button><div>by iNk & shurutsue</div></button>';
		$("#menu .links").innerHTML = e;
		$("#menu").classList.add("active");
		$("#menu-tint").classList.add("active");
}

document.addEventListener('keyup', (e) => {
	if (e.keyCode === 116)
		chrome.runtime.reload();
	if (e.keyCode === 121){
		if(!$("#menu").classList.contains("active")){
			if(cg.game.status === 0){
				showMenu();
			}else if(cg.game.status === 2){
				showtoolMenu();
			}
		}else{
			hideMenu();
		}
	}
}, false);

cg.screens.add("inkmenu",() => {
	let e = "";
	e += `<button class="close" onclick="cg.screens.hide()">${cg.icons.get("close")}</button>`;
	e += `<div style="display: grid;grid-template-columns: 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px 64px;background-color: black;padding: 10px;grid-column-gap: 3px;grid-row-gap: 3px;">`;

	let i = 0;
	let r = 0;
	let z = 0;
	for (; i < 105; i++){
		var coordstring = String(z+","+r);
		if((z === 14 && r === 0) || (z === 0 && r === 6)){
			e += '<div style="background-color: rgba(255, 255, 255, 1);border: 1px solid rgba(0, 0, 0, 0.8);padding: 5px;height: 48px;width: 48px;font-size: 32px;color: red;text-align: center;vertical-align: middle;border-radius: 24px;">c</div>';
		}else{
			e += '<div id="' + coordstring + '" onclick="cg.settile(&quot;' + coordstring + '&quot;)" style="background-color: rgba(255, 255, 255, 0.1);border: 1px solid rgba(0, 0, 0, 0.8);padding: 5px;height: 48px;width: 48px;font-size: 16px;color: red;text-align: center;vertical-align: middle;border-radius: 15px;"> </div>';
		}
		if(z === 14){
			r++;
			z = 0;
		}else{
			z++;
		}
	}
	e += `</div>`;
	cg.screens.update("inkmenu", e);
});

cg.event.on("game reset", () => {
	cg.clearToolsettings();
});