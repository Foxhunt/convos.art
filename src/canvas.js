import p2 from 'p2'
import Brush from './Brush'

import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Canvas {
    constructor(socket) {
        this.world = null
        this.mouseConstraint = null
        this.planeBody = null
        this.roofBody = null
        this.leftWallBody = null
        this.rightWallBody = null
        this.mouseBody = null
        this.particles = []

        this.canvas = document.getElementById("myCanvas")
        this.width = this.canvas.width
        this.height = this.canvas.height

        this.brushes = new Map()
        this.socket = socket
        this.ownBrush = null

        this.fixedTimeStep = 1 / 60
        this.maxSubSteps = 1
        this.lastTimeSeconds
        this.deltaTime
        this.timeSeconds

        this.initWorld()
        this.placeWalls()
        this.addMouseControlls()
        this.initConnection()
        requestAnimationFrame(t => this.animate(t))

        if (typeof window.orientation !== "undefined") {
            window.addEventListener('deviceorientation', this.handleOrientation)
        }
    }

    addOwnBrush(ownBrush){
        this.ownBrush = ownBrush
        this.brushes.set(ownBrush.id, ownBrush)
    }

    addBrush(brush) {
        this.brushes.set(brush.id, brush)
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
        this.findContacts()
        this.drawParticles(ctx)
        ctx.restore()
    }

    //Boden wände
    drawWalls(ctx) {
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

    findContacts() {
        for (let i = 0; i < this.world.narrowphase.contactEquations.length; i++) {
            let eq = this.world.narrowphase.contactEquations[i]
            let bodyAPosition = eq.bodyA.position
            let contactPointA = eq.contactPointA

            let contactX = bodyAPosition[0] + contactPointA[0]
            let contactY = bodyAPosition[1] + contactPointA[1]

            this.spawnParticle(contactX, contactY)
        }
    }

    spawnParticle(x, y) {
        const pShape = new p2.Particle({ radius: 3 })
        const pBody = new p2.Body({
            mass: 50,
            position: [x, y],
            velocity: [
                140 * Math.cos(Math.PI * Math.random()),
                140 * Math.cos(Math.PI * Math.random())
            ]
        })

        pShape.collisionGroup = PARTICLES
        pShape.collisionMask = PLANES | BRUSH

        pBody.addShape(pShape)
        this.world.addBody(pBody)

        this.particles.push(pBody)

        if (this.particles.length > 100) {
            this.world.removeBody(this.particles.shift())
        }
    }

    drawParticles(ctx) {
        for (let particle of this.particles) {
            ctx.beginPath()
            let x = particle.interpolatedPosition[0]
            let y = particle.interpolatedPosition[1]
            ctx.save()
            ctx.translate(x, y)
            ctx.arc(0, 0, 2, 0, 2 * Math.PI)
            ctx.fillStyle = "#ff00aa"
            ctx.fill()
            ctx.restore()
        }
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

    initConnection() {
        //Neuen client und seine Box anlegen
        this.socket.on('new', this.newBrush.bind(this))

        //Box eines Clients löschen der das Spiel verlassen hat
        this.socket.on('leave', this.leaveBrush.bind(this))

        //Box Informationen vom Server erhalten
        this.socket.on('toClient', ({ id, x, y, angle, velocity, angularVelocity }) => {
            // betroffene box ermitteln
            let box = this.brushes.get(id)
            //erhaltenen Informationen verarbeiten
            if (box) {
                box.body.position[0] = x
                box.body.position[1] = y
                box.body.angle = angle
                box.body.velocity = velocity
                box.body.angularVelocity = angularVelocity
            }
        })

        this.socket.on('setFillStyle', ({ id, color }) => {
            let box = this.brushes.get(id)
            if (box) {
                box.Fill = color
            }
        })

        this.socket.on('setStrokeStyle', ({ id, color }) => {
            let box = this.brushes.get(id)
            if (box) {
                box.Stroke = color
            }
        })

        this.socket.on('setShapeType', ({ id, shapeType }) => {
            let box = this.brushes.get(id)
            if (box) {
                box.Shape = shapeType
            }
        })

        this.socket.on('setFillImage', ({ id, imageSrc }) => {
            let box = this.brushes.get(id)
            if (box) {
                box.Image = imageSrc
            }
        })
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