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
	ComponentFactory.createComponent("Position",t.id,TILE_SIZE*(i%WIDTH),TILE_SIZE*Math.floor(i/WIDTH));
}
ComponentFactory.createComponent("Sprite",player.id,"./Assets/disc.png");
ComponentFactory.createComponent("Position",player.id,0,0);
const p = Position.Positions[player.id];
//*** Keyboard Listener ***//
document.addEventListener(
	'keyup',
	(event)=>{
		const keyName = event.key;
		switch(keyName){
			case 'a':
				p.x-=TILE_SIZE;
				break;
			case 'd':
				p.x+=TILE_SIZE;
				break;
			case 's':
				p.y+=TILE_SIZE;
				break;
			case 'w':
				p.y-=TILE_SIZE;
				break;
		}
	}
	)

let count =0;
function main(){
	count++;
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	for(let id in Sprite.Sprites){
		Sprite.Sprites[id].update(context,id);
	}
	Sprite.Sprites[player.id].update(context,player.id);
	requestAnimationFrame(main);


}

main();