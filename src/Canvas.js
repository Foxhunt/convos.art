import p2 from 'p2'
import Brush from './Brush'
import Particles from "./Particles"

import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Canvas {
    constructor() {
        this.world = null
        this.mouseConstraint = null
        this.planeBody = null
        this.roofBody = null
        this.leftWallBody = null
        this.rightWallBody = null
        this.mouseBody = null
        this.particles = null

        this.canvas = document.getElementById("myCanvas")
        this.width = this.canvas.width
        this.height = this.canvas.height

        this.brushes = new Map()
        this.ownBrush = null

        this.fixedTimeStep = 1 / 60
        this.maxSubSteps = 1
        this.lastTimeSeconds
        this.deltaTime
        this.timeSeconds

        this.initWorld()
        this.placeWalls()
        this.addMouseControlls()
        requestAnimationFrame(t => this.animate(t))

        if (typeof window.orientation !== "undefined") {
            window.addEventListener('deviceorientation', this.handleOrientation)
        }
    }

    addOwnBrush(ownBrush){
        this.ownBrush = ownBrush
        this.brushes.set(ownBrush.id, ownBrush)
    }

    removeBrush(brush) {
        this.brushes.delete(brush.id)
    }

    step(fixedTimeStep, deltaTime, maxSubSteps) {
        this.world.step(fixedTimeStep, deltaTime, maxSubSteps)
    }

    animate(t) {
		requestAnimationFrame(t => this.animate(t))

		this.timeSeconds = t / 1000
		this.lastTimeSeconds = this.lastTimeSeconds || this.timeSeconds

		this.deltaTime = this.timeSeconds - this.lastTimeSeconds

		// Move physics bodies forward in time
		this.step(this.fixedTimeStep, this.deltaTime, this.maxSubSteps)

		// Render scene
		this.render()
	}

    render() {
        const ctx = this.canvas.getContext("2d")
        ctx.save()
        ctx.translate(this.width / 2, this.height / 2) // Translate to the center
        ctx.scale(1, -1)
        // Draw all bodies
        for (let brush of this.brushes.values()) {
            brush.render(ctx)
        }
        this.drawWalls(ctx)
        this.particles.draw(ctx)
        ctx.restore()
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

    initWorld() {
        if (window.screen.orientation.type == "landscape-primary") {
            this.world = new p2.World({
                gravity: [0, -90]
            })
        } else {
            this.world = new p2.World({
                gravity: [0, 0]
            })
        }

        this.particles = new Particles(this.world)
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

    addMouseControlls() {
        // Create a body for the cursor
        this.mouseBody = new p2.Body()
        this.world.addBody(this.mouseBody)

        //Get mouse Position and create a mouse object
        this.canvas.addEventListener('mousedown', this.coursorDown.bind(this))
        this.canvas.addEventListener('touchstart', this.coursorDown.bind(this))

        // Sync the mouse body to be at the cursor position
        this.canvas.addEventListener('mousemove', this.coursorMove.bind(this))
        this.canvas.addEventListener('touchmove', this.coursorMove.bind(this))

        // Remove the mouse constraint on mouse up
        this.canvas.addEventListener('mouseup', this.coursorUp.bind(this))
        this.canvas.addEventListener('touchend', this.coursorUp.bind(this))

        // Beim verlassen der Maus wird die Box an Position gehalten
        this.canvas.addEventListener('mouseleave', this.mouseLeave.bind(this))

    }

    // Convert a canvas coordiante to physics coordinate
    getPhysicsCoord(Event) {
        Event.preventDefault()
        var rect = this.canvas.getBoundingClientRect()

        if (Event.touches) {
            var x = Event.touches[0].clientX - rect.left
            var y = Event.touches[0].clientY - rect.top
        } else {
            var x = Event.clientX - rect.left
            var y = Event.clientY - rect.top
        }
        x = (x - rect.width / 2) * (this.width / rect.width)
        y = (y - rect.height / 2) * -(this.height / rect.height)
        return [x, y]
    }

    //event handler für User Interaktion
    coursorDown(event) {
        // Convert the canvas coordinate to physics coordinates
        var position = this.getPhysicsCoord(event)

        // Check if the cursor is inside the box
        var hitBodies = this.world.hitTest(position, [this.ownBrush.body])

        if (hitBodies.length) {
            // Move the mouse body to the cursor position
            this.mouseBody.position[0] = position[0]
            this.mouseBody.position[1] = position[1]

            // Create a RevoluteConstraint.
            // This constraint lets the bodies rotate around a common point
            this.mouseConstraint = new p2.RevoluteConstraint(this.mouseBody, this.ownBrush.body, {
                worldPivot: position,
                collideConnected: false
            });
            this.world.addConstraint(this.mouseConstraint)
        }
    }

    coursorMove(event) {
        var position = this.getPhysicsCoord(event)
        this.mouseBody.position[0] = position[0]
        this.mouseBody.position[1] = position[1]
    }

    coursorUp(event) {
        this.world.removeConstraint(this.mouseConstraint)
        this.mouseConstraint = null
    }

    mouseLeave(event) {
        this.world.removeConstraint(this.mouseConstraint)
        this.mouseConstraint = null
    }

    addBrush(brush) {
        this.brushes.set(brush.id, brush)
    }

    newBrush({id}) {
        console.log("new! : " + id)
        let brush = new Brush({ id, world: this.world })
        this.brushes.set(id, brush)
    }

    leaveBrush({id}) {
        // Box löschen
        this.world.removeBody(this.brushes.get(id).body)
        this.brushes.delete(id);
        console.log("left! : " + id)
    }

    handleOrientation(event) {
        let x = event.gamma  // In degree in the range [-180,180]
        let y = event.beta // In degree in the range [-90,90]

        // Because we don't want to have the device upside down
        // We constrain the x value to the range [-90,90]
        if (window.screen.orientation.type == "landscape-primary") {
            const tmp = y
            y = -x
            x = tmp
        }

        if (window.screen.orientation.type == "landscape-secondary") {
            const tmp = y
            y = x
            x = -tmp
        }

        this.world.gravity[0] = x
        this.world.gravity[1] = -y
    }

}