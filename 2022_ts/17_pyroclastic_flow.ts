import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/17_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/17_sample.txt", 'utf-8')

const shapes = [
    [ [true, true, true, true] ],
    [ [false, true, false], [true, true, true], [false, true, false] ],
    [ [false, false, true], [false, false, true], [true, true, true] ], 
    [ [true],[true], [true], [true] ],
    [ [true, true], [true, true] ]
]

function display(board: boolean[][]) {
    console.debug([...board].reverse().map(row => row.map(cell => cell ? '#' : '.').join('')).join('\n'))
}

function allowed(board: boolean[][], shape: boolean[][], ypos: number, xpos: number) : boolean {
    for (let yshape = 0; yshape < shape.length; yshape++) for (let xshape = 0; xshape < shape[0].length; xshape++) {
        if (shape[yshape][xshape] && board[ypos - yshape][xpos + xshape]) return false
    }
    return true;
}

function fix(board: boolean[][], shape: boolean[][], ypos: number, xpos: number) : void {
    for (let yshape = 0; yshape < shape.length; yshape++) for (let xshape = 0; xshape < shape[0].length; xshape++) {
        if (shape[yshape][xshape]) board[ypos - yshape][xpos + xshape] = true
    }
}

const highestRock = (board: boolean[][]): number => {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].some(cell => cell)) {
            return y
        }
    }
    throw new Error("shouldnt happen")
}

function run(content: string, rocks: number) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line
    const moves = [...lines[0]]

    const width = 7
    const board: boolean[][] = [new Array(width).fill(true)]
    let moveIndex = -1

    for (let count = 0, shapeIndex = 0; count < rocks; count++, shapeIndex = (shapeIndex + 1) % shapes.length) {
        const shape  = shapes[shapeIndex]
        let ypos = highestRock(board) + 3 + shape.length
        let xpos = 2
        while (board.length <= ypos) board.push(new Array(width).fill(false))

        while (true) {
            moveIndex = (moveIndex + 1) % moves.length
            const move = moves[moveIndex]

            if (move === ">") {
                if (xpos + shape[0].length < width && allowed(board, shape, ypos, xpos+1)) xpos++;
            } else { // <
                if (xpos > 0 && allowed(board, shape, ypos, xpos-1)) xpos--;
            }
    
            if (allowed(board, shape, ypos - 1, xpos)) ypos--; else break
        }

        fix(board, shape, ypos, xpos)
    }
    
    console.debug(highestRock(board))
    //return highestRock(board)
}

run(sampleContent, 2022) // 3068 (sample)

//for (let i = 0; i <= 2022; i++) console.debug(i, run(sampleContent, i))

run(inputContent, 2022) // 3215

//run(sampleContent, 1_000_000_000_000) // 1514285714288 (sample)

//run(inputContent, 10000) // 1514285714288 (sample)
