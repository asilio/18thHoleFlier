function RenderIsocubes(el){
	console.log("Isocube Loaded");
	console.log(el);
	console.log(this);

}
function LevelOne(){
	let canvas = document.getElementById("canvas");
	let context = canvas.getContext('2d');

	let isocube = new Image();
	isocube.src = "./Assets/isocube.png";

	isocube.addEventListener("load",RenderIsocubes);
}
LevelOne();