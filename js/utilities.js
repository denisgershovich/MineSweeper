'use strict'
//RANDOM NUMBER 
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//build board 
function createBoard(scale) {
    var board = [];
    for (var i = 0; i < scale; i++) {
        board[i] = [];
        for (var j = 0; j < scale; j++) {
            var cell = {
              minesAroundCount:'',
              isShown:false,
              isMine:false,
              isMarked:false
            }
            board[i][j] = cell 
        }
    }
    return board;
}
function placeMines(numberOfMines){
    for(var i = 0 ; i < numberOfMines;i++){
      
    }
}
//render board
function renderBoard(){
  var table = document.querySelector('table')
    var htmlStr = ''
      for(var i = 0 ; i < gBoard.length ; i++){
          var tr = '<tr>'
            for(var j = 0 ; j < gBoard.length ; j++){
        
              if(gBoard[i][j].isMine){
                tr += `<td class="cell row${i} col${j}" onmousedown="cellMarked(event,this,${i},${j})" onclick="cellClicked(this,${i},${j})"><span class="mine">${MINE}</span> </td>` 
              }else{
                tr += `<td class="cell row${i} col${j}" onmousedown="cellMarked(event,this,${i},${j})" onclick="cellClicked(this,${i},${j})"><span>${gBoard[i][j].minesAroundCount}</span></td>` 
              }  
            }
         tr += '</tr>'
         htmlStr += tr
        }
    
  table.innerHTML = htmlStr 
}

//STOP WATCH 
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

//expend cell
  function expandCells(mat, rowIdx, colIdx, el) {
    var neighbors = []
   var el = document.querySelector(`.cell.row${rowIdx}.col${colIdx}`)
    neighbors.push({el,i:rowIdx,j:colIdx})
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var el = document.querySelector(`.cell.row${i}.col${j}`)
            var cell = gBoard[i][j]
            if (cell.isShown) {
                continue
            }
            neighbors.push({el,i,j})
        }
    } 
    for (var i = 0; i < neighbors.length ; i++) { 
          var cellI = neighbors[i].i
          var cellJ = neighbors[i].j
          var el = neighbors[i].el
          var span = el.querySelector('span')
          gGame.shownCount += 1 
          gBoard[cellI][cellJ].isShown = true 
          countMinesAround(gBoard,cellI,cellJ)
          span.innerText = gBoard[cellI][cellJ].minesAroundCount 
          el.classList.add("active");
          checkGameOver()
   }
  }