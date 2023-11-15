const NEXT_SYMBOL_VECTOR = [
   /* {x: -1, y: -1},*/ {x: -1, y: 0}, /*{x: -1, y: 1},*/
    {x: 0, y: -1}, /*{x: 0, y: 0}*/ {x: 0, y: 1},
    /*{x: 1, y: -1},*/ {x: 1, y: 0},/* {x: 1, y: 1},*/
]

const EMPTY_SYMBOL = ''

const initEmptyMatrix = (rows, cols) => {
    let matrix = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            row.push(EMPTY_SYMBOL);
        }
        matrix.push(row);
    }

    return matrix;
}


// Generate a random number between 0 and 25 (inclusive)
const generateRandomNumber = (number) => Math.floor(Math.random() * number);

const getRandomAsciiSymbol = () => {
    // Generate a random number between 0 and 25 (inclusive)
    const randomNum = generateRandomNumber(26);
    // Convert this number to a lowercase letter from 'a' to 'z'
    return String.fromCharCode(97 + randomNum);
}

const getRandomSymbol = () => getRandomAsciiSymbol()

const copyMatrix = (matrix) => {
    return matrix.map(row => row.slice());
}

const getMatrixConfig = (matrix) => {
    const rows = matrix.length
    if (rows === 0) {
        return {rows: -1, cols: -1}
    }
    const cols = matrix[0].length
    return {rows, cols}
}

const fillMissedMatrixItemsWithRandom = (matrix) => {

    const {rows, cols} = getMatrixConfig(matrix)
    if (rows === -1 || cols === -1) {
        return []
    }

    let newMatrix = copyMatrix(matrix)

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (newMatrix[i][j] === EMPTY_SYMBOL) {
                newMatrix[i][j] = getRandomSymbol();
            }
        }
    }

    return newMatrix;
}

/**
 *
 * @param matrix
 *
 * return [{x,y}]
 */
const findEmptyCells = (matrix) => {
    const {rows, cols} = getMatrixConfig(matrix)

    const emptyCellsList = []

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === EMPTY_SYMBOL) {
                emptyCellsList.push({x: i, y: j})
            }
        }
    }

    return emptyCellsList
}

const isCellInList = (findCell, cells) => cells.find(item => findCell.x === item.x && findCell.y === item.y) !== undefined

const subtractCells = (cells, cellsToSubtract) => cells.filter(cell => !isCellInList(cell, cellsToSubtract))

const shuffleArray = (list) => {
    let returnedValue = [...list]
    for (let i = returnedValue.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        let j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [returnedValue[i], returnedValue[j]] = [returnedValue[j], returnedValue[i]];
    }

    return returnedValue
}

const isCellInMatrix = (cell, matrix) => {
    const {rows, cols} = getMatrixConfig(matrix)
    return !(cell.x < 0 || cell.y < 0 || cell.x >= rows || cell.y >= cols);

}

const fillWordTail = (matrix, head, tailLen) => {

    if (tailLen === 0) {
        return [...head]
    }

    const emptyCells = findEmptyCells(matrix)
    const freeCells = subtractCells(emptyCells, head)

    // last word in head from which we'll generate new one
    const headLast = head[head.length - 1]

    // Next Symbol possible position
    let possiblePosList = NEXT_SYMBOL_VECTOR
        .map(item => ({ x:  headLast.x + item.x, y: headLast.y + item.y }))
        .filter(item => isCellInList(item, freeCells) && isCellInMatrix(item, matrix))


    possiblePosList = shuffleArray(possiblePosList)

    for (const index in possiblePosList) {
        const tail = fillWordTail(matrix, [...head, possiblePosList[index]], tailLen - 1)
        if (tail) {
            return [...tail]
        }
    }

    return null
}

/**
 *
 * @param word
 * @param matrix
 *
 * Return new Matrix with word placed in it
 */
const placeWord = (word, matrix) => {

    const wordLength = word.length
    const newMatrix = copyMatrix(matrix)

    const emptyCells = findEmptyCells(newMatrix)
    const randomEmptyCell = generateRandomNumber(emptyCells.length)
    const startWordCell = emptyCells[randomEmptyCell] // {x,y}

    const wordsSequencePos = fillWordTail(matrix, [startWordCell], wordLength - 1)

    for (const index in wordsSequencePos) {
        const cell = wordsSequencePos[index]
        newMatrix[cell.x][cell.y] = word[index]
    }

    return newMatrix;
}

const createWordsMatrix = (rows, cols, words) => {
    let newMatrix = initEmptyMatrix(rows, cols)

    for (const index in words) {
        newMatrix = placeWord(words[index], newMatrix)
    }

    newMatrix = fillMissedMatrixItemsWithRandom(newMatrix)

    return newMatrix

}

module.exports = { createWordsMatrix }