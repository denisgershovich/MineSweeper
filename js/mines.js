
//check mines around cell 
function setMinesNegsCount(i,j){
    // the cell we checking 
    var cell = gBoard[i][j]
    //check if there is any mines around the cell
    var minesAroundCell = countMinesAround(gBoard,i,j)
   //update cell obj how many mines around the cell
   cell.minesAroundCount = minesAroundCell
   //render board
   renderBoard()
   
}
//set Mines on board randomly
function randomizeMinesOnBoard(){
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
//set one mine randomly on board 
function randomizeMineOnBoard(){
        var randomI = getRandomIntInclusive(0,gBoard.length - 1)
        var randomJ = getRandomIntInclusive(0,gBoard.length - 1)
       // var cell = gBoard[randomI][randomJ]
        if(!gBoard[randomI][randomJ].isMine && !gBoard[randomI][randomJ].isShown){
            gBoard[randomI][randomJ].isMine = true
            renderBoard()
        }else{
           randomizeMineOnBoard()
        }
    }
 //show mine   
function showMine(el){
   var elMine = el.querySelector('span.mine') 
   elMine.style.display = 'block'
    mineTime = setTimeout(function (){
       elMine.style.display = 'none'
       el.style.backgroundColor = '#f1f1f1'
   },1000)
}
//show all mines on board
function getAllMines(){
  //gat all mines el 
  var minesEl = document.querySelectorAll('.mine')
  var elFlag = document.querySelectorAll('span.flag')
  for(var i = 0 ; i < minesEl.length ; i++){
    minesEl[i].style.display = 'block'
  }
  for(var i = 0 ; i < elFlag.length ; i++){
    elFlag[i].style.display = 'none'
  }
  
}
//count mines around cell 
function countMinesAround(mat, rowIdx, colIdx) {
   
    var minesCount = 0
    if(!mat[rowIdx][colIdx].isMine){
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
    }  if(minesCount > 0){
       gBoard[rowIdx][colIdx].minesAroundCount = minesCount
    }
      
       //return minesCount  
     
    }
    return minesCount  
} 