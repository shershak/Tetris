document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const speedDisplay = document.querySelector('#speed')
    const startBtn = document.querySelector('#start-button')
    const musicBtn = document.querySelector('#music-button')
    const speedBtn = document.querySelector('#speed-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        '#43aa8b',
        '#fb5607',
        '#ff006e',
        '#8338ec',
        '#3a86ff'
      ]
    const sounds = {
        'fall' : 1,
        'clear': 2
    }
    let isMusicPlay = true
    let speed = 1000


    // The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    // randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]


    // draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
            squares[currentPosition + index].style.opacity = '0.9'
        })
        }
    
    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // assing functions to keyCodes
    function control(e) {
        if(timerId) {
            if(e.keyCode === 37) {
                moveLeft()
            } else if (e.keyCode === 38) {
                rotate()
            } else if (e.keyCode === 39) {
                moveRight()
            } else if (e.keyCode === 40) {
                moveDown()
            }
        }
    }
    document.addEventListener('keyup', control)

    // move down function
    function moveDown() {
            undraw()
            currentPosition += width
            draw()
            freeze()
    }

    // freeze functions
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            playSound(sounds.fall)
            //start new tetrimino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index + 1) % width === 0)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }
    
    // ROTATION OF TETROMINOS A THE EDGE
    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
      
    function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
    }
      
    function checkRotatedPosition(P){
        P = P || currentPosition       
        if ((P+1) % width < 4) {         
            if (isAtRight()){        
            currentPosition += 1   
            checkRotatedPosition(P)
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()){
            currentPosition -= 1
            checkRotatedPosition(P)
            }
        }
    }

    // rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { 
            currentRotation = 0
          }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  
    // the Tetrominos without rotations
    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
      [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
      [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
      [0, 1, displayWidth, displayWidth+1], //oTetromino
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    // display the shape in the mini-grid display
    function displayShape() {
        // remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
            displaySquares[displayIndex + index].style.opacity = '0.9'
        })
    }    
    
    // add functionality to the button
    startBtn.addEventListener('click', () => {
        if (scoreDisplay.innerHTML !== 'end') {
            startBtn.innerHTML = timerId ? 'START' : 'PAUSE'
            if (isMusicPlay) {
                playMusic()
            }
            if (timerId) {
                clearInterval(timerId)
                timerId = null
            } else {
                draw()
                timerId = setInterval(moveDown, speed)
                nextRandom = Math.floor(Math.random()*theTetrominoes.length)
                displayShape()
            }
        }
    })

    // add score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            playSound(sounds.clear)
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            if(isMusicPlay) {
                playMusic()
            }
            isMusicPlay = false
            clearInterval(timerId)
            timerId = null
        }  
    }

    // Add main music
    let mainMusic = document.getElementsByTagName("audio")[0]
    function playMusic() {
        if(mainMusic.paused) {
            mainMusic.play()
        } else {
            mainMusic.pause()
        }  
    }

    // Listener to music button
    musicBtn.addEventListener('click', (mainMusic) => {
        musicBtn.innerHTML = isMusicPlay ? String.fromCodePoint(0x1F508) : String.fromCodePoint(0x1F50A)
        isMusicPlay = isMusicPlay ? false : true
        if(timerId) {
            playMusic()
        }
    })

    function playSound(sound) {
        let soundFall = document.getElementsByTagName("audio")[sound]
        soundFall.loop = false
        soundFall.play()
    }

    // add speed button
    speedBtn.addEventListener('click', () => {
        speed /= 1.6
        speedDisplay.innerHTML = Number(speedDisplay.innerHTML) + 1
        if (timerId) {
            clearInterval(timerId)
            timerId = setInterval(moveDown, speed)
        } else {
            clearInterval(timerId)
        }
    })

    // TODO: Create function for changing speed
})

