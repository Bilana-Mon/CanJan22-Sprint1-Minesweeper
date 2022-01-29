'use strict'


const MINE = '💣';
const FLAG = '🚩';

var gMadeFirstMove = false;
var gLives;
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
var gMinesLeft = 2;
var gMine = {
    i: getRandomIntInclusive(0, gLevel.SIZE - 1),
    j: getRandomIntInclusive(0, gLevel.SIZE - 1)
}


function init() {
    document.querySelector('h1').innerText = 'Minesweeper 😀';
    document.querySelector('h1').onclick = function () {
        reset();
        init();
    }

    gBoard = buildBoard();
    gBoard = setMinesOnBoard(gBoard);
    gBoard = setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    gGame.isOn = true;
    gGame.secsPassed = 0;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gLives = 2;
    gSeconds = 0;
    gMilliseconds = 0;

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


    return board;
}

// random mines func
function setMinesOnBoard(board) {
    var mines = [];
    for (var i = 0; i < gLevel.MINES; i++) {
        var rowMine = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var colMine = getRandomIntInclusive(0, gLevel.SIZE - 1);
        while (mines.includes({ i: rowMine, j: colMine })) {
            rowMine = getRandomIntInclusive(0, gLevel.SIZE - 1);
            colMine = getRandomIntInclusive(0, gLevel.SIZE - 1);
        }
        mines.push({ i: rowMine, j: colMine });

    }
    for (var i = 0; i < mines.length; i++) {
        var { i: mineI, j: mineJ } = mines[i];
        board[mineI][mineJ].isMine = true;
        board[mineI][mineJ].isShown = true;
    }
    return board;
}

// TODO: class toggle nieghbors


// turn cell content to string
function boardCellToStr(i, j, board) {
    if (board[i][j].isMine) {
        return MINE;
    } else {
        return board[i][j].minesAroundCount.toString();
    }
}


function renderBoard(board) {
    var strHTML = `<table><tbody class="board">`;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            strHTML += `<td class="hidden" id="${i}_${j}" oncontextmenu="cellMarked(${i}, ${j})" onclick="expandShown(${i},${j})">${boardCellToStr(i, j, board)}</td>`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elDiv = document.querySelector('.main-box');
    elDiv.innerHTML = strHTML;


}

// create classes for cell to toggle visibility
function revealCell(i, j) {
    var elCell = document.getElementById(`${i}_${j}`);
    elCell.className = 'visible';
    gBoard[i][j].isShown = true;

    if (elCell.innerText === '0') {
        elCell.style.color = 'rgb(165, 163, 163)';
    }

    if (elCell.innerText === '1') {
        elCell.style.color = 'blue';
    }

    if (elCell.innerText === '2') {
        elCell.style.color = 'green';
    }

    if (elCell.innerText === '3') {
        elCell.style.color = 'red';
    }
}

// reveal cells
function revealCellLeftClick(i, j) {
    var elCell = document.getElementById(`${i}_${j}`);
    elCell.className = 'visible-left-click';
    gBoard[i][j].isShown = true;
}

// reveal mines
function revealMineLeftClick(i, j) {
    var elCell = document.getElementById(`${i}_${j}`);
    elCell.className = 'visible-mine-left-click';
    gBoard[i][j].isShown = true;
}

// reveal 1st negs
function revealCellNeg(i, j) {
    var elCell = document.getElementById(`${i}_${j}`);
    elCell.className = 'visible-neg-click';
    gBoard[i][j].isShown = true;
}



// every cell looks around for mines and counts the mines around it
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = countNegsAround(i, j, board);
        }
    }
    return board;
}




function cellMarked(i, j) {
    var elCell = document.getElementById(`${i}_${j}`);
    event.preventDefault();
    gBoard[i][j].isMarked = true;
    elCell.className = 'visible';
    elCell.innerText = FLAG;
}




function gameLost(i, j) {
    if ((gBoard[i][j].isMine && gLives === 0)) {
        gGame.isOn = false;
        document.querySelector('h1').innerText = 'Game Over 🤯!';
        revealMinesOnBoard();
        pause();
        pauseTimer();

    }
}

function gameVictory(i, j) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (
                (!gBoard[i][j].isMine && gBoard[i][j].isShown) ||
                (gBoard[i][j].isMine && gBoard[i][j].isMarked)) {
                gGame.isOn = false;
                document.querySelector('h1').innerText = 'Victory 😎!';
            }
        }
    }
}




function checkGameOver(i, j) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!(gBoard[i][j].isShown || gBoard[i][j].isMarked)) {
                return false;
            }

        }
    }
    return true;
}

