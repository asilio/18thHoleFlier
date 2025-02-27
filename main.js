import {Entity,Sprite, Position, ComponentFactory} from "./modules/framework.js";

const context = document.getElementById("canvas").getContext('2d');

let player= new Entity("Player");
for(let i = 0;i<10;i++){
	let t = new Entity("Generic Tile");
	ComponentFactory.createComponent("Sprite",t.id,"./Assets/tile.png");
	ComponentFactory.createComponent("Position",t.id,32*(i%5),32*Math.floor(i/5));
}
ComponentFactory.createComponent("Sprite",player.id,"./Assets/player.png");
ComponentFactory.createComponent("Position",player.id,50,50);

let count =0;
function main(){
	count++;
	context.clearRect(0,0,context.canvas.width,context.canvas.height);

	let p = Position.Positions[player.id];
	p.x+=Math.sin(Date.now()/1000)
	for(let id in Sprite.Sprites){
		Sprite.Sprites[id].update(context,id);
	}
	
	requestAnimationFrame(main);


}

main();