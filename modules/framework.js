class Entity{
	static ID_COUNTER = -1;
	constructor(){
		this.id = Entity.ID_COUNTER++;
	}
}

class Component{
	constructor(){
	}

	update(){}
}

class System{
	constructor(){}
}