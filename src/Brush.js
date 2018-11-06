import p2 from 'p2';
import * as PIXI from "pixi.js"
import { BRUSH, PARTICLES, PLANES } from './CollisionGroups';

export default class Brush {
    constructor({id, x = 0, y = 0, angle = 0, own = false, world, pixiApp, socket, fillStyle = "#0000ff", strokeStyle = "#ff0000", Shape = "CIRCLE", fillImage = null}){
        this.id = id
        this.isOwnBox = own
        this.world = world
        this.pixiApp = pixiApp
        this.socket = socket
        this.shape = null
        this.shapeType = null

        this.fillStyle = fillStyle
        this.fillImage = fillImage
        this.strokeStyle = strokeStyle

        this.body = new p2.Body({
            mass: 100,
            position: [x, y],
            angle: angle,
            angularVelocity: 1
        })

        this.graphic = new PIXI.Graphics()
        this.pixiApp.stage.addChild(this.graphic)

        this.Shape = Shape
        this.world.addBody(this.body)
    }

    set Fill(color){
        this.fillStyle = color
        this.fillImage = null
        this.drawShape()
        if (this.socket)
            this.socket.emit('setFillStyle', color)
    }

    set Stroke(color){
        this.strokeStyle = color
        this.drawShape()
        if (this.socket)
            this.socket.emit('setStrokeStyle', color)
    }

    set Image(src){
        const img = new Image()
        img.src = src
        this.fillImage = img
        if (this.socket)
            this.socket.emit('setFillImage', src)
    }

    set Shape(shapeType){
        this.body.removeShape(this.shape)
        switch (shapeType) {
            case "CIRCLE": this.setCircleShape(50)
            break
            case "BOX": this.setSquareShape(100, 50) 
            break
            case "SQUARE": this.setSquareShape(75, 75) 
            break
        }
        this.shapeType = shapeType
        this.shape.collisionGroup = BRUSH
        this.body.addShape(this.shape)
        this.updateShape()
        this.drawShape()
        if (this.socket)
            this.socket.emit('setShapeType', shapeType)
    }

    setCircleShape(radius){
        this.shape = new p2.Circle({radius})
    }

    setSquareShape(width, height){
        this.shape = new p2.Box({width, height})
        this.height = this.shape.height
        this.width = this.shape.width
        this.vertices = [[], [], [], []]
        for(let i = 0; i < this.shape.vertices.length; i++){
            this.vertices[i][0] = this.shape.vertices[i][0]
            this.vertices[i][1] = this.shape.vertices[i][1]
        }
    }

    render(){
        this.graphic.position.x = this.body.interpolatedPosition[0]
        this.graphic.position.y = this.body.interpolatedPosition[1]
        this.graphic.rotation = this.body.angle
        this.adjustSize()
    }

    adjustSize(){
        const factor = this.calculateSizeFactor()

        switch (this.shapeType) {
            case "CIRCLE": this.adjustCircle(factor)
            break
            case "BOX":
            case "SQUARE": this.adjustSquare(factor)
            break
        }
        this.updateShape()
    }

    adjustCircle(factor){
        this.shape.radius = 50 * factor
    }

    adjustSquare(factor){
        this.shape.width = factor * this.width 
        this.shape.height = factor * this.height 
        this.shape.vertices.forEach((vertex, index, array) => {
            array[index][0] = factor * this.vertices[index][0]
            array[index][1] = factor * this.vertices[index][1]
        })
    }

    calculateSizeFactor(){
        const max = 2
        let factor = (this.body.velocity[0] + this.body.velocity[1]) * 0.005
        
        factor = Math.abs(factor)
        factor = factor < 1 ? 1 : factor
        factor = factor > max ? max : factor

        return factor
    }

    updateShape() {
        if (this.shape.updateTriangles)
            this.shape.updateTriangles()

        if (this.shape.updateCenterOfMass)
            this.shape.updateCenterOfMass()

        if (this.shape.updateBoundingRadius)
            this.shape.updateBoundingRadius()

        if (this.shape.updateArea)
            this.shape.updateArea()
    }

    drawShape(){
        this.graphic.clear()
        this.graphic.beginFill(parseInt(this.fillStyle.replace(/^#/, ''), 16))
        this.graphic.lineStyle(3, parseInt(this.strokeStyle.replace(/^#/, ''), 16))
        switch (this.shapeType) {
            case "CIRCLE": this.drawCircle()
            break
            case "BOX":
            case "SQUARE": this.drawRect()
            break
        }
    }

    drawCircle(){
        this.graphic.drawCircle(0, 0, this.shape.radius)
        this.graphic.endFill()
    }

    drawRect(){
        const width = this.shape.width
        const height = this.shape.height
        this.graphic.drawRect(-width / 2, -height / 2, width, height)
        this.graphic.endFill()
    }
}
