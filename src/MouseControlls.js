import p2 from 'p2'

export default class MouseControlls {
    constructor(canvas) {
        this.world = canvas.world
        this.width = canvas.width
        this.height = canvas.height
        this.canvas = canvas.canvas

        this.ownBrush = null

        this.mouseConstraint = null
        this.mouseBody = null

        this.addMouseControlls()
    }

    addMouseControlls() {
        // Create a body for the cursor
        this.mouseBody = new p2.Body()
        this.world.addBody(this.mouseBody)

        //Get mouse Position and create a mouse object
        this.canvas.addEventListener('mousedown', event => this.coursorDown(event))
        this.canvas.addEventListener('touchstart', event => this.coursorDown(event))

        // Sync the mouse body to be at the cursor position
        this.canvas.addEventListener('mousemove', event => this.coursorMove(event))
        this.canvas.addEventListener('touchmove', event => this.coursorMove(event))

        // Remove the mouse constraint on mouse up
        this.canvas.addEventListener('mouseup', event => this.coursorUp(event))
        this.canvas.addEventListener('touchend', event => this.coursorUp(event))

        // Beim verlassen der Maus wird die Box an Position gehalten
        this.canvas.addEventListener('mouseleave', event => this.mouseLeave(event))
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
}