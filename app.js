document.addEventListener('DOMContentLoaded', () => {
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score')
    const finalScore = document.querySelector('#final-score')
    const speedDisplay = document.querySelector('#speed')
    const startButton = document.querySelector('#start-button')
    const musicButton = document.querySelector('#music-button')
    const tryAgainButton = document.querySelector('#try-again-button')
    const fasterSpeedButton = document.querySelector('#speed-button-faster')
    const slowerSpeedButton = document.querySelector('#speed-button-slower')
    const gameOverBlock = document.querySelector('.game-over')
    let mainMusic = document.getElementsByTagName("audio")[0]
    let score = 0
    let stepScore
    let random = getRandom()
    let nextRandom = 0
    let timerId
    let isMusicPlay = true
    let speed = 1000
    let currentPosition = 4
    let currentRotation = 0
    let currentFigure = getRandomFigure()
    let isGameOver = false

    startButton.addEventListener('click', startGame)

    function startGame() {
        if (!isGameOver) {
            startButton.innerHTML = timerId ? 'START' : 'PAUSE'
            if (isMusicPlay) playMainMusic()

            if (timerId) {
                clearInterval(timerId)
                timerId = null
            } else {
                drawFigure()
                timerId = setInterval(moveDown, speed)
                nextRandom = getRandom()
                showNextFigure()
            }
        }
    }

    tryAgainButton.addEventListener('click', startNewGame)

    musicButton.addEventListener('click', (mainMusic) => {
        musicButton.innerHTML = isMusicPlay ? getIcon(0x1F508) : getIcon(0x1F50A)
        isMusicPlay = isMusicPlay ? false : true
        if (timerId) playMainMusic()
    })

    fasterSpeedButton.addEventListener('click', () => {
        stepScore = 1
        speed /= 1.6
        changeSpeed()
    })

    slowerSpeedButton.addEventListener('click', () => {
        if (+speedDisplay.innerHTML > 1) {
            stepScore = -1
            speed *= 1.6
            changeSpeed()
        }
    })

    function changeSpeed() {
        speedDisplay.innerHTML = +speedDisplay.innerHTML + stepScore
        clearInterval(timerId)
        if (timerId) timerId = setInterval(moveDown, speed)
    }

    document.addEventListener('keydown', keyControl)

    function keyControl(e) {
        if (timerId) {
            switch (e.keyCode) {
                case 37: 
                    moveLeft()
                    break
                case 38: 
                    rotate()
                    break
                case 39:
                    moveRight()
                    break
                case 40:
                    moveDown()
                    break
            }
        }
    }

    function getRandomFigure() {
        return figures[random][currentRotation]
    }

    function drawFigure() {
        currentFigure.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
            squares[currentPosition + index].style.opacity = '0.8'
        })
    }
    
    function undrawFigure() {
        currentFigure.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
            squares[currentPosition + index].style.opacity = ''
        })
    }

    function moveDown() {
        undrawFigure()
        currentPosition += width
        drawFigure()
        freeze()
    }

    function freeze() {
        if(isSomeTaken(width)) {
            currentFigure.forEach(index => squares[currentPosition + index].classList.add('taken'))
            playSound(sounds.fall)
            addScore()
            createNewFigure()
            gameOver()
        }
    }

    function createNewFigure() {
        random = nextRandom
        nextRandom = getRandom()
        currentFigure = getRandomFigure()
        currentPosition = 4
        drawFigure()
        showNextFigure()
    }

    function moveLeft() {
        undrawFigure()
        if (!isAtLeftEdge()) currentPosition -=1
        if (isSomeTaken()) currentPosition += 1
        drawFigure()
    }

    function moveRight() {
        undrawFigure()
        if (!isAtRightEdge()) currentPosition +=1
        if (isSomeTaken()) currentPosition -= 1
        drawFigure()
    }

    function isSomeTaken(thisWidth = 0) {
        return currentFigure.some(index => squares[currentPosition + index + thisWidth]
                            .classList.contains('taken'))
    } 
    
    function isAtRightEdge() {
        return currentFigure.some(index => (currentPosition + index + 1) % width === 0)  
    }
      
    function isAtLeftEdge() {
        return currentFigure.some(index => (currentPosition + index) % width === 0)
    }

    function rotate() {
        undrawFigure()
        currentRotation++
        if (currentRotation === currentFigure.length) currentRotation = 0
        currentFigure = getRandomFigure()
        checkRotatedPosition()
        drawFigure()
    }

    // Rotate at the edge
    function checkRotatedPosition(P){
        P = P || currentPosition 

        if ((P+1) % width < 4) {         
            if (isAtRightEdge()){        
            currentPosition += 1   
            checkRotatedPosition(P)
            }
        }
        else if (P % width > 5) {
            if (isAtLeftEdge()){
            currentPosition -= 1
            checkRotatedPosition(P)
            }
        }
    }

    function showNextFigure() {
        undrawNextFigure()
        drawNextFigure() 
    }

    function drawNextFigure() {
        nextFigures[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
            displaySquares[displayIndex + index].style.opacity = '0.8'
        })
    }
    
    function undrawNextFigure() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
            square.style.opacity = ''
        })
    }

    function isRowTaken(row) {
        return row.every(index => squares[index].classList.contains('taken'))
    }

    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(isRowTaken(row)) {
                score +=10
                scoreDisplay.innerHTML = score
                playSound(sounds.clear)
                deleteRow(row, i)
                showAnimations()
            }
        }
    }

    function showAnimations() {
        grid.classList.add('color-blink-white')
        setTimeout(() => {
            grid.classList.remove('color-blink-white')
        }, 300)
    }

    function deleteRow(row, i) {
        row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
    }

    function gameOver() {
        if (isSomeTaken()) {
            isGameOver = true
            if (isMusicPlay) playMainMusic()
            playSound(sounds.gameover)
            isMusicPlay = false
            clearInterval(timerId)
            timerId = null
            showEndTitle()
        }  
    }

    function playMainMusic() {
        mainMusic.paused ? mainMusic.play() : mainMusic.pause()
    }  

    function playSound(sound) {
        let melody = document.getElementsByTagName("audio")[sound]
        melody.loop = false
        melody.play()
    }

    function showEndTitle() {
        finalScore.innerHTML = score
        gameOverBlock.style.display = 'block' 
    }

    function startNewGame() {
        gameOverBlock.style.display = 'none'
        score = 0
        isGameOver = false
        speed = 1000
        stepScore = 1
        speedDisplay.innerHTML = 1
        clearGameArea()
        startGame();
    }

    function clearGameArea() {
        squares.forEach((v, i) => {
            if (i < 200) {
                v.classList.remove('tetromino')
                v.classList.remove('taken')
                v.style.backgroundColor = ''
            }
        })
    }
})