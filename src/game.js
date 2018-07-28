import io from 'socket.io-client'

import Brush from './Brush'
import World from './world'

export default roomId => new Promise((resolve) => {

	let ownBrush = null
	let ownId = null

	const canvas = document.getElementById("myCanvas")

	const ctx = canvas.getContext("2d")
	ctx.lineWidth = 0.05

	
	const socket = io({ query: { roomId } })
	
	const world = new World(socket, canvas)

	//Den server nach den bereits vorhandenen clients fragen
	//wenn die verbindung aufgebaut wurde.
	//das init event gibt eine callback funktion mit
	//die vom Server an den Client zurück gegeben wird.
	//Und beim client ausgeführt wird.
	socket.on('connect', () => {
		console.log(`connected as ${socket.id}`)

		//get and set client ID
		ownId = socket.id
		ownBrush = new Brush({ id: ownId, own: true, world: world.p2World, socket })

		// Add a box
		world.addOwnBrush(ownBrush)

		//Vom Server die bereits verbundenen clients abrufen
		socket.emit('init', brushes => {
			console.log(brushes.length + " Boxen initialisiert")

			brushes.forEach(
				({
					id, x, y, angle, fillStyle,
					strokeStyle, shapeType, fillImage,
				}) => {
					if (id !== ownId) {
						const brush = new Brush({ id, x, y, angle, world: world.p2World })
						brush.Fill = fillStyle
						brush.Stroke = strokeStyle
						brush.Shape = shapeType
						if(fillImage)
							brush.Image = fillImage
						world.addBrush(brush)
					}
				})
		}) // ende emit init
		resolve(ownBrush)
	}) // ende onConnect

	//Box informationen an server senden
	function toServer() {
		if (ownBrush) {
			socket.emit('toServer', {
				x: ownBrush.body.interpolatedPosition[0],
				y: ownBrush.body.interpolatedPosition[1],
				angle: ownBrush.body.interpolatedAngle,
				velocity: ownBrush.body.velocity,
				angularVelocity: ownBrush.body.angularVelocity
			})
		}
	}

	//Update loop
	setInterval(toServer, 50)

	function render() {
		// Transform the canvas
		ctx.save()
		//ctx.clearRect(0, 0, w, h);

		world.render(ctx)

		// Restore transform
		ctx.restore()
	}


	//world interpolation variablen
	var fixedTimeStep = 1 / 60
	var maxSubSteps = 1
	var lastTimeSeconds
	var deltaTime
	var timeSeconds

	// Animation loop
	function animate(t) {
		requestAnimationFrame(animate)

		timeSeconds = t / 1000
		lastTimeSeconds = lastTimeSeconds || timeSeconds

		deltaTime = timeSeconds - lastTimeSeconds

		// Move physics bodies forward in time
		world.step(fixedTimeStep, deltaTime, maxSubSteps)

		// Render scene
		render()
	}

	requestAnimationFrame(animate)
})
