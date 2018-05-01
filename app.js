const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

var boxes = new Map();

//Socket konfg
//###########
io.set('heartbeat interval', 2000);
io.set('heartbeat timeout', 10000);

//client verbindet sich
io.on('connection', socket => {

	//id zuweisen
	let id = socket.id;

	let box = new Box(id);

	//neuen client anlegen
	boxes.set(id, box);

	//über client benachrichtigen
	console.log(`Client ${id} connected. (${boxes.size})`);

	//clients über neuen client informieren
	socket.broadcast.emit('new', {
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
		socket.broadcast.emit('toClient', {
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
		socket.broadcast.emit('leave', {
			id: id
		});
		console.log(`Client ${id} disconnected. (${boxes.size})`);
	});
});

//Box constructor Server Version
function Box(id, x, y, angle, velocity) {
	this.id = id;
	this.x = x || 0;
	this.y = y || 5;
	this.angle = angle || 0;
	this.velocity = velocity || 0;
}

nextApp.prepare().then(() => {
	app.get('*', (req, res) => {
		return nextHandler(req, res)
	})

	server.listen(3000, err => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	})
})
