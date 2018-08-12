import p2 from 'p2'

import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Particles {
    constructor(world) {
        this.world = world
        this.particles = []
        this.particleColor = "#ff00aa"
        this.maxParticles = 100
    }

    draw(ctx) {
        for (let particle of this.particles) {
            ctx.beginPath()
            let x = particle.interpolatedPosition[0]
            let y = particle.interpolatedPosition[1]
            ctx.save()
            ctx.translate(x, y)
            ctx.arc(0, 0, 2, 0, 2 * Math.PI)
            ctx.fillStyle = this.particleColor
            ctx.fill()
            ctx.restore()
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
        pShape.collisionMask = PLANES | BRUSH

        pBody.addShape(pShape)
        this.world.addBody(pBody)

        this.particles.push(pBody)

        if (this.particles.length > this.maxParticles) {
            this.world.removeBody(this.particles.shift())
        }
    }

}