'use strict'
const MINE = '&#128163;'
const FLAG = '&#128681;'
const LIVES = '&#129505;'
const NORAML = '&#128515;'
const LOSE = '&#129326;'
const WIN = '&#x1F60E;'

//TIMER  VARIABLES 
var milliseconds = 0
var seconds = 0 
var stopWatch = null
var mineTime
var gBoard
var gLevel = {
    SIZE:4,
    MINES:2
}
var gGame = {
    isOn:true,
    shownCount:0,//how many cells are shown 
    markedCount:0,//how many bombs marked with a flag 
}
var isFirstClickedOnCell = true 
var gLives = 3
//on load page
//Disable browser right-click context menu
window.addEventListener("contextmenu", e => e.preventDefault());
//init game 
function initGame(){
    if(gGame.isOn){
    clearWatch()
    gGame.markedCount = 0
    gGame.shownCount = 0
    console.log('game initialized') 
    //init first click 
    isFirstClickedOnCell = true
    //init glives
    gLives = 3
     //build Board 
    gBoard = createBoard(gLevel.SIZE)
    //place mines
    randomizeMinesOnBoard()
    //render board 
    renderBoard()
    //user lives 
    renderLives()
   //add smiley game 
    addSmiley(NORAML)
   //rest stop watch
    milliseconds = 0
    seconds = 0 
  }
}

function cellClicked( elCell, i, j){
   var cell = gBoard[i][j]
   var minesAround 
   if(!cell.isMarked){
     var span = elCell.querySelector('span')  
    if(isFirstClickedOnCell){
        startWatch()
    if(gBoard[i][j].isMine){
          //delete the mine 
        gBoard[i][j].isMine = false
          //is shown 
        gBoard[i][j].isShown = true
        //update gGame
        gGame.shownCount += 1 
         //up date the gboard
        randomizeMineOnBoard() 
        //set first clicke to false 
        isFirstClickedOnCell = false
        renderBoard() 
        minesAround = countMinesAround(gBoard,i,j)
         if(!minesAround){
           gGame.shownCount -= 1 
           expandCells(gBoard, i, j, elCell)
           return
          }
         document.querySelector(`.cell.row${i}.col${j}`).classList.add("active");
         document.querySelector(`.cell.row${i}.col${j}`).querySelector('span').innerText = gBoard[i][j].minesAroundCount 
        }
        minesAround = countMinesAround(gBoard,i,j)
         if(!minesAround){
           expandCells(gBoard, i, j, elCell)
           isFirstClickedOnCell = false
           return
         }
        isFirstClickedOnCell = false
    }
    
    if(cell.isMine){
        addSmiley(LOSE)
        showMine(elCell)
         --gLives
        if(gLives === 0){
            clearTimeout(mineTime)
            clearWatch()
            getAllMines()
            renderLives()
            gGame.isOn = false
            return
        }
         renderLives()
        setTimeout(addSmiley,1000,NORAML)
        return
     }
     if(!cell.isShown){
        gGame.shownCount += 1 
     } 
   // countMinesAround(gBoard,i,j)
    minesAround = countMinesAround(gBoard,i,j)
    if(!minesAround){
        gGame.shownCount -= 1 
        expandCells(gBoard, i, j, elCell)
         return
    }
    gBoard[i][j].isShown = true 
    span.innerText = gBoard[i][j].minesAroundCount 
    elCell.classList.add("active");
    checkGameOver()
    minesAround = countMinesAround(gBoard,i,j)
    // if(minesAround)console.log(minesAround)
    }
}
//mark cell suspected as a bomb
function cellMarked(event,el,i,j){
    //only if left clicked 
    if(event.button === 2){
      var cell = gBoard[i][j]
      checkGameOver()
        if(cell.isMarked){
          var flag = el.querySelector('.flag')
          flag.remove()    
          cell.isMarked = false
          if(cell.isMine){
            gGame.markedCount -= 1
          }

    } else if(!cell.isMarked && !cell.isShown){
        el.innerHTML +=`<span class="flag">${FLAG}</span> ` 
        cell.isMarked = true
        if(cell.isMine){
            gGame.markedCount += 1   
        }
      }
      checkGameOver()
    }
}

function checkGameOver(){
    if(gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE**2 - gLevel.MINES){
        addSmiley(WIN)
        gGame.markedCount = 0
        gGame.shownCount = 0
        clearWatch()
    }
}
//render user lives
function renderLives(){
    var htmlStr =''
    for(var i = 0 ; i < gLives ;i++){
        htmlStr += `<span>${LIVES}</span>`
    }
    document.querySelector('.box.lives').innerHTML = htmlStr
}
//each click on level el change board size
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
//reset game function 
function resetGame(){
    console.log('game restarted')
    document.querySelector('.box.stop-watch').innerHTML = '0'
    gGame.isOn = true
    initGame()

}

