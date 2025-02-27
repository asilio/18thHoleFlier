import {Entity, ComponentFactory} from "./modules/framework.js";

const context = document.getElementById("canvas").getContext('2d');

let player= new Entity("Player");
for(let i = 0;i<100;i++){
	let t = new Entity("Generic Tile");
	ComponentFactory.createComponent("Sprite",t.id,"../Assets/tile.png");
	ComponentFactory.createComponent("Position",t.id,i%5,(i%5)+i);
}
ComponentFactory.createComponent("Sprite",player.id,"../Assets/player.png");
ComponentFactory.createComponent("Position",player.id,50,50);


function main(){
	for(let id in Sprite.Sprites){
		Sprite.Sprites[id].update(context);
	}
	requestAnimationFrame(main);

}