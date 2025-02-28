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
			case 'sprite':
				if(Sprite.Sprites[eid]==undefined){
					let s = new Sprite(...args);
					Sprite.Sprites[eid] = s;
				}
				return Sprite.Sprites[eid];
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
	constructor(x,y,eid){
			super();
			this.x = x;
			this.y = y;
	}
	update(){}
	
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

	constructor(layer){
		super();
		Layer.Layers[layer] = Layer.Layers[layer] || {};
		this.layer  = layer;
		this.canvas = document.createElement("canvas");
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
		}
		this.rendered = flag;
	}

	update(context){
		if(!this.rendered) this.render();
		context.drawImage(this.canvas,0,0);
	}
}

export{Entity, ComponentFactory,Layer, Sprite, Position}