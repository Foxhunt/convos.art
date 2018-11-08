import p2 from 'p2'
import * as PIXI from "pixi.js"

import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Particles {
    constructor(canvas) {
        this.canvas = canvas
        this.world = canvas.world
        this.particles = []
        this.particleColor = "#ff00aa"
        this.maxParticles = 100
        this.enabled = true

        this.particleGrafic = new PIXI.Graphics()
        this.canvas.app.stage.addChild(this.particleGrafic)
    }

    render() {
        this.particleGrafic.clear()
        this.particleGrafic.beginFill(parseInt(this.particleColor.replace(/^#/, ''), 16))
        this.enabled && this.findContacts()
        for (let particle of this.particles) {
            if (this.isInBounds(particle)) {
                this.drawParticle(particle)
            } else {
                const index = this.particles.indexOf(particle)
                this.particles.splice(index, 1)
                this.world.removeBody(particle)
            }
        }
        this.particleGrafic.endFill()
    }

    isInBounds(particle) {
        const x = particle.interpolatedPosition[0]
        const y = particle.interpolatedPosition[1]
        return x >= -this.canvas.width/2 && x <= this.canvas.width/2 && y >= -this.canvas.height/2 && y <= this.canvas.height/2
    }

    drawParticle(particle) {
        const x = particle.interpolatedPosition[0]
        const y = particle.interpolatedPosition[1]
        this.particleGrafic.drawCircle(x, y, 2)
    }

    findContacts() {
        for (let i = 0; i < this.world.narrowphase.contactEquations.length; i++) {
            let eq = this.world.narrowphase.contactEquations[i]
            let bodyAPosition = eq.bodyA.position
            let contactPointA = eq.contactPointA

            let contactX = bodyAPosition[0] + contactPointA[0]
            let contactY = bodyAPosition[1] + contactPointA[1]

            this.spawn(contactX, contactY)
        }
    }

    spawn(x, y) {
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
        pShape.collisionMask = BRUSH

        pBody.addShape(pShape)
        this.world.addBody(pBody)

        this.particles.push(pBody)

        if (this.particles.length > this.maxParticles) {
            this.world.removeBody(this.particles.shift())
        }
    }

}