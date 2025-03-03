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

function IsometricGridToScreen(coordinates,width,height){
	/*
	(width/2, -width/2)
	(height/4, height/4)
	*/
	return [(coordinates[0]-coordinates[1])*width/2+640/2,(coordinates[0]+coordinates[1])*height/4];
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
	return [Math.floor((coordinates[0]/width+2*coordinates[1]/height)),Math.floor((-coordinates[0]/width+2*coordinates[1]/height))];

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
	console.log(event.clientX,event.clientY);
	let i,j;
	[i, j] = ScreenToIsometricGrid([event.clientX-640/2,event.clientY],32,32);
	console.log(i-1,j);
	let x,y;
	[x,y] = IsometricGridToScreen([i,j],32,32);
	console.log(x,y);
	let [p, q] = ScreenToIsometricGrid([x-640/2,y],32,32);
	console.log(p-1,q);
	[p, q] = ScreenToIsometricGrid([bob.pos[0]-640/2, bob.pos[1]],32,32);
	console.log("Bob: ", p, q);
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

function LevelOne(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height)
	for(let i = 0;i<cubes.length;i++)
	{
		cubes[i].draw(context);
		//cubes[i].z+=2*Math.sin(Date.now()*Math.PI/1000-i*Math.PI/4-(i%40)*Math.PI/6);
	}
	if(last_clicked ==undefined){}
	else{
		if(last_clicked.z<10){
			last_clicked.z+=0.1;
		}
	}
	let i,j;
	[i,j] = ScreenToIsometricGrid([bob.pos[0]-640/2, bob.pos[1]],32,32);
	//console.log(i,j);
	bob.z = grid[i][j].z;
	bob.draw(context);
	requestAnimationFrame(LevelOne);
}
console.log(bob);
LevelOne();