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
	constructor(sprite,eid){
		super();
		this.sprite = new Image();
		this.sprite.src = sprite;
		this.entity = eid;
		this.ready = false;
		this.sprite.addEventListener("load",this.setReady);
	}

	setRead(){
		this.ready = true;
	}

	draw(context){
		if(!this.ready) return;
		let p = Position.Positions[this.entity];
		if(p==undefined) return;
		
		context.drawImage(this.sprite,p.x,p.y);
	}

	update(context){
		this.draw(context);
	}
}

class System{
	constructor(){}
}

export{Entity, ComponentFactory, Sprite, Position}