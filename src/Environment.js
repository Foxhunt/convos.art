import p2 from 'p2'
import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Environment {
    constructor(canvas){
        this.world = canvas.world
        this.width = canvas.width
        this.height = canvas.height
        this.planeBody = null
        this.roofBody = null
        this.leftWallBody = null
        this.rightWallBody = null

        this.placeWalls()
    }

    placeWalls() {
        // Add a plane
        const planeBody = new p2.Body()
        planeBody.addShape(new p2.Plane())
        planeBody.shapes[0].collisionGroup = PLANES
        planeBody.shapes[0].collisionMask = BRUSH

        const roofBody = new p2.Body()
        roofBody.addShape(new p2.Plane())
        roofBody.shapes[0].collisionGroup = PLANES
        roofBody.shapes[0].collisionMask = BRUSH

        //wand links
        const leftWallBody = new p2.Body()
        leftWallBody.addShape(new p2.Plane())
        leftWallBody.shapes[0].collisionGroup = PLANES
        leftWallBody.shapes[0].collisionMask = BRUSH

        //wand rechts
        const rightWallBody = new p2.Body()
        rightWallBody.addShape(new p2.Plane())
        rightWallBody.shapes[0].collisionGroup = PLANES
        rightWallBody.shapes[0].collisionMask = BRUSH

        // planes hinzufügen
        this.world.addBody(planeBody)
        this.world.addBody(roofBody)
        this.world.addBody(rightWallBody)
        this.world.addBody(leftWallBody)

        // positionen und rotationen setzten
        planeBody.position[1] = -this.height / 2

        roofBody.position[1] = this.height / 2
        roofBody.angle = Math.PI

        leftWallBody.position[0] = -this.width / 2
        leftWallBody.angle = -(Math.PI / 2)


        rightWallBody.position[0] = this.width / 2
        rightWallBody.angle = Math.PI / 2

        this.planeBody = planeBody
        this.roofBody = roofBody
        this.leftWallBody = leftWallBody
        this.rightWallBody = rightWallBody
    }

    draw(ctx) {
        this.drawWalls(ctx)
    }

    //Boden wände
    drawWalls(ctx) {
        ctx.beginPath()

        var y = this.planeBody.position[1]
        ctx.moveTo(-this.width, y)
        ctx.lineTo(this.width, y)
        ctx.stroke()

        y = this.roofBody.position[1]
        ctx.moveTo(-this.width, y)
        ctx.lineTo(this.width, y)
        ctx.stroke()

        var x = this.leftWallBody.position[0]
        ctx.moveTo(x, -this.height)
        ctx.lineTo(x, this.height)
        ctx.stroke()

        x = this.rightWallBody.position[0]
        ctx.moveTo(x, -this.height)
        ctx.lineTo(x, this.height)
        ctx.stroke()
    }
}