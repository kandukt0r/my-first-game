'use strict'

//variables (переменные)---------------------------------------------
const $gamersLinesColor = document.querySelectorAll('.gamers > li')
const $gamersLinesColorVote = document.querySelectorAll('.color')
const $fillButton = document.querySelector('.fill')
const $inputBlock = document.querySelectorAll('.players > li > input')
const $clearButton = document.querySelector('.clear')
const $ball = document.querySelector('.ball')
const $startButton = document.querySelector('.start')
const $nextPlayerButton = document.querySelector('.next-player')
const $gate = document.querySelector('.gates')
const $leftAngle = document.querySelector('.left-angle')
const $rightAngle = document.querySelector('.right-angle')
const $popUp = document.querySelector('.pop_up_container')
const $closePopUp = document.querySelector('.pop_up_cross')
const $prize = document.querySelector('.prize')
const $goalScored = document.querySelector('.goal_container')
const $closeGoalScore = document.querySelector('.goal_button')

let gameStarted // button 'startButton' not pressed
let formReady // button 'fillButton' not pressed
let formCleared = true // form completed
let tooltip // tooltip not show
let pass // move not passed
let enteredNames = [] // entered names in input for color bars
let turn // need for pass move
let goal
let goalInTheTopNine

//players data (данные игроков)--------------------------------------
const firstUser = {
	name: '',
	count: 100,
}
const secondUser = {
	name: '',
	count: 100,
}
const thirdUser = {
	name: '',
	count: 100,
}
const fourthUser = {
	name: '',
	count: 100,
}
const fifthUser = {
	name: '',
	count: 100,
}
const dataUsers = [firstUser, secondUser, thirdUser, fourthUser, fifthUser]

// players data (данные игроков)-------------------------------------
// variables (переменные)--------------------------------------------
// tooltip (подсказка)-----------------------------------------------
document.addEventListener('mouseover', function (event) {
	if (tooltip) return
	let target = event.target.closest('[data-tooltip]')
	if (!target) return
	tooltip = showTooltip(target, target.dataset.tooltip)
})

function showTooltip(elem, text) {
	if (elem.classList.contains('ball')) {
		if (gameStarted) return
	}
	if (elem.classList.contains('fill')) {
		if (formReady) return
	}
	if (elem.classList.contains('start')) {
		if (!formCleared) return
	}
	if (elem.classList.contains('next-player')) {
		if (pass) return
	}
	const tooltipElem = document.createElement('div')
	tooltipElem.innerHTML = text
	tooltipElem.className = 'tooltip'
	document.body.append(tooltipElem)

	const coords = elem.getBoundingClientRect()
	const left = coords.left
	let top = coords.top + elem.offsetHeight + 5
	if (top + 5 + tooltipElem.offsetHeight > window.innerHeight) {
		top = coords.top - tooltipElem.offsetHeight - 5
	}

	tooltipElem.style.top = top + 'px'
	tooltipElem.style.left = left + 'px'

	return tooltipElem
}

document.addEventListener('mouseout', function () {
	if (tooltip) {
		tooltip.remove()
		tooltip = false
	}
})
// tooltip (подсказка)-----------------------------------------------

// pop up (всплывающее окно)-----------------------------------------
delay(1000).then(() => $popUp.classList.add('active'))
document.addEventListener('click', function (e) {
	if (e.target.closest('.pop_up_body')) return
	$popUp.classList.remove('active')
})

$closePopUp.addEventListener('click', function () {
	$popUp.classList.remove('active')
})
// pop up (всплывающее окно)-----------------------------------------

// players' colored stripes (покраска полосок)-----------------------
for (let gamer of $gamersLinesColor) {
	gamer.style.background = gamer.dataset.color
}
for (let i = 0; i < $gamersLinesColorVote.length; i++) {
	$gamersLinesColorVote[i].style.background = $gamersLinesColor[i].style.background
}
// players' colored stripes (покраска полосок)-----------------------

// (заполнить полоски введенными никами)-----------------------------
$inputBlock.forEach(input => input.addEventListener('keyup', function () {
	// first symbol shouldn't be a space
	if (this.value[0] === ' ') {
		this.value = this.value.replace(/\s+/gi, '')
	}
}))

