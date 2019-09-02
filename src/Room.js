import Brush from './Brush'
import Canvas from './Canvas'

export default (roomId, pixiContainer, reduxStore) => new Promise(resolve => {

	let ownBrush = null
	let ownId = null
	const store = reduxStore
	
	//const socket = io({ query: { roomId } })
	
	const canvas = new Canvas(pixiContainer)

	const initOwnBrush = () => {
		//console.log(`connected as ${socket.id}`)
		//get and set client ID
		ownId = "me"
		const fillStyle = store.getState().fillStyle;
		const strokeStyle = store.getState().strokeStyle;
		const Shape = store.getState().shapeType;
		ownBrush = new Brush({
			id: ownId,
			own: true,
			world: canvas.world,
			pixiApp: canvas.app,
			//socket,
			fillStyle,
			strokeStyle,
			Shape
		});
		// Add a box
		canvas.addOwnBrush(ownBrush);
		//Vom Server die bereits verbundenen clients abrufen

		/*
		socket.emit('init', brushes => {
			console.log(brushes.length + " Boxen initialisiert");
			brushes.forEach(({ id, x, y, angle, fillStyle, strokeStyle, shapeType, fillImage, }) => {
				if (id !== ownId) {
					const brush = new Brush({ id, x, y, angle, world: canvas.world, pixiApp: canvas.app });
					brush.Fill = fillStyle;
					brush.Stroke = strokeStyle;
					brush.Shape = shapeType;
					if (fillImage)
						brush.Image = fillImage;
					canvas.addBrush(brush);
				}
			});
		}); // ende emit init
		*/

		subscribeToStore();
		resolve(canvas);
	};
	//Den server nach den bereits vorhandenen clients fragen
	//wenn die verbindung aufgebaut wurde.
	//das init event gibt eine callback funktion mit
	//die vom Server an den Client zurück gegeben wird.
	//Und beim client ausgeführt wird.
	//socket.on('connect', initOwnBrush) // ende onConnect

	initOwnBrush()

	/*
	//Neuen client und seine Box anlegen
	socket.on('new', payload => canvas.newBrush(payload))

	//Box eines Clients löschen der das Spiel verlassen hat
	socket.on('leave', payload => canvas.leaveBrush(payload))

	//Box Informationen vom Server erhalten
	socket.on('toClient', buffer => {
		const data = schemas.toClientSchema.decode(buffer)
		// betroffene box ermitteln
		let box = canvas.brushes.get(data.id)
		//erhaltenen Informationen verarbeiten

		const ownFact = 0.7
		if (box && box.id !== socket.id) {
			box.body.position[0] = data.x * (1 - ownFact) + box.body.position[0] * ownFact
			box.body.position[1] = data.y * (1 - ownFact) + box.body.position[1] * ownFact
			box.body.angle = data.angle * (1 - ownFact) + box.body.angle * ownFact
			box.body.angularVelocity = data.angularVelocity * (1 - ownFact) + box.body.angularVelocity * ownFact
			box.body.velocity = {
				0: (data.velocity[0] * (1 - ownFact) + box.body.velocity[0] * ownFact),
				1: (data.velocity[1] * (1 - ownFact) + box.body.velocity[1] * ownFact)
			}
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
	*/

	//Box informationen an server senden
	function toServer() {
		if (ownBrush) {
			const data = {
				x: ownBrush.body.interpolatedPosition[0],
				y: ownBrush.body.interpolatedPosition[1],
				angle: ownBrush.body.interpolatedAngle,
				velocity: ownBrush.body.velocity,
				angularVelocity: ownBrush.body.angularVelocity
			}
			const buffer = schemas.toServerSchema.encode(data)
			socket.emit('toServer', buffer)
		}
	}

	//Update loop
	//setInterval(toServer, 50)

	function subscribeToStore() {
		store.subscribe(handleStoreChanges)
	}

	function handleStoreChanges() {
		const state = store.getState()

		if(ownBrush.shapeType != state.shapeType) {
			ownBrush.Shape = state.shapeType
		}

		if(ownBrush.strokeStyle != state.strokeStyle) {
			ownBrush.Stroke = state.strokeStyle
		}

		if(ownBrush.fillStyle != state.fillStyle) {
			ownBrush.Fill = state.fillStyle
		}

		if(ownBrush.fillImageSrc != state.fillImage) {
			ownBrush.Image = state.fillImage
		}

		if(canvas.particles.enabled != state.particles) {
			canvas.particles.enabled = state.particles
		}

		if(canvas.particles.particleColor != state.particleColor) {
			canvas.particles.ParticleColor = state.particleColor
		}

		if(canvas.filters != state.filters) {
			canvas.filters = state.filters
		}
	}
})
