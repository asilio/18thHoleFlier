class Entity{
	static ID_COUNTER = -1;
	static Entities=[];
	constructor(name=""){
		this.id = ++Entity.ID_COUNTER;
		this.name = name;
		Entity.Entities[this.id] = this;
	}
}

class ComponentFactory{
	static createComponent(type,eid){
		let args=Array.from(arguments).slice(2);
		type = type.toLowerCase();
		switch(type){
			case 'position':
				if(Position.Positions[eid]==undefined){
					let p = new Position(...args);
					Position.Positions[eid] = p;
				}
				return Position.Positions[eid];
			case 'speed':
				if(Speed.Speeds[eid]==undefined){
					let s = new Speed(...args);
					Speed.Speeds[eid] = s;
				}
				return Speed.Speeds[eid];
			case 'sprite':
				if(Sprite.Sprites[eid]==undefined){
					let s = new Sprite(...args);
					Sprite.Sprites[eid] = s;
				}
				return Sprite.Sprites[eid];
			case 'selectable':
				if(Selectable.Selectables[eid] == undefined){
					//console.log(...args);
					let s = new Selectable(...args);
					Selectable.Selectables[eid] = s;
				}
				return Selectable.Selectables[eid];

			case 'layer':
				let layer = args[0];
				if(Layer.Layers[layer] == undefined)
				{
					let l = new Layer(...args);
					Layer.Layers[layer][eid]=l;	
				}else if(Layer.Layers[layer][eid]==undefined){
					let l = new Layer(...args);
					Layer.Layers[layer][eid]=l;	
				}
				
				return Layer.Layers[layer][eid];
		}

	}
}

class Component{
	static ID_COUNTER = -1;
	constructor(){
		this.id = ++Component.ID_COUNTER;
	}
	update(){ throw new Error("Update Not Implemented in Derived Class");}
}

class Position extends Component{
	static Positions = {};
	static remove(eid){
		delete Position.Positions[eid];
	}
	constructor(x,y){
			super();
			this.x = x;
			this.y = y;
	}
	update(x,y){
		this.x=x;
		this.y=y;
	}

	distance(to){
		return Math.sqrt(Math.pow(this.x-to.x,2)+Math.pow(this.y-to.y,2));
	}
	
}

class Selectable extends Component{
	static Selectables = {};
	static remove(eid){
		delete Selectable.Selectables[eid];
	}

	constructor(isSelected,selectedSprite, defaultSprite){
		super();
		this.isSelected = isSelected;
		this.selectedSprite = new Image();
		this.selectedSprite.src = selectedSprite;
		this.defaultSprite = new Image();
		this.defaultSprite.src = defaultSprite;
		this.selectedSpriteReady = false;
		this.defaultSpriteReady = false;
		this.selectedSprite.addEventListener("load",this.setSelectedReady.bind(this));
		this.defaultSprite.addEventListener("load",this.setDefaultReady.bind(this));
	}

	setSelectedReady(){
		this.selectedSpriteReady=true;
	}

	setDefaultReady(){
		this.defaultSpriteReady=true;
	}

	isInSprite(x,y,eid){
		let p = Position.Positions[eid];
		let sw = this.defaultSprite.width;
		let sh = this.defaultSprite.height;
		return (x> p.x && x< p.x+sw) && (y>p.y && y<p.y+sh);
	}

	toggleSelected(){
		this.isSelected = !this.isSelected;
	}

	draw(context,eid){
		//console.log(this);
		if(!(this.defaultSpriteReady && this.selectedSpriteReady)) return false;
		let p = Position.Positions[eid];
		if(p == undefined) return false;
		if(this.isSelected){
			context.drawImage(this.selectedSprite,p.x,p.y)
		}else{
			context.drawImage(this.defaultSprite,p.x,p.y);
		}
	}

	update(context,eid){
		this.draw(context,eid);
	}


}

class Speed extends Component{
	static Speeds = {};
	static remove(eid){
		delete Speed.Speeds[eid];
	}

	constructor(speed){
		super();
		this.speed = speed;
	}
}

class Line extends Component{
	static Lines = {};
	static remove(eid){
		delete Line.Lines[eid];
	}

	constructor(x1,y1,x2,y2){
		super();
		this.p1 = [x1,y1];
		this.p2 = [x2,y2];
	}

	update(context){
		//console.log(this.p1,this.p2);
		context.moveTo(this.p1[0],this.p1[1]);
		context.lineTo(this.p2[0],this.p2[1]);
		context.stroke();
	}
}

class Sprite extends Component{
	static Sprites = {};
	static remove(eid){
		delete Sprite.Sprites[eid];
	}
	constructor(sprite){
		super();
		this.sprite = new Image();
		this.sprite.src = sprite;
		this.ready = false;
		this.sprite.addEventListener("load",this.setReady.bind(this));
	}

	setReady(){
		this.ready = true;
	}

	draw(context,eid){
		if(!this.ready) return false;
		let p = Position.Positions[eid];
		//console.log(p);
		if(p==undefined) return false;
	
		context.drawImage(this.sprite,p.x,p.y);
	}

	update(context,eid){
		this.draw(context,eid);
	}
}

class Layer extends Component{
	static Layers=[];
	static removeFromLayer(layer,eid){
		delete Layer.Layers[layer][eid];
	}

	static getLayer(layer){
		let eid = Object.keys(Layer.Layers[layer])[0];
		return Layer.Layers[layer][eid];
	}

	constructor(layer,width,height){
		super();
		Layer.Layers[layer] = Layer.Layers[layer] || {};
		this.layer  = layer;
		this.canvas = document.createElement("canvas");
		this.canvas.width=width;
		this.canvas.height=height;
		this.context = this.canvas.getContext("2d");
		this.rendered = false;
	}

	render(){
		this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
		let flag = true;
		for(let eid in Layer.Layers[this.layer]){
			if(eid in Sprite.Sprites){
				if(!Sprite.Sprites[eid].draw(this.context,eid)){
					flag = false
				};
			}
			if(eid in Selectable.Selectables){
				if(!Selectable.Selectables[eid].draw(this.context,eid)) flag = false;
			}
		}
		this.rendered = flag;
	}

	update(context){
		if(!this.rendered) this.render();
		context.drawImage(this.canvas,0,0);
	}
}

export{Entity,Line, ComponentFactory,Layer, Sprite, Position, Speed,Selectable}