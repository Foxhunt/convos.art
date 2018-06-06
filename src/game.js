import io from 'socket.io-client'
import p2 from 'p2'

import Brush from './Brush'
import { BRUSH, PLANES, PARTICLES } from './CollisionGroups'

export default roomId => new Promise((resolve, reject) =>{
	var canvas, ctx, w, h, ownBrush, world, mouseBody, planeBody, roofBody, leftWallBody, rightWallBody, mouseConstraint, ownId,
				boxes = new Map,
				debug = false;

				const particles = []


				const socket = io({ query: { roomId } })

				canvas = document.getElementById("myCanvas");
				w = canvas.width;
				h = canvas.height;
		
				ctx = canvas.getContext("2d");
				ctx.lineWidth = 0.05;
		
				// Init p2.js
				world = new p2.World({
					gravity: [0, -60]
				});
				
				//window.addEventListener('deviceorientation', event => handleOrientation(event));
		
				// Add a plane
				planeBody = new p2.Body();
				planeBody.addShape(new p2.Plane());
				planeBody.shapes[0].collisionGroup = PLANES
				planeBody.shapes[0].collisionMask = BRUSH

				roofBody = new p2.Body();
				roofBody.addShape(new p2.Plane());
				roofBody.shapes[0].collisionGroup = PLANES
				roofBody.shapes[0].collisionMask = BRUSH
		
				//wand links
				leftWallBody = new p2.Body();
				leftWallBody.addShape(new p2.Plane());
				leftWallBody.shapes[0].collisionGroup = PLANES
				leftWallBody.shapes[0].collisionMask = BRUSH
		
				//wand rechts
				rightWallBody = new p2.Body();
				rightWallBody.addShape(new p2.Plane());
				rightWallBody.shapes[0].collisionGroup = PLANES
				rightWallBody.shapes[0].collisionMask = BRUSH
		
				// planes hinzufügen
				world.addBody(planeBody);
				world.addBody(roofBody);
				world.addBody(rightWallBody);
				world.addBody(leftWallBody);
		
				// positionen und rotationen setzten
				planeBody.position[1] = -h/2;

				roofBody.position[1] = h/2;
				roofBody.angle = Math.PI;
		
				leftWallBody.position[0] = -w/2;
				leftWallBody.angle = -(Math.PI / 2);
		
		
				rightWallBody.position[0] = w/2;
				rightWallBody.angle = Math.PI / 2;
		
		
				// Create a body for the cursor
				mouseBody = new p2.Body()
				world.addBody(mouseBody);
		
				//Get mouse Position and create a mouse object
				canvas.addEventListener('mousedown', coursorDown);
				canvas.addEventListener('touchstart', coursorDown);
				//canvas.addEventListener('pointerdown', coursorDown);
		
				// Sync the mouse body to be at the cursor position
				canvas.addEventListener('mousemove', coursorMove);
				canvas.addEventListener('touchmove', coursorMove);
				//canvas.addEventListener('pointermove', coursorDown);
		
		
				// Remove the mouse constraint on mouse up
				canvas.addEventListener('mouseup', coursorUp);
				canvas.addEventListener('touchend', coursorUp);
				//canvas.addEventListener('pointerup', coursorDown);
		
				// Beim verlassen der Maus wird die Box an Position gehalten
				canvas.addEventListener('mouseleave', mouseLeave);
		
		
				//Neuen client und seine Box anlegen
				socket.on('new', ({id}) => {
					console.log("new! : " + id)
					let box = new Brush({id, world})
					boxes.set(id, box);
				});
		
				//Box eines Clients löschen der das Spiel verlassen hat
				socket.on('leave', ({id}) => {
					// Box löschen
					world.removeBody(boxes.get(id).body);
					boxes.delete(id);
					console.log("left! : " + id);
				});
		
				//Box Informationen vom Server erhalten
				socket.on('toClient', ({id, x, y, angle, velocity, fillStyle, strokeStyle, shapeType}) => {
					// betroffene box ermitteln
					let box = boxes.get(id);
					//erhaltenen Informationen verarbeiten
					if (box) {
						box.body.position[0] = x
						box.body.position[1] = y
						box.body.angle = angle
						box.body.velocity = velocity
						box.fillStyle = fillStyle
						box.strokeStyle = strokeStyle
						box.Shape = shapeType
					}
				});
		
				//Den server nach den bereits vorhandenen clients fragen
				//wenn die verbindung aufgebaut wurde.
				//das init event gibt eine callback funktion mit
				//die vom Server an den Client zurück gegeben wird.
				//Und beim client ausgeführt wird.
				socket.on('connect', () => {

					console.log(`connected as ${socket.id}`)

					//get and set client ID
					ownId = socket.id;
					ownBrush = new Brush({id: ownId, own: true, world});

					// Add a box
					boxes.set(ownId, ownBrush);
		
					//Vom Server die bereits verbundenen clients abrufen
					socket.emit('init', initBoxes => {
		
						console.log(initBoxes.length + " Boxen initialisiert");
		
						initBoxes.forEach(({id, x, y, angle}) => {
							if (id !== ownId) {
								let box = new Brush({id, x, y, angle, world})
								boxes.set(box.id, box)
							}
						});
					}); // ende emit init
					resolve(ownBrush)
				}); // ende onConnect
		
			//event handler für User Interaktion
			function coursorDown(event) {
		
				// Convert the canvas coordinate to physics coordinates
				var position = getPhysicsCoord(event);
		
				// Check if the cursor is inside the box
				var hitBodies = world.hitTest(position, [ownBrush.body]);
		
				if (hitBodies.length) {
		
					// Move the mouse body to the cursor position
					mouseBody.position[0] = position[0];
					mouseBody.position[1] = position[1];
		
					// Create a RevoluteConstraint.
					// This constraint lets the bodies rotate around a common point
					mouseConstraint = new p2.RevoluteConstraint(mouseBody, ownBrush.body, {
						worldPivot: position,
						collideConnected: false
					});
					world.addConstraint(mouseConstraint);
				}
			}
		
			function coursorMove(event) {
				var position = getPhysicsCoord(event);
				mouseBody.position[0] = position[0];
				mouseBody.position[1] = position[1];
			}
		
			function coursorUp(event) {
				world.removeConstraint(mouseConstraint);
				mouseConstraint = null;
			}
		
			function mouseLeave(event) {
				world.removeConstraint(mouseConstraint);
				mouseConstraint = null;
			}
		
			// Convert a canvas coordiante to physics coordinate
			function getPhysicsCoord(Event) {
				Event.preventDefault();
				var rect = canvas.getBoundingClientRect();

				if (Event.touches) {
					var x = Event.touches[0].clientX - rect.left;
					var y = Event.touches[0].clientY - rect.top;
				} else {
					var x = Event.clientX - rect.left;
					var y = Event.clientY - rect.top;
				}
				x = (x - rect.width/2)*(w/rect.width);
				y = (y - rect.height/2)*-(h/rect.height);
				return [x, y];
			}
		
			
		
			//Boden malen
			function drawPlane() {
				var y = planeBody.position[1]
				ctx.moveTo(-w, y)
				ctx.lineTo(w, y)
				ctx.stroke()

				y = roofBody.position[1]
				ctx.moveTo(-w, y)
				ctx.lineTo(w, y)
				ctx.stroke()
			}
		
			//Boden wände
			function drawWalls() {
		
				var x = leftWallBody.position[0]
				ctx.moveTo(x, -h)
				ctx.lineTo(x, h)
				ctx.stroke()
		
				x = rightWallBody.position[0]
				ctx.moveTo(x, -h)
				ctx.lineTo(x, h)
				ctx.stroke()
		
			}

			function findContacts(){
				for(let i = 0; i < world.narrowphase.contactEquations.length; i++){
					let eq = world.narrowphase.contactEquations[i]
					let bodyAPosition = eq.bodyA.position
					let contactPointA = eq.contactPointA

					let contactX = bodyAPosition[0] + contactPointA[0]
					let contactY = bodyAPosition[1] + contactPointA[1]

					spawnParticle(contactX, contactY)
				}
			}

			function spawnParticle(x, y){
				const pShape = new p2.Particle({radius: 3})
				const pBody = new p2.Body({
					mass: 50,
					position: [x, y],
					velocity: [
						140 * Math.cos(Math.PI * Math.random()),
						140 * Math.cos(Math.PI * Math.random())
					]
				})

				pShape.collisionGroup = PARTICLES
				pShape.collisionMask = PLANES | BRUSH

				pBody.addShape(pShape)
				world.addBody(pBody)

				particles.push(pBody)

				if(particles.length > 100){
					world.removeBody(particles.shift())
				}
			}

			function drawParticles(){
				for (let particle of particles){
					ctx.beginPath()
					let x = particle.interpolatedPosition[0]
					let y = particle.interpolatedPosition[1]
					ctx.save()
					ctx.translate(x, y)
					ctx.arc(0, 0, 2, 0, 2*Math.PI)
					ctx.fillStyle = "#ff00aa"
					ctx.fill()
					ctx.restore()
				}
			}

			function rng(number){
				return Math.floor(number * Math.random())
			}
		
			//Render ?! LOL
			function render() {
				// Transform the canvas
				ctx.save()
				//ctx.clearRect(0, 0, w, h);
				ctx.translate(w / 2, h / 2) // Translate to the center
				ctx.scale(1, -1)

				// Draw all bodies
				for (let box of boxes.values()){
					box.render(ctx)
				}
				drawPlane()
				drawWalls()
				findContacts()
				drawParticles()
		
				// Restore transform
				ctx.restore()
			}
		
			//LOL duno shit?!
			function normalizeAngle(angle) {
				angle = angle % (2 * Math.PI);
				if (angle < 0) {
					angle += (2 * Math.PI);
				}
				return angle;
			}
		
		
			//world interpolation variablen
			var fixedTimeStep = 1 / 60;
			var maxSubSteps = 1;
			var lastTimeSeconds;
			var deltaTime;
			var timeSeconds;
		
			// Animation loop
			function animate(t) {
				requestAnimationFrame(animate);
		
				timeSeconds = t / 1000;
				lastTimeSeconds = lastTimeSeconds || timeSeconds;
		
				deltaTime = timeSeconds - lastTimeSeconds;
		
				// Move physics bodies forward in time
				world.step(fixedTimeStep, deltaTime, maxSubSteps);
		
				// Render scene
				render();
			}
		
			requestAnimationFrame(animate);
		
			//Box informationen an server senden
			function toServer() {
				if (ownBrush) {
					socket.emit('toServer', {
						x: ownBrush.body.interpolatedPosition[0],
						y: ownBrush.body.interpolatedPosition[1],
						angle: ownBrush.body.interpolatedAngle,
						velocity: ownBrush.body.velocity,
						fillStyle: ownBrush.fillStyle,
						strokeStyle: ownBrush.strokeStyle,
						shapeType: ownBrush.shapeType
					});
				}
			}
		
			//Update loop
			setInterval(toServer, 50);
			
			function handleOrientation(event){
				var x = event.gamma;  // In degree in the range [-180,180]
				var y = event.beta; // In degree in the range [-90,90]
		
				// Because we don't want to have the device upside down
				// We constrain the x value to the range [-90,90]
				if (x >  90) { x =  90};
				if (x < -90) { x = -90};
		
				// To make computation easier we shift the range of 
				// x and y to [0,180]
				//x += 90;
				//y += 90;	
				
				world.gravity[0] = x/7
				world.gravity[1] = -y/7
			} 
		

})
