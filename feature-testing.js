import {draw_isoplane_at_angle} from "./modules/isometric.js";

class Isocube{
	constructor(pos,sprite_file){
		this.pos = pos;
		this.change_sprite(sprite_file);
		this.z = 0;
	}

	set_file_loaded(){
		this.file_loaded = true;
	}

	change_sprite(file){
		this.file_loaded = false;
		this.sprite = new Image();
		this.sprite.src = file;
		this.sprite.addEventListener("load",this.set_file_loaded.bind(this));
	}

	draw(context){
		context.drawImage(this.sprite,this.pos[0],this.pos[1]-this.z);
	}
}

function IsometricGridRotationToScreen(coordinates,rotation,width,height){
	/*
	(width/2*cos(rotation), -sin(rotation))
	(height/4*sin(rotation), cos(rotation))
	*/
}

function IsometricGridToScreen(coordinates,width,height){
	/*
	(width/2, -width/2)
	(height/4, height/4)
	*/
	return [(coordinates[0]-coordinates[1])*width/2+canvas.width/2,(coordinates[0]+coordinates[1])*height/4];
}

function ScreenToIsometricGrid(coordinates,width,height){
	/*
	(d -b)
	(-c a)
	* 1/(ad - bc)

	1/(width/2*height/4 - (-width/2)*height/4)
	=1/(width*height/8+width*height/8)
	=1/(width*height/4)
	=4/(width*height)

	4/(width*height) * (height/4  width/2)
	                   (-height/4  width/2)


	(1/width, 2/height)
	(-1/width, 2/height)
	*/
	let x = coordinates[0]-canvas.width/2;
	return [Math.floor((x/width+2*coordinates[1]/height)),Math.floor((-x/width+2*coordinates[1]/height))];

}

const grid=[];
function MakeCubes(cubes,iso=false){

	let width = 32;
	let height = 32;

	let rows = 30;
	let cols = 40;
	for(let i = 0;i <rows;i++){
		grid[i]=[];
		for(let j=0;j<cols;j++){
			if(iso){
				let cube = new Isocube( 
					IsometricGridToScreen([(i%rows),(j%cols)],width,height),
					"./Assets/isocube.png");
				cubes.push(cube);
				grid[i][j]=cube;
			}
			else{
				cubes.push(new Isocube( 
					[(i%rows)*width,(j%cols)*height],
					"./Assets/isocube.png"));
			}
		}
	}
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let last_clicked =undefined;
const cubes = [];
MakeCubes(cubes,true);
const bob = new Isocube(IsometricGridToScreen([5,5],32,32),"./Assets/isodisc.png");


document.addEventListener("click",(event)=>
{
	//console.log(event.clientX,event.clientY);
	let i,j;
	[i, j] = ScreenToIsometricGrid([event.clientX,event.clientY],32,32);
	//console.log(i,j);
	//let x,y;
	//[x,y] = IsometricGridToScreen([i,j],32,32);
	//console.log(x,y);
	//let [p, q] = ScreenToIsometricGrid([x-640/2,y],32,32);
	//console.log(p-1,q);
	//[p, q] = ScreenToIsometricGrid([bob.pos[0]-640/2, bob.pos[1]],32,32);
	//console.log("Bob: ", p, q);
	try{
		if(last_clicked == undefined){
		}else{
			last_clicked.change_sprite("./Assets/isocube.png");
			last_clicked.z = 0;
		}
		last_clicked = grid[i-1][j];
		last_clicked.change_sprite("./Assets/hovercube.png");

	}catch(err){return}
});
const canvas2 = document.getElementById('canvas2');
const context2 =canvas2.getContext('2d');
context2.font = "48px serif";
context2.fillText("Hello world", 10, 50);

document.addEventListener('mousemove',(event)=>
{
	if(event.target == canvas){
		let i,j, x, y;
		[i, j] = ScreenToIsometricGrid([event.clientX,event.clientY],32,32);
		[x,y]  = IsometricGridToScreen([i,j],32,32);
		y=y-8;
		//context2.clearRect(0,0,context2.canvas.width,context2.canvas.height)
		//context2.fillText(`Iso from Mouse: (${i},${j})`,10,50);
		//context2.fillText(`Mouse x,y: (${event.clientX},${event.clientY})`,10,100);
		//context2.fillText(`x,y from iso: (${x},${y})`,10,150);
		context.strokeStyle="#ff0039";
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x+Math.sqrt(3)*8,y+8);
		context.lineTo(x,y+16);
		context.lineTo(x-Math.sqrt(3)*8,y+8);
		context.lineTo(x,y);
		context.stroke();
		context.closePath();/*
		let x1,y1,x2,y2,x3,y3,x4,y4;
		x1=x;
		x2 = Math.round((x+Math.sqrt(3)*8)*100,2)/100;
		x3 = Math.round((x-Math.sqrt(3)*8)*100,2)/100;
		x4 = x;
		y1 = y;
		y2 = y+8;
		y3 = y+16;
		y4 = y;
		context2.fillText(`BoundingBox: `,10,2000);
		context2.fillText(` [(${x1},${y1});(${x2},${y2})`,10,250);
		context2.fillText(`  (${x3},${y3});(${x4},${y4})]`,10,300);*/
	}
});

function LevelOne(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height)
	for(let i = 0;i<cubes.length;i++)
	{
		cubes[i].draw(context);
		//cubes[i].z+=2*Math.sin(Date.now()*Math.PI/1000-i*Math.PI/4-(i%40)*Math.PI/6);
	}
	if(last_clicked ==undefined){}
	else{
		if(last_clicked.z<16){
			last_clicked.z+=0.1;
		}
	}
	let i,j;
	[i,j] = ScreenToIsometricGrid([bob.pos[0], bob.pos[1]],32,32);
	//console.log(i,j);
	bob.z = grid[i][j].z;
	bob.draw(context);

	let x1, y1, x2, y2, x3, y3, x4, y4;
	[x1, y1] = IsometricGridToScreen([7,10],32,32);
	[x2, y2] = IsometricGridToScreen([8,10],32,32);
	[x3, y3] = IsometricGridToScreen([8,11],32,32);
	[x4, y4] = IsometricGridToScreen([7,11],32,32);

	requestAnimationFrame(LevelOne);
}

LevelOne();
draw_isoplane_at_angle(context2,Math.PI/6,canvas2.width/2,0,10,10,16);