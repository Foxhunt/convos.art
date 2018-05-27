import p2 from 'p2'

const PARTICLES = Math.pow(2, 0)
const BRUSH = Math.pow(2, 1)
const PLANES = Math.pow(2, 2)

export default class Box {
    constructor({id, x = 0, y = 0, angle = 0, own = false}){
        this.id = id
        this.isOwnBox = own
        this.shape = new p2.Box({width: 100, height: 50})
        this.body = new p2.Body({
            mass: 50,
            position: [x, y],
            angle: angle,
            angularVelocity: 1
        })

        this.shape.collisionGroup = BRUSH
        this.shape.collisionMask = BRUSH | PLANES | PARTICLES

        this.body.addShape(this.shape)

        this.vertices = [[], [], [], []]
        for(let i = 0; i < this.shape.vertices.length; i++){
            this.vertices[i][0] = this.shape.vertices[i][0]
            this.vertices[i][1] = this.shape.vertices[i][1]
        }
        this.height = this.shape.height
        this.width = this.shape.width
    }

    addToWorld(world){
        world.addBody(this.body)
    }

    render(ctx){
        this.adjustSize()
        this.draw(ctx)
    }

    adjustSize(){
        const factor = this.calculateSizeFactor()

        this.shape.width = factor * this.width
        this.shape.height = factor * this.height

        this.shape.vertices.forEach((vertex, index, array) => {
            array[index][0] = factor * this.vertices[index][0]
            array[index][1] = factor * this.vertices[index][1]
        })
        
        this.updateShape()
    }

    calculateSizeFactor(){
        const max = 2
        let factor = (this.body.velocity[0] + this.body.velocity[1]) * 0.005
        
        factor = Math.abs(factor)
        factor = factor < 1 ? 1 : factor
        factor = factor > max ? max : factor

        return factor
    }

    updateShape(){
        this.shape.updateTriangles()
        this.shape.updateCenterOfMass()
        this.shape.updateBoundingRadius()
        this.shape.updateArea()
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
