import p2 from 'p2'
import * as PIXI from "pixi.js"
import Brush from './Brush'
import Particles from "./Particles"
import Environment from "./Environment"
import MouseControlls from "./MouseControlls"
import { setParticleColor } from '../store/actions';

export default class Canvas {
    constructor(pixiContainer) {
        this.app = new PIXI.Application({
            width: 1920,
            height: 1080,
            clearBeforeRender: false,
            transparent: true,
            preserveDrawingBuffer: true
        })

        this.pixiContainer = pixiContainer
        this.width = this.pixiContainer.width
        this.height = this.pixiContainer.height

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
        this.world.step(1/60)
        for(const brush of this.brushes.values()){
            brush.render()
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
        this.world.removeBody(this.brushes.get(id).body)
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