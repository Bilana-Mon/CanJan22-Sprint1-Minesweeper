'use strict'

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push([])
        }
        mat.push(row)
    }
    return mat
}

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat.length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat;
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function countNegsAround(cellI, cellJ, mat) {
    var count = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) {
            continue;
        }
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat.length) {
                continue;
            }
            if (i === cellI && j === cellJ) {
                continue;
            }
            var currCell = mat[i][j]
        }
        if (currCell.isMine) {
            count++
            console.log(count);
        }
    }
    return count
}