$fillButton.addEventListener('click', onClickFillButton)

function onClickFillButton() {
	const arrayInputs = []
	$inputBlock.forEach(item => arrayInputs.push(item.value))
	if (arrayInputs.every(checkInputForEmptyString)) return
	for (let i = 0; i < $inputBlock.length; i++) {
		enteredNames.push($inputBlock[i].value)
		$inputBlock[i].setAttribute('disabled', 'disabled')
		dataUsers[i].name = $inputBlock[i].value
	}
	addNamesInLines(enteredNames)
	formReady = true
	formCleared = false
	disableButton(this)
}

function addNamesInLines(listNames) {

	for (let i = 0; i < $gamersLinesColor.length; i++) {
		if (!listNames[i]) continue
		$gamersLinesColor[i].innerHTML = listNames[i]
	}
}

function checkInputForEmptyString(elem) {
	return elem == ''
}

function disableButton(elem) {
	elem.disabled = true
	elem.style.cursor = 'no-drop'
	$inputBlock.forEach(input => input.style.cursor = 'no-drop')
}

function unlockButton(elem, form) {
	elem.disabled = false
	elem.style.cursor = 'pointer'
	form.forEach(input => input.style.cursor = 'text')
}
// event fill button (заполнить полоски введенными никами)-----------

// event clearFill and lines button (всё очистить)-------------------
$clearButton.addEventListener('click', clearLines)

function clearLines() {
	if (gameStarted) return
	enteredNames = []
	$gamersLinesColor.forEach(line => line.innerHTML = '')
	$inputBlock.forEach(item => {
		item.removeAttribute('disabled')
		item.value = ''
	})
	formReady = false
	formCleared = true
	unlockButton($fillButton, $inputBlock)
}
// event clearFill and lines button (всё очистить)-------------------

// event click "startButton" (кнопка "начать игру")------------------
$startButton.addEventListener('click', function start() {
	if (!formReady) return
	animate({
		duration: 2000,
		timing: bounceEaseOut,
		draw: function (progress) {
			$ball.style.top = progress * 90 + '%';
		}
	})

	disableButton(this)
	disableButton($clearButton)

	$startButton.removeEventListener('click', start)
	gameStarted = true
	for (let i = 0; i < dataUsers.length; i++) {
		if (dataUsers[i].name) {
			$gamersLinesColor[i].classList.add('highlite')
			turn = i + 1
			if (turn === 5) turn = 0
			break
		}
	}
});

function makeEaseOut(timing) {
	return function (timeFraction) {
		return 1 - timing(1 - timeFraction);
	}
}

function bounce(timeFraction) {
	for (let a = 0, b = 1; 1; a += b, b /= 2) {
		if (timeFraction >= (7 - 4 * a) / 11) {
			return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
		}
	}
}

let bounceEaseOut = makeEaseOut(bounce);

