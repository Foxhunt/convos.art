import io from 'socket.io-client'

import Brush from './Brush'
import Canvas from './Canvas'

export default roomId => new Promise((resolve) => {

	let ownBrush = null
	let ownId = null
	
	const socket = io({ query: { roomId } })
	
	const canvas = new Canvas(socket)

	//Den server nach den bereits vorhandenen clients fragen
	//wenn die verbindung aufgebaut wurde.
	//das init event gibt eine callback funktion mit
	//die vom Server an den Client zurück gegeben wird.
	//Und beim client ausgeführt wird.
	socket.on('connect', () => {
		console.log(`connected as ${socket.id}`)

		//get and set client ID
		ownId = socket.id
		ownBrush = new Brush({ id: ownId, own: true, world: canvas.world, socket })

		// Add a box
		canvas.addOwnBrush(ownBrush)

		//Vom Server die bereits verbundenen clients abrufen
		socket.emit('init', brushes => {
			console.log(brushes.length + " Boxen initialisiert")

			brushes.forEach(
				({
					id, x, y, angle, fillStyle,
					strokeStyle, shapeType, fillImage,
				}) => {
					if (id !== ownId) {
						const brush = new Brush({ id, x, y, angle, world: canvas.world })
						brush.Fill = fillStyle
						brush.Stroke = strokeStyle
						brush.Shape = shapeType
						if(fillImage)
							brush.Image = fillImage
						canvas.addBrush(brush)
					}
				})
		}) // ende emit init
		resolve(ownBrush)
	}) // ende onConnect

	
	//Neuen client und seine Box anlegen
	socket.on('new', payload => canvas.newBrush(payload))

	//Box eines Clients löschen der das Spiel verlassen hat
	socket.on('leave', payload => canvas.leaveBrush(payload))

	//Box Informationen vom Server erhalten
	socket.on('toClient', ({ id, x, y, angle, velocity, angularVelocity }) => {
		// betroffene box ermitteln
		let box = canvas.brushes.get(id)
		//erhaltenen Informationen verarbeiten
		if (box) {
			box.body.position[0] = x
			box.body.position[1] = y
			box.body.angle = angle
			box.body.velocity = velocity
			box.body.angularVelocity = angularVelocity
		}
	})

	socket.on('setFillStyle', ({ id, color }) => {
		let box = canvas.brushes.get(id)
		if (box) {
			box.Fill = color
		}
	})

	socket.on('setStrokeStyle', ({ id, color }) => {
		let box = canvas.brushes.get(id)
		if (box) {
			box.Stroke = color
		}
	})

	socket.on('setShapeType', ({ id, shapeType }) => {
		let box = canvas.brushes.get(id)
		if (box) {
			box.Shape = shapeType
		}
	})

	socket.on('setFillImage', ({ id, imageSrc }) => {
		let box = canvas.brushes.get(id)
		if (box) {
			box.Image = imageSrc
		}
	})

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
})
