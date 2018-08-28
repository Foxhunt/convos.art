import p2 from 'p2'

import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Particles {
    constructor(canvas) {
        this.canvas = canvas
        this.world = canvas.world
        this.particles = []
        this.particleColor = "#ff00aa"
        this.maxParticles = 100
        this.enabled = true
    }

    render(ctx) {
        this.enabled && this.findContacts()
        for (let particle of this.particles) {
            if (this.isInBounds(particle)) {
                this.drawParticle(ctx, particle)
            } else {
                const index = this.particles.indexOf(particle)
                this.particles.splice(index, 1)
                this.world.removeBody(particle)
            }
        }
    }

    isInBounds(particle) {
        const x = particle.interpolatedPosition[0]
        const y = particle.interpolatedPosition[1]
        return x >= -this.canvas.width/2 && x <= this.canvas.width/2 && y >= -this.canvas.height/2 && y <= this.canvas.height/2
    }

    drawParticle(ctx, particle) {
        ctx.beginPath()
        const x = particle.interpolatedPosition[0]
        const y = particle.interpolatedPosition[1]
        ctx.save()
        ctx.translate(x, y)
        ctx.arc(0, 0, 2, 0, 2 * Math.PI)
        ctx.fillStyle = this.particleColor
        ctx.fill()
        ctx.restore()
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