function animate(options) {
	const start = performance.now();
	requestAnimationFrame(function animate(time) {
		let timeFraction = (time - start) / options.duration;
		if (timeFraction > 1) timeFraction = 1;
		let progress = options.timing(timeFraction)
		options.draw(progress);
		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}
// event click "startButton" (кнопка "начать игру")------------------

// random shot in gates (рандомный удар по воротам)------------------
function randomCoordsTop(min, max) {
	return min + Math.random() * (max - min);
}
function randomCoordsLeft(min, max) {
	return min + Math.random() * (max - min)
}

$ball.addEventListener('click', ballFly)

function ballFly() {
	if (!gameStarted) return
	if (this.style.top !== '90%') return
	this.classList.add('ballfly')
	this.style.top = randomCoordsTop(15, 55) + '%'
	this.style.left = randomCoordsLeft(25, 75) + '%'
	pass = true
	delay(650).then(() => checkCoordsForGoal($ball, $gate, $leftAngle, $rightAngle))
}

function showModalGoal(goal, goalInTheTopNine) {
	if (goal) {
		$goalScored.classList.add('goal-scored')
		return
	}
	if (goalInTheTopNine) {

	}
}
$closeGoalScore.addEventListener('click', function () {
	$goalScored.classList.remove('goal-scored')
	const $ballFlyInModal = $goalScored.querySelector('.goal_ball_animation')
	$ballFlyInModal.classList.remove('goal_ball_animation_ballfly')
})

function checkCoordsForGoal(ball, gate, leftAngle, rightAngle) {
	const cBall = ball.getBoundingClientRect()
	const cGate = gate.getBoundingClientRect()
	const cLeftAngle = leftAngle.getBoundingClientRect()
	const cRightAngle = rightAngle.getBoundingClientRect()
	const coordsPrize = $prize.getBoundingClientRect()

	if (cBall.left > cGate.left && cBall.top > cGate.top
		&& (cBall.left + ball.offsetWidth) < (cGate.left + gate.offsetWidth)
		&& (cBall.top + ball.offsetHeight) < (cGate.top + gate.offsetHeight)) {
		if (cBall.left > cLeftAngle.left && cBall.top > cLeftAngle.top
			&& ((cBall.left + ball.offsetWidth) < (cLeftAngle.left + leftAngle.offsetWidth))
			&& ((cBall.top + ball.offsetHeight) < (cLeftAngle.top + leftAngle.offsetHeight))) {
			goalInTheTopNine = true
			for (let i = 0; i < dataUsers.length; i++) {
				if ($gamersLinesColor[i].classList.contains('highlite')) {
					dataUsers[i].count += 40
					$gamersLinesColor[i].style.width = dataUsers[i].count + '%'
					delay(1000).then(() => {
						const coordsUserLine = $gamersLinesColor[i].getBoundingClientRect()
						if (coordsUserLine.left + $gamersLinesColor[i].offsetWidth >= coordsPrize.left) {
							showPrize(dataUsers[i].name)
						}
					})
				}
			}
			console.log('Левая девятка')
			goalInTheTopNine = false
		}
		else if (cBall.left > cRightAngle.left && cBall.top > cRightAngle.top
			&& ((cBall.left + ball.offsetWidth) < (cRightAngle.left + rightAngle.offsetWidth))
			&& ((cBall.top + ball.offsetHeight) < (cRightAngle.top + rightAngle.offsetHeight))) {
			goalInTheTopNine = true
			for (let i = 0; i < dataUsers.length; i++) {
				if ($gamersLinesColor[i].classList.contains('highlite')) {
					dataUsers[i].count += 40
					$gamersLinesColor[i].style.width = dataUsers[i].count + '%'
					delay(1000).then(() => {
						const coordsUserLine = $gamersLinesColor[i].getBoundingClientRect()
						if (coordsUserLine.left + $gamersLinesColor[i].offsetWidth >= coordsPrize.left) {
							showPrize(dataUsers[i].name)
						}
					})
				}
			}
			console.log('Правая девятка')
			goalInTheTopNine = false
		}
		else {
			goal = true
			for (let i = 0; i < dataUsers.length; i++) {
				if ($gamersLinesColor[i].classList.contains('highlite')) {
					dataUsers[i].count += 20
					$gamersLinesColor[i].style.width = dataUsers[i].count + '%'
					delay(1000).then(() => {
						const coordsUserLine = $gamersLinesColor[i].getBoundingClientRect()
						if (coordsUserLine.left + $gamersLinesColor[i].offsetWidth >= coordsPrize.left) {
							showPrize(dataUsers[i].name)
						}
					})
				}
			}
			showModalGoal(goal, goalInTheTopNine)
			goal = false
		}
	}
}

function showPrize(winer) {
	alert(`${winer} win`)
}
// random shot in gates (рандомный удар по воротам)------------------

// pass the move (передать ход)--------------------------------------
$nextPlayerButton.addEventListener('click', pressPassMove)

function pressPassMove() {
	delay(400).then(() => passMove())
}

function passMove() {
	if (!pass) return
	$ball.style.left = 50 + '%'
	$ball.classList.remove('ballfly')
	pass = false
	putBallBack()
	highliteNextPlayer($gamersLinesColor)
}

function putBallBack() {
	animate({
		duration: 2000,
		timing: bounceEaseOut,
		draw: function (progress) {
			$ball.style.top = progress * 90 + '%';
		}
	})
}

async function delay(ms) {
	await new Promise(resolve => setTimeout(resolve, ms))
}

// give highlite for next player (передать подсветку)----------------

function highliteNextPlayer(elem) {
	elem.forEach(line => line.classList.remove('highlite'))
	for (let i = turn; i < dataUsers.length; i++) {
		if (dataUsers[i].name) {
			elem[i].classList.add('highlite')
			turn = i + 1
			if (turn === 5) turn = 0
			break
		} else if (!dataUsers[i].name && i === 4) {
			i = -1
		}
	}
}

// give highlite for next player (передать подсветку)----------------
// pass the move (передать ход)--------------------------------------

//animation firework-------------------------------------------------
var gl = c.getContext('webgl', { preserveDrawingBuffer: true })
	, w = c.width = window.innerWidth
	, h = c.height = window.innerHeight

	, webgl = {}
	, opts = {
		projectileAlpha: .8,
		projectileLineWidth: 1.3,
		fireworkAngleSpan: .5,
		baseFireworkVel: 3,
		addedFireworkVel: 3,
		gravity: .03,
		lowVelBoundary: -.2,
		xFriction: .995,
		baseShardVel: 1,
		addedShardVel: .2,
		fireworks: 1000,
		baseShardsParFirework: 10,
		addedShardsParFirework: 10,
		shardFireworkVelMultiplier: .3,
		initHueMultiplier: 1 / 360,
		runHueAdder: .1 / 360
	}

webgl.vertexShaderSource = `
uniform int u_mode;
uniform vec2 u_res;
attribute vec4 a_data;
varying vec4 v_color;

vec3 h2rgb( float h ){
	return clamp( abs( mod( h * 6. + vec3( 0, 4, 2 ), 6. ) - 3. ) -1., 0., 1. );
}
void clear(){
	gl_Position = vec4( a_data.xy, 0, 1 );
	v_color = vec4( 0, 0, 0, a_data.w );
}
void draw(){
	gl_Position = vec4( vec2( 1, -1 ) * ( ( a_data.xy / u_res ) * 2. - 1. ), 0, 1 );
	v_color = vec4( h2rgb( a_data.z ), a_data.w );
}
void main(){
	if( u_mode == 0 )
		draw();
	else
		clear();
}
`;
webgl.fragmentShaderSource = `
precision mediump float;
varying vec4 v_color;

void main(){
	gl_FragColor = v_color;
}
`;

webgl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(webgl.vertexShader, webgl.vertexShaderSource);
gl.compileShader(webgl.vertexShader);

webgl.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(webgl.fragmentShader, webgl.fragmentShaderSource);
gl.compileShader(webgl.fragmentShader);

webgl.shaderProgram = gl.createProgram();
gl.attachShader(webgl.shaderProgram, webgl.vertexShader);
gl.attachShader(webgl.shaderProgram, webgl.fragmentShader);

gl.linkProgram(webgl.shaderProgram);
gl.useProgram(webgl.shaderProgram);

webgl.dataAttribLoc = gl.getAttribLocation(webgl.shaderProgram, 'a_data');
webgl.dataBuffer = gl.createBuffer();

gl.enableVertexAttribArray(webgl.dataAttribLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, webgl.dataBuffer);
gl.vertexAttribPointer(webgl.dataAttribLoc, 4, gl.FLOAT, false, 0, 0);

webgl.resUniformLoc = gl.getUniformLocation(webgl.shaderProgram, 'u_res');
webgl.modeUniformLoc = gl.getUniformLocation(webgl.shaderProgram, 'u_mode');

gl.viewport(0, 0, w, h);
gl.uniform2f(webgl.resUniformLoc, w, h);

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);

gl.lineWidth(opts.projectileLineWidth);

webgl.data = [];

webgl.clear = function () {

	gl.uniform1i(webgl.modeUniformLoc, 1);
	var a = .1;
	webgl.data = [
		-1, -1, 0, a,
		1, -1, 0, a,
		-1, 1, 0, a,
		-1, 1, 0, a,
		1, -1, 0, a,
		1, 1, 0, a
	];
	webgl.draw(gl.TRIANGLES);
	gl.uniform1i(webgl.modeUniformLoc, 0);
	webgl.data.length = 0;
}
webgl.draw = function (glType) {

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(webgl.data), gl.STATIC_DRAW);
	gl.drawArrays(glType, 0, webgl.data.length / 4);
}

