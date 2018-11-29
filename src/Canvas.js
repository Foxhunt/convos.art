import p2 from 'p2'
import { Application, filters as nativeFilters } from "pixi.js"
import * as extraFilters from "pixi-filters"
import Brush from './Brush'
import Particles from "./Particles"
import Environment from "./Environment"
import MouseControlls from "./MouseControlls"
import Recorder from "./Recorder"

const {  } = {
    ...nativeFilters,
    ...extraFilters
}

export default class Canvas {
    constructor(pixiContainer) {
        this.app = new Application({
            width: 1920,
            height: 1080,
            clearBeforeRender: false,
            transparent: true,
            preserveDrawingBuffer: true,
            antialias: true,
            forceFXAA: true,
            roundPixels: true
        })

        this.app.stage.filters = []

        this.pixiContainer = pixiContainer
        this.width = 1920
        this.height = 1080

        setTimeout(() => {
            recorder.start(1000)
            console.log("recording!")
            setTimeout(() => {
                recorder.stop()
                console.log("stopped recording!")
            }, 30 * 1000)
        }, 1000)

        this.pixiContainer = pixiContainer
        this.width = 1920
        this.height = 1080

        this.brushes = new Map()
        this.ownBrush = null

        this.world =  new p2.World()
        this.particles = new Particles(this)
        this.environment = new Environment(this)
        this.mouseControlls = new MouseControlls(this)

        if (window.screen.orientation.type == "landscape-primary") {
            this.world.gravity = [0, -90]
        } else {
            this.world.gravity = [0, 0]
        }

        if (typeof window.orientation !== "undefined") {
            window.addEventListener('deviceorientation', event => this.handleOrientation(event))
        }

        this.pixiContainer.appendChild(this.app.view)
        this.app.stage.position.x = this.app.renderer.width / 2
        this.app.stage.position.y = this.app.renderer.height / 2
        this.app.stage.scale.y = -1
        this.app.ticker.add( delta => this.step(delta))
    }

    step(delta){
        this.world.step(1/60, 1/60 * delta)
        for(const brush of this.brushes.values()){
            brush.render()
        }
        this.particles.render()
        this.environment.render()
    }

    addOwnBrush(ownBrush){
        this.ownBrush = ownBrush
        this.mouseControlls.ownBrush = ownBrush
        this.brushes.set(ownBrush.id, ownBrush)
    }

    removeBrush(brush) {
        this.brushes.delete(brush.id)
    }

    addBrush(brush) {
        this.brushes.set(brush.id, brush)
    }

    newBrush({id}) {
        console.log("new! : " + id)
        let brush = new Brush({ id, world: this.world, pixiApp: this.app })
        this.brushes.set(id, brush)
    }

    leaveBrush({id}) {
        // Box löschen
        this.brushes.get(id).delete()
        this.brushes.delete(id);
        console.log("left! : " + id)
    }

    handleOrientation({gamma: x, beta: y}) {
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
