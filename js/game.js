'use strict'


const MINE = '💣';
const FLAG = '🚩';
const NUMBER = gCount;

var gCount;
var gInterval;
var gSeconds;
var gMilliseconds;
var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gLevel = {
    SIZE: 4,
    MINES: 2
};


function init() {
    gBoard = buildBoard();
    gBoard = setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    gGame.isOn = true;
    gGame.secsPassed = 0;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gCount = 0;
    cellMarked()
    gSeconds = 0;
    gMilliseconds = 0;
    if (gInterval) {
        clearInterval(gInterval);
        gInterval = null;
        reset()
    }
}

// create matrix board
function buildBoard() {
    var cell = {};
    var board = createMat(gLevel.SIZE, gLevel.SIZE);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }
    var colFirstMine = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var RowFirstMine = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var ColSecMine = getRandomIntInclusive(0, gLevel.SIZE - 1)
    var RowSecMine = getRandomIntInclusive(0, gLevel.SIZE - 1)

    // TODO: to be continued

    return board;
}


function boardCellToStr(i, j, board) {
    if (board[i][j].isMine) {
        return 'mine';
    } else {
        return board[i][j].minesAroundCount.toString();
    }
}


function renderBoard(board) {
    var strHTML = `<table><tbody class="board">`;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            strHTML += `<td class="hidden" id="${i}_${j}" onclick="cellClicked(${i},${j})">${boardCellToStr(i, j, board)}</td>`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elDiv = document.querySelector('.main-box');
    elDiv.innerHTML = strHTML;
}

// every cell looks around for mines and counts the mines around it
function setMinesNegsCount(board) {
    console.log('start');
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = countNegsAround(i, j, board);
            console.log(countNegsAround(i, j, board));
        }
    }
    console.log(board);
    return board;
}


function cellClicked(i, j) {
    var elCell = document.getElementById(`${i}_${j}`);
    elCell.classList.remove('hidden');
    elCell.isShown = true;
}

function cellMarked(i, j) {
    // var elCell = document.getElementById(`${i}_${j}`);
    // elCell.onclick = function (e) {
    //     var isRightMB;
    //     e = e || window.event;
    //     if ("which" in e) {
    //         isRightMB = e.which === 3;
    //         cell.isMarked = true;
    //         gBoard[i][j] = FLAG;
    //     } else if (isRightMB = e.which === 2) {
    //         cell.isShown = true;
    //         pos = elCell;
    //     }
    // };

}


function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}




// timer functions

function start() {
    pause();
    gInterval = setInterval(timer, 10);
    if (gCount === (gBoardLength ** 2)) {
        pause();
    }
}

function pause() {
    clearInterval(gInterval);
}

function reset() {
    gSeconds = 0;
    gMilliseconds = 0;
    document.getElementById('second').innerText = '00';
    document.getElementById('millisecond').innerText = '000';
}


function timer() {
    if ((gMilliseconds += 10) === 1000) {
        gMilliseconds = 0;
        gSeconds++;
    }
    document.getElementById('second').innerText = returnData(gSeconds);
    document.getElementById('millisecond').innerText = returnData(gMilliseconds);
}


function returnData(input) {
    return input > 10 ? input : `0${input}`
}