var fireworks = []
	, tick = 0
	, sins = []
	, coss = []
	, maxShardsParFirework = opts.baseShardsParFirework + opts.addedShardsParFirework
	, tau = 6.283185307179586476925286766559;

for (var i = 0; i < maxShardsParFirework; ++i) {
	sins[i] = Math.sin(tau * i / maxShardsParFirework);
	coss[i] = Math.cos(tau * i / maxShardsParFirework);
}

function Firework() {
	this.reset();
	this.shards = [];
	for (var i = 0; i < maxShardsParFirework; ++i)
		this.shards.push(new Shard(this));
}
Firework.prototype.reset = function () {

	var angle = -Math.PI / 2 + (Math.random() - .5) * opts.fireworkAngleSpan
		, vel = opts.baseFireworkVel + opts.addedFireworkVel * Math.random();

	this.mode = 0;
	this.vx = vel * Math.cos(angle);
	this.vy = vel * Math.sin(angle);

	this.x = Math.random() * w;
	this.y = h;

	this.hue = tick * opts.initHueMultiplier;

}
Firework.prototype.step = function () {

	if (this.mode === 0) {

		var ph = this.hue
			, px = this.x
			, py = this.y;

		this.hue += opts.runHueAdder;

		this.x += this.vx *= opts.xFriction;
		this.y += this.vy += opts.gravity;

		webgl.data.push(
			px, py, ph, opts.projectileAlpha * .2,
			this.x, this.y, this.hue, opts.projectileAlpha * .2);

		if (this.vy >= opts.lowVelBoundary) {
			this.mode = 1;

			this.shardAmount = opts.baseShardsParFirework + opts.addedShardsParFirework * Math.random() | 0;

			var baseAngle = Math.random() * tau
				, x = Math.cos(baseAngle)
				, y = Math.sin(baseAngle)
				, sin = sins[this.shardAmount]
				, cos = coss[this.shardAmount];

			for (var i = 0; i < this.shardAmount; ++i) {

				var vel = opts.baseShardVel + opts.addedShardVel * Math.random();
				this.shards[i].reset(x * vel, y * vel)
				var X = x;
				x = x * cos - y * sin;
				y = y * cos + X * sin;
			}
		}

	} else if (this.mode === 1) {

		this.ph = this.hue
		this.hue += opts.runHueAdder;

		var allDead = true;
		for (var i = 0; i < this.shardAmount; ++i) {
			var shard = this.shards[i];
			if (!shard.dead) {
				shard.step();
				allDead = false;
			}
		}

		if (allDead)
			this.reset();
	}

}
function Shard(parent) {
	this.parent = parent;
}
Shard.prototype.reset = function (vx, vy) {
	this.x = this.parent.x;
	this.y = this.parent.y;
	this.vx = this.parent.vx * opts.shardFireworkVelMultiplier + vx;
	this.vy = this.parent.vy * opts.shardFireworkVelMultiplier + vy;
	this.starty = this.y;
	this.dead = false;
	this.tick = 1;
}
Shard.prototype.step = function () {

	this.tick += .05;

	var px = this.x
		, py = this.y;

	this.x += this.vx *= opts.xFriction;
	this.y += this.vy += opts.gravity;

	var proportion = 1 - (this.y - this.starty) / (h - this.starty);

	webgl.data.push(
		px, py, this.parent.ph, opts.projectileAlpha / this.tick,
		this.x, this.y, this.parent.hue, opts.projectileAlpha / this.tick);

	if (this.y > h)
		this.dead = true;
}

function anim() {

	window.requestAnimationFrame(anim)

	webgl.clear();

	++tick;

	if (fireworks.length < opts.fireworks)
		fireworks.push(new Firework);

	fireworks.map(function (firework) { firework.step(); });

	webgl.draw(gl.LINES);
}
anim();

window.addEventListener('resize', function () {

	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;

	gl.viewport(0, 0, w, h);
	gl.uniform2f(webgl.resUniformLoc, w, h);
})
window.addEventListener('click', function (e) {
	var firework = new Firework();
	firework.x = e.clientX;
	firework.y = e.clientY;
	firework.vx = 0;
	firework.vy = 0;
	fireworks.push(firework);
});
//animation firework-------------------------------------------------