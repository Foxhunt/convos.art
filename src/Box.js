import p2 from 'p2'

export default class Box {
    constructor({id, x = 0, y = 0, angle = 0, own = false}){
        this.id = id
        this.isOwnBox = own
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

    draw(ctx){
        ctx.beginPath()
        let x = this.body.interpolatedPosition[0]
        let y = this.body.interpolatedPosition[1]
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(this.body.interpolatedAngle)
        if (this.isOwnBox) {
            ctx.strokeStyle = "red"
        }
        ctx.rect(-this.shape.width / 2, -this.shape.height / 2, this.shape.width, this.shape.height)
        ctx.fillStyle = "blue"
        ctx.lineWidth = 1
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
}
