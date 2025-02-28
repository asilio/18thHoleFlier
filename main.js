import {Entity,Sprite,Line, Speed,Layer, Position, ComponentFactory} from "./modules/framework.js";

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
	ComponentFactory.createComponent("Position",t.id,TILE_SIZE*((i)%WIDTH+1),TILE_SIZE*Math.floor((i)/WIDTH+1));
	layers[0]=ComponentFactory.createComponent("Layer",t.id, 0,context.canvas.width,context.canvas.height);
}


ComponentFactory.createComponent("Sprite",player.id,"./Assets/disc.png");
ComponentFactory.createComponent("Position",player.id,10*TILE_SIZE,15*TILE_SIZE);
layers[1]=ComponentFactory.createComponent("Layer",player.id,1,context.canvas.width,context.canvas.height);
const p = Position.Positions[player.id];
ComponentFactory.createComponent("Speed",player.id,10);

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

function PositionSpriteLayerFactory(x,y,sprite,layer){
	let E = new Entity();
	ComponentFactory.createComponent("Sprite",E.id,sprite);
	ComponentFactory.createComponent("Position",E.id,x,y);
	let L = ComponentFactory.createComponent("Layer",E.id,layer,context.canvas.width,context.canvas.height);
	layers[L.layer]=L;
	return E;
}
let hover = PositionSpriteLayerFactory(-100,0,"./Assets/hoverbox.png", 1);
let target = PositionSpriteLayerFactory(-100,0,"./Assets/target.png", 1);
let center = PositionSpriteLayerFactory(-100,0,"./Assets/center.png", 1);
let midpoint = PositionSpriteLayerFactory(-100,0,"./Assets/midpoint.png", 1);
let lefty = PositionSpriteLayerFactory(32,0,"./Assets/lefty.png", 2);

let distance = 0;
/*** Mouse Events ***/
context.canvas.addEventListener('mousemove',
	(event)=>{
		let cx = event.offsetX;
		let cy = event.offsetY;
		
		let result = canvas_pixel_to_tile_corner(cx,cy);
		
		let p = Position.Positions[hover.id];
		p.x=result[0];
		p.y=result[1];
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
		distance=getArcPosition(pp.x,pp.y,p.x,p.y,32*2,'right')[2];
	});



function getArcPosition(x1,y1,x2,y2,d,hyzer='left',t=0){
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
	console.log(r*Math.abs(t0-tf));

	let cp = Position.Positions[center.id];
	let mp = Position.Positions[midpoint.id]
	mp.x = (x1+x2)/2;
	mp.y = (y1+y2)/2;
	cp.x = cx;
	cp.y = cy;
	return [
		cx-r*Math.cos(t0+t*(tf-t0)),
		cy-r*Math.sin(t0+t*(tf-t0)) 
		];
	//Path
	
	//let t = 0;

	//let path = [];
	//while(t<=1){
	//	path.push([
	//		cx-r*Math.cos(t0+t*(tf-t0)),
	//		cy-r*Math.sin(t0+t*(tf-t0)) 
	//		]);
	//	t+=dt;
	//}
	//path.push(canvas_pixel_to_tile_corner(x2,y2));
	//return path;
}
/*** Main Loop ***/

for(let i = 0;i<layers.length;i++){
	layers[i].render();
}

let travel_time = 0;
let playerp = Position.Positions[player.id];
let players = Speed.Speeds[player.id].speed;
let targetp = Position.Positions[target.id];
//Timing Setup for game loop
let time_last_update=Date.now();
let time_now;
let delta_time;
let time_accumulator=0;
let time_slice = 0.01*1000;
let N = 0;
let M = 0;
let dt = 0;
function update(time_slice){
	console.log(distance, N, M, travel_time,dt);
	if(distance > 0 && travel_time == 0 && N==0){
		travel_time = 1000*distance/players;
		N = Math.floor(travel_time/time_slice);
		dt = 1/N;
		M = 0;
	}
	if(M<N){
		let x, y, d;
		[x, y, d] = getArcPosition(playerp.x,playerp.y,targetp.x,targetp.y,32*2,'right',dt*M);
		M+=1;
		playerp.x = x;
		playerp.y = y;
	}
	if(M>N){
		travel_time = 0;
		M = 0;
		N = 0;
		distance = 0;
	}

}

function draw(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	for(let i = 1;i<layers.length;i++){
		//Skip the background layer render
		layers[i].render();
	}

	for(let i = 0;i<layers.length;i++){
		layers[i].update(context);
	}
}

function main(){
	time_now = Date.now();
	delta_time = time_now - time_last_update;
	time_last_update += delta_time;
	time_accumulator += delta_time;
	//console.log(time_now, time_last_update, delta_time, time_accumulator, time_slice);
	while(time_accumulator> time_slice)
	{
		update(time_slice);
		time_accumulator-=time_slice;
	}	
	draw();
	requestAnimationFrame(main);
}

main();