import {Entity,Sprite,Line, Layer, Position, ComponentFactory} from "./modules/framework.js";

/*** Level Data ***/
const context = document.getElementById("canvas").getContext('2d');
const TILE_SIZE = 32;
const WIDTH = 40;
const HEIGHT = 100;

function pixel_to_tile(px,py){
	return [Math.floor(px/TILE_SIZE), Math.floor(py/TILE_SIZE)];
}

function tile_to_pixel(tx,ty){
	return [TILE_SIZE*tx,TILE_SIZE*ty];
}

function canvas_pixel_to_tile_corner(cx,cy){
	return [(Math.floor(cx/TILE_SIZE))*TILE_SIZE,(Math.floor(cy/TILE_SIZE))*TILE_SIZE];
}


let player= new Entity("Player");
let layers = [];

for(let i = 0;i<WIDTH*HEIGHT;i++){
	let t = new Entity("Generic Tile");
	ComponentFactory.createComponent("Sprite",t.id,"./Assets/tile.png");
	ComponentFactory.createComponent("Position",t.id,TILE_SIZE*((i+1)%WIDTH),TILE_SIZE*Math.floor((i+1)/WIDTH));
	layers[0]=ComponentFactory.createComponent("Layer",t.id, 0,context.canvas.width,context.canvas.height);
}


ComponentFactory.createComponent("Sprite",player.id,"./Assets/disc.png");
ComponentFactory.createComponent("Position",player.id,10*32,15*32);
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
ComponentFactory.createComponent("Layer",hover.id,1,context.canvas.width,context.canvas.height);

let target = new Entity();
ComponentFactory.createComponent("Sprite",target.id,"./Assets/target.png");
ComponentFactory.createComponent("Position",target.id,-100,0);
ComponentFactory.createComponent("Layer",target.id,1,context.canvas.width,context.canvas.height);

let center = new Entity();
ComponentFactory.createComponent("Sprite",center.id,"./Assets/center.png");
ComponentFactory.createComponent("Position",center.id,-100,0);
ComponentFactory.createComponent("Layer",center.id,1,context.canvas.width,context.canvas.height);

let midpoint = new Entity();
ComponentFactory.createComponent("Sprite",midpoint.id,"./Assets/midpoint.png");
ComponentFactory.createComponent("Position",midpoint.id,-100,0);
ComponentFactory.createComponent("Layer",midpoint.id,1,context.canvas.width,context.canvas.height);

//let debug_line = new Line(0,0,10,10,player.id);

let lefty = new Entity();
ComponentFactory.createComponent("Sprite",lefty.id,"./Assets/lefty.png");
ComponentFactory.createComponent("Position",lefty.id,32,0);
layers[2] = ComponentFactory.createComponent("Layer",lefty.id,2,context.canvas.width,context.canvas.height);

context.canvas.addEventListener('mousemove',
	(event)=>{
		let cx = event.offsetX;
		let cy = event.offsetY;
		
		let result = canvas_pixel_to_tile_corner(cx,cy);
		
		let p = Position.Positions[hover.id];
		p.x=result[0];
		p.y=result[1];

		//debug_line.p1 = [p.x,p.y];
		//debug_line.p2 = result;
	});
let playerPath = [];

context.canvas.addEventListener('mouseup',
	(event)=>{
		let cx = event.offsetX;
		let cy = event.offsetY;
		let result = canvas_pixel_to_tile_corner(cx,cy);
		let p = Position.Positions[target.id];
		p.x=result[0];
		p.y=result[1];
		let pp = Position.Positions[player.id];
		playerPath=makeArc(pp.x,pp.y,p.x,p.y,32*2,'right');
	});



function makeArc(x1,y1,x2,y2,d,hyzer='left',dt=0.01,){
	let t1 = Math.atan2(y2-y1,x2-x1);
	if(hyzer = 'right') t1 = Math.atan2(y1-y2,x1-x2);
	let t2 = t1 + Math.PI/2;
	let cx = (x1+x2)/2+d*Math.cos(t2);
	let cy = (y1+y2)/2+d*Math.sin(t2);
	let r  = Math.sqrt((cx-x1)*(cx-x1)+(cy-y1)*(cy-y1));
	let t0 = Math.atan2(cy-y1,cx-x1);
	let tf = Math.atan2(cy-y2,cx-x2);
	//Ensure that the path remains on the hyzer side
	if(Math.abs(t0-tf)>Math.PI && tf<0) tf+=2*Math.PI;
	if(Math.abs(t0-tf)>Math.PI && tf>0) tf-=2*Math.PI;

	//DEBUG
	//console.log(`t1: ${t1}, \nt2: ${t2}`);
	//console.log(`dx: ${d*Math.cos(t1)}\ndy:${d*Math.sin(t1)}`);
	//console.log(`t0: ${t0},\ntf: ${tf}\n|t0-tf|${Math.abs(t0-tf)}`);
	

	let cp = Position.Positions[center.id];
	let mp = Position.Positions[midpoint.id]
	mp.x = (x1+x2)/2;
	mp.y = (y1+y2)/2;
	cp.x = cx;
	cp.y = cy;

	//Path
	let t = 0;
	let path = [];
	while(t<=1){
		path.push([
			cx-r*Math.cos(t0+t*(tf-t0)),
			cy-r*Math.sin(t0+t*(tf-t0)) 
			]);
		t+=dt;
	}
	path.push(canvas_pixel_to_tile_corner(x2,y2));
	return path;
}
/*** Main Loop ***/

for(let i = 0;i<=layers.length;i++){
	layers[i].render();
}
function main(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	let p = Position.Positions[player.id];
	if(playerPath.length>0){
		let next = playerPath.shift();
		p.x = next[0];
		p.y = next[1];
	}
	else{
		let targetp = Position.Positions[target.id];
		targetp.x =- 100;
	}

	for(let i = 1;i<=layers.length;i++){
		//Skip the background layer render
		layers[i].render();
	}

	for(let i = 0;i<=layers.length;i++){
		layers[i].update(context);
	}
	//debug_line.update(context);
	requestAnimationFrame(main);
}

main();