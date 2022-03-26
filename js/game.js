'use strict'
//Disable browser right-click context menu
window.addEventListener("contextmenu", e => e.preventDefault());
//global variables
const MINE = '&#128163;'
const LIVES = '&#129505;'
const FLAG = '&#128681;'
const NORAML = '&#128515;'
const LOSE = '&#129326;'
const WIN = '&#x1F60E;'
var milliseconds = 0
var seconds = 0 
var stopWatch= null
var gLevel = {
    SIZE:4,
    MINES:2
}
var gGame = {
    isOn:true,
    shownCount:0,
    markedCount:0,
}
var gLives = 3
var gBoard 
var isFirstClickOnCell = true 
initGame()
function initGame(){
    isFirstClickOnCell = true
    gLives = 3
    gBoard = createBoard()
    randomizeMines()
    renderGrid()
    renderLives()
    hideAllMines()
    //init gGame
    gGame.isOn = true
    gGame.shownCount = 0 
    gGame.markedCount = 0   
    addSmiley(NORAML) 
    //clear time 
    clearWatch()
    stopWatch = null
    milliseconds = 0
    seconds = 0 
    
}

function countMinesAround(mat, rowIdx, colIdx) {
     var minesCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
             var cell = mat[i][j]
             if (cell.isMine) {
                    minesCount++
             }
        }
    }

    return minesCount
} 

function createBoard(){
    var gBoard = [] 
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount:'',
                isShown:false,
                isMine:false,
                isMarked:false
            }
            gBoard[i][j] = cell
        }
    }
    return gBoard
}

function renderGrid(){
    var table = document.querySelector('table')
    var htmlStr = ''
    for(var i = 0 ; i < gBoard.length ; i++){
        var tr = '<tr>'
        for(var j = 0 ; j <  gBoard.length ; j++){
            var cell = gBoard[i][j]
            var minesAround = countMinesAround(gBoard, i, j)
            var cellContent = ''
            var type
            if(cell.isMine){
                cell.isMine = true
                cellContent = MINE
                type = 'mine'
            }if(minesAround && !cell.isMine){
                cellContent = countMinesAround(gBoard, i, j)
                cell.minesAroundCount = cellContent
                type =''
            }
            tr += `<td class='cell${i}${j}' oncontextmenu="mark(event,this,${i},${j})" onclick="clickOnCell(this,${i},${j})"><span class="${type}">${cellContent}</span></td>` 
        }
            tr += '</tr>'
            htmlStr += tr
        }
        table.innerHTML = htmlStr 
}

function clickOnCell(el,i,j){
    if(!gGame.isOn) return 
    if(gBoard[i][j].isMarked)return
    if(stopWatch === null) startWatch()
    //if mine is clicked
    if(gBoard[i][j].isMine){
        if(isFirstClickOnCell){
            gBoard[i][j].isMine = false
            gBoard[i][j].isShown = true
            randomizeMineOnBoard() 
            isFirstClickOnCell = false
            renderGrid()
            document.querySelector(`.cell${i}${j}`).classList.add("active")
            document.querySelector(`.cell${i}${j}`).querySelector('span').style.display = 'block' 
            gGame.shownCount += 1 
            return
        }
        --gLives
        renderLives()
        el.classList.add("active")
        addSmiley(LOSE)
        setTimeout(()=>{
            
            el.querySelector('span').style.display = 'none'
            el.classList.remove("active")
            gBoard[i][j].isShown = false
            if(gLives >= 0) addSmiley(NORAML)   
        },500)
        el.classList.add("active")
        el.querySelector('span').style.display = 'block'
        return
    }
    //update shown count 
    gGame.shownCount += 1
    el.classList.add("active")
   // el.classList.add("active")
    el.querySelector('span').style.display = 'block'
    var cell = gBoard[i][j]
    cell.isShown = true
    if(!cell.minesAroundCount && !cell.isMine){
       expandCells(gBoard, i, j)
    }
    isFirstClickOnCell = false
    //check victory 
    checkVictory()
}
       
