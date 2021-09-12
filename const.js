const width = 10
const colors = [
    '#43aa8b',
    '#fb5607',
    '#ff006e',
    '#8338ec',
    '#3a86ff'
  ]
const sounds = { 
    'fall' : 1,
    'clear': 2,
    'gameover': 3
}

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

const figures = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

const displayWidth = 4
const displayIndex = 0

const nextFigures = [
  [1, displayWidth+1, displayWidth*2+1, 2],               //lTetromino
  [0, displayWidth, displayWidth+1, displayWidth*2+1],    //zTetromino
  [1, displayWidth, displayWidth+1, displayWidth+2],      //tTetromino
  [0, 1, displayWidth, displayWidth+1],                   //oTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]


