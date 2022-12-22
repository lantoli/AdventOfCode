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

function allowed(board: number[], shape: boolean[][], ypos: number, xpos: number) : boolean {
    for (let yshape = 0; yshape < shape.length; yshape++) for (let xshape = 0; xshape < shape[0].length; xshape++) {
        if (shape[yshape][xshape] && (board[ypos - yshape] & 1 << (xpos+xshape))) return false
    }
    return true;
}

function fix(board: number[], shape: boolean[][], ypos: number, xpos: number) : void {
    for (let yshape = 0; yshape < shape.length; yshape++) for (let xshape = 0; xshape < shape[0].length; xshape++) {
        if (shape[yshape][xshape]) board[ypos - yshape] |= 1 << xpos + xshape
    }
}

const highestRock = (board: number[]): number => {
    for (let y = board.length - 1; y >= 0; y--) if (board[y] > 0) return y
    throw new Error("shouldnt happen")
}

function sameRows(board: number[], y1: number, y2: number, count: number) : boolean {
    for (let y = 0; y < count; y++) if (board[y1 + y] !== board[y2 + y]) return false
    return true
}

function run(content: string, rocks: number) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line
    const moves = [...lines[0]]

    const width = 7
    let board: number[] = [255]
    let moveIndex = -1

    let highestPos = 0
    
    const safetyKeep = 100, safetyLimit = 1_000_000_000_000
        
    for (let count = 0, shapeIndex = 0; count < rocks; count++, shapeIndex = (shapeIndex + 1) % shapes.length) {

        if (board.length >= safetyLimit) {
            const deleteCount = safetyLimit - safetyKeep
            board = board.slice(deleteCount)
            highestPos += deleteCount
        }

        const shape  = shapes[shapeIndex]
        const highest = highestRock(board)

        let ypos = highest + 3 + shape.length
        let xpos = 2
        while (board.length <= ypos) board.push(0)

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
    
    console.debug(highestRock(board) + highestPos)
    // return highestRock(board) + highestPos
}

run(sampleContent, 2022) // 3068 (sample)
//run(sampleContent, 1_000_000_000_000) // 1514285714288 (sample)

run(inputContent, 2022) // 3215
//run(inputContent, 1_000_000_000_000) // ...