function expandCells(mat, rowIdx, colIdx) {
    
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j > mat[0].length - 1) continue
                 if (i === rowIdx && j === colIdx) continue
                var cell = mat[i][j]
                if(cell.isShown) continue
                 var el = document.querySelector(`.cell${i}${j}`)
                 clickOnCell(el,i,j) 
             }
    }
} 
        
function randomizeMines(){
    for(var i = 0 ; i < gLevel.MINES ; i++){
        var randomI = getRandomIntInclusive(0,gBoard.length - 1)
        var randomJ = getRandomIntInclusive(0,gBoard.length - 1)
        var cell = gBoard[randomI][randomJ]
        if(!gBoard[randomI][randomJ].isMine ){
            cell.isMine = true
        }else{
            i -= 1
        }
    }
}  

function randomizeMineOnBoard(){
    var randomI = getRandomIntInclusive(0,gBoard.length - 1)
    var randomJ = getRandomIntInclusive(0,gBoard.length - 1)
       // var cell = gBoard[randomI][randomJ]
     if(!gBoard[randomI][randomJ].isMine && !gBoard[randomI][randomJ].isShown){
            gBoard[randomI][randomJ].isMine = true
    }else{
           randomizeMineOnBoard()
    }
    }
    
function renderLives(){
    if(gLives<0){
        gGame.isOn = false   
        document.querySelector('.box.smily').innerHTML = LOSE
        exposeAllMines()
        clearWatch()
    }
    var htmlStr =''
    for(var i = 0 ; i < gLives ;i++){
        htmlStr += `${LIVES}`
    }
    document.querySelector('.box.lives').innerHTML = htmlStr
}    


//mark with a flag 

function mark(e,el,i,j){
    if(!gGame.isOn) return
    var cell = gBoard[i][j]
    if(e.button === 2 && !cell.isMarked && !cell.isShown){
      //  el.querySelector('span').style.display = 'block'
       el.innerHTML += `<i class='flag'>${FLAG}</i> `
       cell.isMarked = true
       gGame.markedCount += 1 
    }else if(e.button === 2 && cell.isMarked){
        el.querySelector('.flag').remove()
        cell.isMarked = false
        gGame.markedCount -= 1 
    }
    //check possiblevictory 
       checkVictory()
}

function checkVictory(){
    if(gGame.shownCount === gBoard.length**2 - gLevel.MINES && 
        gGame.markedCount === gLevel.MINES ){
        addSmiley(WIN)
        gGame.isOn = false
        clearWatch()
    }
}

function getLevel(el){
    var level = el.dataset.level
    switch(level){
        case 'beginner':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break
        case 'medium':
             gLevel.SIZE = 8
            gLevel.MINES = 12
            break
        case 'expert':
            gLevel.SIZE = 12
            gLevel.MINES = 30
            break           
    }
    initGame()
}

//render smilley 
function addSmiley(el){
    var elSmiley = document.querySelector('.box.smily')
    elSmiley.innerHTML = el
}
function exposeAllMines(){
  var minesEl = document.querySelectorAll('.mine')
  for(var i = 0 ; i < minesEl.length ; i++){ 
    minesEl[i].style.display = 'block'
  }
}

function hideAllMines(){
  var minesEl = document.querySelectorAll('.mine')
  for(var i = 0 ; i < minesEl.length ; i++){ 
    minesEl[i].style.display = 'none'
  }

}

function countTime(){  
   milliseconds += 100
    if(milliseconds === 1000){
         milliseconds = 0
         ++seconds
    } 
 document.querySelector('.box.stop-watch').innerHTML = `${seconds}`
}
   

function startWatch(){
   stopWatch = setInterval(countTime,100) 
}

function clearWatch(){
    clearInterval(stopWatch)
  
}