import p2 from 'p2'
import Brush from './Brush'
import Particles from "./Particles"
import Environment from "./Environment"
import MouseControlls from "./MouseControlls"

export default class Canvas {
    constructor(htmlCanvas) {
        this.world = null

        this.particles = null
        this.environment = null
        this.mouseControlls = null

        this.canvas = htmlCanvas
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
        requestAnimationFrame(t => this.animate(t))

        if (typeof window.orientation !== "undefined") {
            window.addEventListener('deviceorientation', this.handleOrientation)
        }
    }

    addOwnBrush(ownBrush){
        this.ownBrush = ownBrush
        this.mouseControlls.ownBrush = ownBrush
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
        this.environment.draw(ctx)
        this.particles.draw(ctx)
        ctx.restore()
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

        this.particles = new Particles(this)
        this.environment = new Environment(this)
        this.mouseControlls = new MouseControlls(this)
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