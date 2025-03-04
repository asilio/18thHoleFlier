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
	return [(coordinates[0]/width+2*coordinates[1]/height),(-coordinates[0]/width+2*coordinates[1]/height)];

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
					IsometricGridToScreen([(i%rows),(j%cols)],width,height),
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
const cubes = [];
MakeCubes(cubes,true);

function LevelOne(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height)
	for(let i = 0;i<cubes.length;i++)
	{
		cubes[i].draw(context);
	}
	
	requestAnimationFrame(LevelOne);
}

LevelOne();