import {Entity,Sprite, Layer, Position, ComponentFactory} from "./modules/framework.js";

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

function canvas_pixel_to_tile_corner(cx,cy){
	return [(cx%TILE_SIZE)*TILE_SIZE,(cy%TILE_SIZE)*TILE_SIZE];
}


let player= new Entity("Player");
let layers = [];

for(let i = 0;i<WIDTH*HEIGHT;i++){
	let t = new Entity("Generic Tile");
	ComponentFactory.createComponent("Sprite",t.id,"./Assets/tile.png");
	ComponentFactory.createComponent("Position",t.id,TILE_SIZE*(i%WIDTH),TILE_SIZE*Math.floor(i/WIDTH));
	layers[0]=ComponentFactory.createComponent("Layer",t.id, 0,context.canvas.width,context.canvas.height);
}


ComponentFactory.createComponent("Sprite",player.id,"./Assets/disc.png");
ComponentFactory.createComponent("Position",player.id,0,0);
layers[1]=ComponentFactory.createComponent("Layer",player.id,1,context.canvas.width,context.canvas.height);

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
	);

/*** Mouse Events ***/
let hover = new Entity();
ComponentFactory.createComponent("Sprite",hover.id,"./Assets/hoverbox.png");
ComponentFactory.createComponent("Position",hover.id,-100,0);

context.canvas.addEventListener('mousemove',
	(event)=>{
		let cx = event.offsetX;
		let cy = event.offsetY;
		let result = canvas_pixel_to_tile_corner(cx,cy);
		let p = Position.Positions[hover.id];
		p.x=result[0];
		p.y=result[1];

	});

/*** Main Loop ***/
layers[0].render();
function main(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);

	layers[1].render();

	layers[0].update(context);
	layers[1].update(context);

	requestAnimationFrame(main);
}

main();