// getting the 1st degree negs
function getNegsInDegree(degree, cellI, cellJ) {
    var negs = [];
    for (var i = cellI - 1; i < cellI + 2; i++) {
        for (var j = cellJ - 1; j < cellJ + 2; j++) {
            if (!(i < 0 || j < 0 || j >= gBoard.length || i >= gBoard.length)) {
                negs.push({ i, j });
            }
        }
    }
    return negs;
}


function setRandMine(cellI, cellJ) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine && i !== cellI && j !== cellJ) {
                gBoard[i][j].isMine = true;
                return;
            }
        }
    }
}


function expandShown(i, j) {
    if (!gMadeFirstMove) {
        gMadeFirstMove = true;
        gBoard[i][j].isMine = false;
        setRandMine()
        renderBoard(gBoard)
        start()
    }
    if (gBoard[i][j].isMine) {
        setLivesCount(gLives--);
        setMinesCount(gMinesLeft--)
    }
    gameLost(i, j);
    if (checkGameOver(i, j)) {
        gameVictory(i, j);
        pause()
        pauseTimer()
    }


    if (countNegsAround(i, j, gBoard)) {
        revealCell(i, j);
        return;
    }

    const oneStDegreeNegs = getNegsInDegree(1, i, j);
    for (var index = 0; index < oneStDegreeNegs.length; index++) {
        var { i: cellI, j: cellJ } = oneStDegreeNegs[index];
        revealCell(cellI, cellJ);
    }

}


// updates the lives the player has left
function setLivesCount(lives) {
    var elSpan = document.querySelector('.lives');
    elSpan.innerText = `Lives Left: ${lives}`;
}

function setMinesCount(mines) {
    var elSpan = document.querySelector('.mines');
    elSpan.innerText = `Mines Left: ${mines}`;
}

function revealMinesOnBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                revealCell(i, j);
                var mineAudio = new Audio('assets/sounds/mine-boom.mp3');
                var catAudio = new Audio('assets/sounds/cat.mp3');
                mineAudio.play()
                setTimeout(catAudio.play(), 1000);
            }
        }
    }
}




function resetView() {
    document.querySelector('h1').innerText = 'Minesweeper 😀';
    gSeconds = 0;
    gMilliseconds = 0;

    gMadeFirstMove = false;

    document.getElementById('second').innerText = returnData(gSeconds);
    document.getElementById('millisecond').innerText = returnData(gMilliseconds);

}




// btn levels

function clickBtn(btn) {
    if (btn.classList.contains('easy')) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gMinesLeft = 2;
        gLives = 2;
        document.querySelector('.mines').innerText = 'Mines Left: 2';
        document.querySelector('.lives').innerText = 'Lives Left: 3';
        gBoard = buildBoard();
        gBoard = setMinesOnBoard(gBoard);
        gBoard = setMinesNegsCount(gBoard);
        renderBoard(gBoard);

        // TODO: add timer reset funcs
    } else if (btn.classList.contains('hard')) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        gMinesLeft = 12;
        gLives = 3;
        document.querySelector('.mines').innerText = 'Mines Left: 12';
        document.querySelector('.lives').innerText = 'Lives Left: 3';
        gBoard = buildBoard();
        gBoard = setMinesOnBoard(gBoard);
        gBoard = setMinesNegsCount(gBoard);
        renderBoard(gBoard);

    } else {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        gMinesLeft = 30;
        gLives = 3;
        document.querySelector('.mines').innerText = 'Mines Left: 30';
        document.querySelector('.lives').innerText = 'Lives Left: 3';
        gBoard = buildBoard();
        gBoard = setMinesOnBoard(gBoard);
        gBoard = setMinesNegsCount(gBoard);
        renderBoard(gBoard);

    }
    resetView()

}




// timer functions

function start() {
    gInterval = setInterval(timer, 10);
}

// pause game
function pause() {
    var elCells = document.querySelectorAll('td');
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].onclick = null;
        elCells[i].oncontextmenu = null;
    }
}

function pauseTimer() {
    clearInterval(gInterval);
}

function reset() {
    gSeconds = 0;
    gMilliseconds = 0;
    gMadeFirstMove = false;
    setLivesCount(gLives);
    setMinesCount(gMinesLeft);
    document.getElementById('second').innerText = '00';
    document.getElementById('millisecond').innerText = '000';
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.getElementById(`${i}_${j}`);
            elCell.onclick = function () {
                return expandShown(i, j);
            }
            elCell.oncontextmenu = function () {
                return cellMarked(i, j);
            }
        }
    }
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
