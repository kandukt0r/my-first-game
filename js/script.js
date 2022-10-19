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
		const $ballFlyInModal = $goalScored.querySelector('.goal_ball_animation')
		delay(500).then(() => $ballFlyInModal.classList.add('goal_ball_animation_ballfly'))
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
