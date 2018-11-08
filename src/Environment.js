import p2 from 'p2'
import { Graphics } from "pixi.js"
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

        this.environmentGrafic = new Graphics()
        canvas.app.stage.addChild(this.environmentGrafic)

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

    render() {
        this.drawWalls()
    }

    //Boden wände
    drawWalls() {
        this.environmentGrafic.clear()
            .lineStyle(2, 0, 1, 0)
            .drawRect(-this.width / 2, -this.height / 2, this.width, this.height)
    }
}