import p2 from 'p2'
import { Container, Graphics, Sprite, filters as nativeFilters } from "pixi.js"
import * as extraFilters from "pixi-filters"
import { BRUSH, PARTICLES, PLANES } from './CollisionGroups';

const {  } = {
    ...nativeFilters,
    ...extraFilters
}

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
        this.fillSprite = null
        this.fillImageSrc = null
        this.strokeStyle = strokeStyle

        this.body = new p2.Body({
            mass: 100,
            position: [x, y],
            angle: angle,
            angularVelocity: 1
        })

        this.container = new Container()
        this.pixiApp.stage.addChild(this.container)

        this.container.filters = []

        this.graphic = new Graphics()
        this.container.addChild(this.graphic)

        this.Shape = Shape
        this.shape.collisionMask = 0x0000
        setTimeout(() => {
            this.shape.collisionMask = BRUSH | PLANES | PARTICLES
        }, 1000)
        this.world.addBody(this.body)
    }

    set Fill(color){
        this.fillStyle = color
        if(this.fillSprite){
            this.fillSprite.destroy(true)
            this.fillSprite = null
            this.graphic.destroy(true)
            this.graphic = new Graphics()
            this.container.addChild(this.graphic)
        }
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
        if(this.fillSprite){
            this.fillSprite.destroy()
        }
        const image = new Image()
        image.src = src
        this.fillImageSrc = src

        this.fillSprite = Sprite.from(image)
        this.fillSprite.anchor.set(0.5)

        this.fillSprite.texture.baseTexture.on("update", texture => this.setSpriteDimensions(texture))

        this.fillSprite.mask = this.graphic

        this.container.addChild(this.fillSprite)

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
        this.shape.collisionMask = BRUSH | PLANES | PARTICLES
        this.body.addShape(this.shape)
        this.drawShape()

        if (this.fillSprite)
            this.setSpriteDimensions(this.fillSprite.texture)
        
        if (this.socket)
            this.socket.emit('setShapeType', shapeType)
    }

    setSpriteDimensions(texture){
        const factor = this.graphic.height / texture.height
        this.fillSprite.width =  texture.width * factor
        this.fillSprite.height =  texture.height * factor
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
        this.container.position.x = this.body.interpolatedPosition[0]
        this.container.position.y = this.body.interpolatedPosition[1]
        this.container.rotation = this.body.angle
        
        const factor = this.calculateSizeFactor()
        this.container.scale.set(factor)
        this.adjustShape(factor)
        this.updateShape()
    }

    adjustShape(factor){
        if (this.shapeType === "BOX" || this.shapeType === "SQUARE") {
            this.shape.vertices.forEach((vertex, index, array) => {
                array[index][0] = factor * this.vertices[index][0]
                array[index][1] = factor * this.vertices[index][1]
            })
        } else {
            this.shape.radius = 50 * factor
        }
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
        this.graphic.endFill()
    }

    drawCircle(){
        this.graphic.drawCircle(0, 0, 50)
    }

    drawRect(){
        const width = this.shape.width
        const height = this.shape.height
        this.graphic.drawRect(-width / 2, -height / 2, width, height)
    }

    delete(){
        this.world.removeBody(this.body)
        this.container.destroy(true)
    }
}
