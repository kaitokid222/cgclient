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
			}else{
				hideMenu();
			}
		}
	}
}, false);