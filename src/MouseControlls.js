import p2 from 'p2'

export default class MouseControlls {
    constructor(canvas) {
        this.world = canvas.world
        this.width = canvas.width
        this.height = canvas.height
        this.pixiContainer = canvas.pixiContainer

        this.particles = canvas.particles

        this.ownBrush = null

        this.mouseConstraint = null
        this.mouseBody = null

        this.down = false

        this.addMouseControlls()
    }

    addMouseControlls() {
        // Create a body for the cursor
        this.mouseBody = new p2.Body()
        this.world.addBody(this.mouseBody)

        //Get mouse Position and create a mouse object
        this.pixiContainer.addEventListener('mousedown', event => this.coursorDown(event))
        this.pixiContainer.addEventListener('touchstart', event => this.coursorDown(event))

        // Sync the mouse body to be at the cursor position
        this.pixiContainer.addEventListener('mousemove', event => this.coursorMove(event))
        this.pixiContainer.addEventListener('touchmove', event => this.coursorMove(event))

        // Remove the mouse constraint on mouse up
        this.pixiContainer.addEventListener('mouseup', event => this.coursorUp(event))
        this.pixiContainer.addEventListener('touchend', event => this.coursorUp(event))

        // Beim verlassen der Maus wird die Box an Position gehalten
        this.pixiContainer.addEventListener('mouseleave', event => this.mouseLeave(event))
    }

    //event handler für User Interaktion
    coursorDown(event) {
        this.down = true
        // Convert the canvas coordinate to physics coordinates
        const position = this.getPhysicsCoord(event)

        // Check if the cursor is inside the box
        const hitBodies = this.world.hitTest(position, [this.ownBrush.body])

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
        } else {
            this.particles.pointerPosition = position
        }
    }

    coursorMove(event) {
        const position = this.getPhysicsCoord(event)
        this.mouseBody.position[0] = position[0]
        this.mouseBody.position[1] = position[1]

        if(this.mouseConstraint || !this.down) {
            this.particles.pointerPosition = null
        } else {
            this.particles.pointerPosition = position
        }
    }

    coursorUp() {
        this.down = false
        this.world.removeConstraint(this.mouseConstraint)
        this.mouseConstraint = null
        this.particles.pointerPosition = null
    }

    mouseLeave() {
        this.down = false
        this.world.removeConstraint(this.mouseConstraint)
        this.mouseConstraint = null
        this.particles.pointerPosition = null
    }

    // Convert a canvas coordiante to physics coordinate
    getPhysicsCoord(Event) {
        Event.preventDefault()
        const rect = this.pixiContainer.getBoundingClientRect()

        let x;
        let y;

        if (Event.touches) {
            x = Event.touches[0].clientX - rect.left
            y = Event.touches[0].clientY - rect.top
        } else {
            x = Event.clientX - rect.left
            y = Event.clientY - rect.top
        }
        x = (x - rect.width / 2) * (this.width / rect.width)
        y = (y - rect.height / 2) * -(this.height / rect.height)
        return [x, y]
    }
}