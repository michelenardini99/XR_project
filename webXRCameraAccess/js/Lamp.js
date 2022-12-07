class Lamp{

    constructor(mesh, name){
        this.mesh=mesh;
        this.name=name;
    }

    getName(){
        return this.name;
    }

    getMesh(){
        return this.mesh;
    }

}

export {Lamp};