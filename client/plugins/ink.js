cg.event.on("joined lobby", () => {
	console.log("Joined Lobby")
});

cg.event.on("left lobby", () => {
	console.log("Left Lobby")
});

document.addEventListener('keyup', (e) => {
	// F5
	if (e.keyCode === 116)
		chrome.runtime.reload();
	// F10
	if (e.keyCode === 121){
		if(cg.game.status === 0){
			if(!$("#menu").classList.contains("active")){
				showMenu();
				$("#menu .links").innerHTML += '<div class="menu-spacer"></div>';
				$("#menu .links").innerHTML += `<button onclick="Screens.show('inkmenu'); hideMenu();"><div class="icon">${cg.icons.get("settings")}</div><div>Configure Hacks</div></button>`;
			}else{
				hideMenu();
			}
		}
	}
}, false);


cg.screens.add("inkmenu",() => {
	cg.screens.update("inkmenu", `<throbber>THROBBER</throbber><div class="container-full"><button class="show-menu" onclick="showMenu()">${cg.icons.get("menu")}</button><button class="close" onclick="Screens.close()">${cg.icons.get("close")}</button><div class="content-text"><h2>First one!</h2><h3>Header</h3><ul class="changes"><li class="buffed">in a list</li><li class="nerfed">in a list</li><li class="added">in a list</li></ul><button class="box previous" onclick="Screens.show('home')">BUTTON</button></div></div>`)
});