import p2 from 'p2'

export default class Box {
    constructor(id, x, y, angle){
        x = x || 0
        y = y || 0
        angle = angle || 0

        this.id = id
        this.shape = new p2.Box({width: 100, height: 50});
        this.body = new p2.Body({
            mass: 4,
            position: [x, y],
            angle: angle,
            angularVelocity: 1
        });
        this.body.addShape(this.shape);
    }

    addToWorld(world){
        world.addBody(this.body);
    }
}
