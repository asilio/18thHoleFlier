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


function MakeCubes(){

	let width = 32;
	let height = 32;

	let rows = 30;
	let cols = 40;
	for(let i = 0;i <rows;i++){
		for(let j=0;j<cols;j++){
			cubes.push(new Isocube( [(i%rows)*width,(j%cols)*height],"./Assets/isocube.png"));
		}
	}
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');	
const cubes = [];

function LevelOne(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height)
	for(let i = 0;i<cubes.length;i++)
	{
		cubes[i].draw(context);
	}
	requestAnimationFrame(LevelOne);
}
MakeCubes();
LevelOne();