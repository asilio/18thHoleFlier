import {Entity,Sprite, Position, ComponentFactory} from "./modules/framework.js";


/*** Level Data ***/
const context = document.getElementById("canvas").getContext('2d');
const TILE_SIZE = 32;
const WIDTH = 10;
const HEIGHT = 10;

function pixel_to_tile(px,py){
	return [px%TILE_SIZE, py%TILE_SIZE];
}

function tile_to_pixel(tx,ty){
	return [TILE_SIZE*tx,TILE_SIZE*ty];
}


let player= new Entity("Player");
for(let i = 0;i<WIDTH*HEIGHT;i++){
	let t = new Entity("Generic Tile");
	ComponentFactory.createComponent("Sprite",t.id,"./Assets/tile.png");
	ComponentFactory.createComponent("Position",t.id,TILE_SIZE*(i%WIDTH),TILE_SIZE*Math.floor(i/5));
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