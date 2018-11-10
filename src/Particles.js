import p2 from 'p2'
import { particles, Graphics, Sprite } from "pixi.js"
const { ParticleContainer } = particles

import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default class Particles {
    constructor(canvas) {
        this.canvas = canvas
        this.world = canvas.world
        this.particles = []
        this.particleColor = "#ff00aa"
        this.maxParticles = 100
        this.enabled = true

        this.particleTexture = this.canvas.app.renderer.generateTexture(
            new Graphics()
            .beginFill(parseInt(this.particleColor.replace(/^#/, ''), 16), 1)
            .drawCircle(0, 0, 2))

        this.particleContainer = new ParticleContainer(this.maxParticles, {alpha:true})
        this.canvas.app.stage.addChild(this.particleContainer)
    }

    set ParticleColor(color){
        this.particleColor = color
        this.particleTexture = this.canvas.app.renderer.generateTexture(
            new Graphics()
            .beginFill(parseInt(this.particleColor.replace(/^#/, ''), 16), 1)
            .drawCircle(0, 0, 2))
    }

    render() {
        this.enabled && this.findContacts()
        for (let particle of this.particles) {
            if (this.isInBounds(particle)) {
                this.drawParticle(particle)
            } else {
                const index = this.particles.indexOf(particle)
                this.particles.splice(index, 1)
                this.world.removeBody(particle)
                this.particleContainer.removeChild(particle.sprite)
            }
        }
    }

    isInBounds(particle) {
        const x = particle.interpolatedPosition[0]
        const y = particle.interpolatedPosition[1]
        return x >= -this.canvas.width/2 && x <= this.canvas.width/2 && y >= -this.canvas.height/2 && y <= this.canvas.height/2
    }

    drawParticle(particle) {
        particle.sprite.x = particle.interpolatedPosition[0]
        particle.sprite.y = particle.interpolatedPosition[1]
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
        const rng = 2 * Math.PI * Math.random()
        const pShape = new p2.Particle({ radius: 3 })
        const pBody = new p2.Body({
            mass: 50,
            position: [x, y],
            velocity: [
                120 * Math.sin(rng),
                120 * Math.cos(rng)
            ]
        })

        pShape.collisionGroup = PARTICLES
        pShape.collisionMask = BRUSH

        pBody.addShape(pShape)
        this.world.addBody(pBody)

        const particleSprite = new Sprite(this.particleTexture)
        particleSprite.x = x
        particleSprite.y = y

        pBody.sprite = particleSprite

        this.particles.push(pBody)
        this.particleContainer.addChild(particleSprite)

        if (this.particles.length > this.maxParticles) {
            const paarticle = this.particles.shift()
            this.world.removeBody(paarticle)
            this.particleContainer.removeChild(paarticle.sprite)
        }
    }

}