function LevelOne(){
	let EID = -1;
	
	function Tag(){
		let id = ++EID;
		let args = Array.from(arguments);
		let stride = args.length;
		if(Tag.components == undefined){
			Tag.components = [];
		}
		for(let i = 0; i<stride;i++){
			Tag.components[id*stride + i] = args[i];
		}
	}
	

	function Position(){
		let id = ++EID;
		let args = Array.from(arguments);
		let stride = args.length;
		if(Position.components == undefined){
			Position.components = [];
		}
		for(let i = 0; i<stride;i++){
			Position.components[id*stride + i] = args[i];
		}
	}


	function PositionSprite(){
		let id = ++EID;
		let args = Array.from(arguments);
		let stride = args.length;
		if(PositionSprite.components == undefined){
			PositionSprite.components = [];
		}
		for(let i = 0; i<stride;i++){
			PositionSprite.components[id*stride + i] = args[i];
		}
	}

	function TagPositionSprite(){
		let id = ++EID;
		let args = Array.from(arguments);
		let stride = args.length;
		if(TagPositionSprite.components == undefined){
			TagPositionSprite.components = [];
		}
		for(let i = 0; i<stride;i++){
			TagPositionSprite.components[id*stride + i] = args[i];
		}
	}

	TagPositionSprite("Block",15,15,25,"block.png");
	Position(0,0,0);
	TagPositionSprite("Player",50,50,0,"player.png");
	Position(15, 15, 0);
	console.log(TagPositionSprite.components);
	console.log(Position.components)
}

LevelOne();