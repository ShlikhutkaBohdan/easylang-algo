const {createWordsMatrix} = require("./algo");


for (let i = 1; i <= 1000; i++) {
    const matrix = createWordsMatrix(10, 10, ['EASYLANG', 'SCHOOL'])
    console.log("Generation: ", i)
    console.table(matrix)
}


