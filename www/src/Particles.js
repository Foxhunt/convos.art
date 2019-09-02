import { Body, Particle, vec2 } from 'p2'
import { ParticleContainer, Graphics, Sprite, SCALE_MODES } from "pixi.js"

import { BRUSH, PARTICLES } from './CollisionGroups'

export default class Particles {
    constructor(canvas) {
        this.canvas = canvas
        this.world = canvas.world
        this.particles = []
        this.particleColor = "#000000"
        this.maxParticles = 1000
        this.maxAge = 5000
        this.enabled = true

        this.pointerPosition = null

        this.particleGraphic = new Graphics()
            .beginFill(parseInt(this.particleColor.replace(/^#/, ''), 16), 1)
            .drawCircle(0, 0, 3)
        
        this.particleTexture = this.canvas.app.renderer.generateTexture(this.particleGraphic, SCALE_MODES.NEAREST)

        this.particleContainer = new ParticleContainer(this.maxParticles, {alpha:true})
        this.canvas.app.stage.addChild(this.particleContainer)
    }

    set ParticleColor(color){
        this.particleColor = color
        this.particleGraphic
            .clear()
            .beginFill(parseInt(this.particleColor.replace(/^#/, ''), 16), 1)
            .drawCircle(0, 0, 3)

        this.particleTexture.baseTexture = this.canvas.app.renderer.generateTexture(this.particleGraphic, SCALE_MODES.NEAREST)
    }

    render() {
        this.pointerPosition && this.applyForce(this.pointerPosition)
        this.enabled && this.findContacts()
        for (const particle of this.particles) {
            if (this.isInBounds(particle)) {
                this.drawParticle(particle)
            } 

            if (Date.now() - particle.spawnTime > this.maxAge) {
                const index = this.particles.indexOf(particle)
                this.particles.splice(index, 1)
                this.world.removeBody(particle)
                this.particleContainer.removeChild(particle.sprite)
                particle.sprite.destroy()
            }
        }
    }

    applyForce(position){
        this.particles.forEach(particle => {
            const direction = []
            vec2.sub(direction, position, particle.position)
            vec2.normalize(direction, direction)

            const impulse = 300

            vec2.mul(direction, direction, [impulse, impulse])

            particle.applyImpulse(direction)
        })
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
        const pShape = new Particle({ radius: 3 })
        const pBody = new Body({
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
        pBody.spawnTime = Date.now()

        this.particles.push(pBody)
        this.particleContainer.addChild(particleSprite)

        if (this.particles.length > this.maxParticles) {
            const particle = this.particles.shift()
            this.world.removeBody(particle)
            this.particleContainer.removeChild(particle.sprite)
            particle.sprite.destroy()
        }
    }

}