class Isocube{
	constructor(pos,sprite_file){
		this.pos = pos;
		this.change_sprite(sprite_file);
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
		context.drawImage(this.sprite,this.pos[0],this.pos[1]);
	}
}

function RectilinearToIsometricCoordinates(coordinates,width,height){
	return [(coordinates[0]-coordinates[1])*width/2+1280/2,(coordinates[0]+coordinates[1])*height/4];
}


function MakeCubes(cubes,iso=false){

	let width = 32;
	let height = 32;

	let rows = 30;
	let cols = 40;
	for(let i = 0;i <rows;i++){
		for(let j=0;j<cols;j++){
			if(iso){
				cubes.push(new Isocube( 
					RectilinearToIsometricCoordinates([(i%rows)*width,(j%cols)*height],width,height),
					"./Assets/isocube.png"));
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
const canvas2 = document.getElementById('canvas2');
const context2 = canvas2.getContext('2d');
const cubes1 = [];
const cubes2 = [];
MakeCubes(cubes1);
MakeCubes(cubes2)
function LevelOne(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height)
	context2.clearRect(0,0,context2.canvas.width,context2.canvas.height)
	for(let i = 0;i<cubes1.length;i++)
	{
		cubes1[i].draw(context);
	}
	for(let i = 0;i<cubes2.length;i++)
	{
		cubes2[i].draw(context2);
	}
	requestAnimationFrame(LevelOne);
}

LevelOne();