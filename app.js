const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

var rooms = new Map();

//Socket konfg
//###########
io.set('heartbeat interval', 2000);
io.set('heartbeat timeout', 10000);

//client verbindet sich
io.on('connection', socket => {

	const roomId = socket.handshake.query.roomId

	const boxes = getBoxesOfRoom(roomId)

	//id zuweisen
	const id = socket.id;

	const box = new Box(id);

	socket.join(roomId)

	//neuen client anlegen
	boxes.set(id, box);

	//über client benachrichtigen
	console.log(`${id} joined ${roomId}. (${boxes.size})`);

	//clients über neuen client informieren
	socket.broadcast.to(roomId).emit('new', {
		id: id
	});

	//clients beim neuen client initialisieren
	socket.on('init', fn => {
		let boxesArr = [];
		for(let value of boxes.values()){
			boxesArr.push(value);
		}
		fn(boxesArr);
	});

	//Box informationen vom Client erhalten
	socket.on('toServer', data => {
		//suche die passende box und setze x, y und angle
		box.x = data.x;
		box.y = data.y;
		box.angle = data.angle;
		box.velocity = data.velocity;
	});

	//periodischen senden von updates an die  Clients;
	setInterval(toClients, 50);

	//Box Informationen an clients senden
	function toClients() {
		socket.broadcast.to(roomId).emit('toClient', {
			id: box.id,
			x: box.x,
			y: box.y,
			angle: box.angle,
			velocity: box.velocity
		});
	}

	//Clients über das verlassen eines Cleints informieren
	//so dass Sie den client entfernen können (leave event)
	socket.on('disconnect', () => {
		boxes.delete(id);
		socket.broadcast.to(roomId).emit('leave', {
			id: id
		});
		console.log(`Client ${id} disconnected. (${boxes.size})`);
	});
});

function getBoxesOfRoom(roomId){
	if(rooms.has(roomId)){
		return rooms.get(roomId)
	}else{
		const newRoom = new Map()
		rooms.set(roomId, newRoom)
		return newRoom
	}
}

//Box constructor Server Version
function Box(id, x, y, angle, velocity) {
	this.id = id;
	this.x = x || 0;
	this.y = y || 5;
	this.angle = angle || 0;
	this.velocity = velocity || 0;
}

nextApp.prepare().then(() => {

	app.get('/room/:roomId', (req, res) => {
		const queryParams = {roomId: req.params.roomId}
		nextApp.render(req, res, '/room', queryParams)
	})

	app.get('*', (req, res) => {
		return nextHandler(req, res)
	})

	server.listen(3000, err => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	})
})
