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

function sameRows(board: boolean[][], y1: number, y2: number, count: number) : boolean {
    for (let y = 0; y < count; y++) for (let x = 0; x < board[0].length; x++) {
        if (board[y1 + y][x] !== board[y2 + y][x]) return false
    }
    return true
}

function run(content: string, rocks: number) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line
    const moves = [...lines[0]]

    const width = 7
    let board: boolean[][] = [new Array(width).fill(true)]
    let moveIndex = -1

    let before = 0
    let highestPos = 0
    
    const safetyKeep = 100, safetyLimit = 1_000_000
    //const safetyKeep = 100, safetyLimit = 1_000_000

    const mod = shapes.length * moves.length
    let lastMod = 0
    
    // console.debug("mod", mod);
    let last = 0
        
    for (let count = 0, shapeIndex = 0; count < rocks; count++, shapeIndex = (shapeIndex + 1) % shapes.length) {

        if (board.length >= safetyLimit) {
            const deleteCount = safetyLimit - safetyKeep
            board = board.slice(deleteCount)
            highestPos += deleteCount
        }

        const shape  = shapes[shapeIndex]
        const highest = highestRock(board)

        // const mod = 200
        const mod = (inputContent.length - 1) * 10_000
        // console.debug("mod", mod)
        if (count % mod == 0) {
            const now = highest + highestPos
            console.debug(count, now, now - last)
            last = now
        }

        //console.debug("highest", highest)

        /*
        for (let currentMod = mod; highest >= currentMod * 2 + safetyKeep + 1; currentMod += mod) {
            const pos = highest - safetyKeep;
            //lastMod += mod
            
            console.debug("BAD", highest, pos, currentMod)

            if (sameRows(board, pos - currentMod, pos, currentMod)) console.debug("checking", highest, pos, currentMod)
        }
        */

        // if (count % (shapes.length * moves.length) === 0) {
        //if (count % 1_000_000_000 === 0) {
         //   console.debug(count, highest + highestPos, before, highest + highestPos - before)
          //  console.debug(highest - before)
           // before = highest
        //}
        let ypos = highest + 3 + shape.length
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
    
    // console.debug(highestRock(board) + highestPos)
    return highestRock(board) + highestPos
}

// run(sampleContent, 2022) // 3068 (sample)

//for (let i = 0; i <= 2022; i++) console.debug(i, run(sampleContent, i))

// run(inputContent, 2022) // 3215

//run(sampleContent, 1_000_000_000_000) // 1514285714288 (sample)

//run(inputContent, 10000) // 1514285714288 (sample)

// run(sampleContent, 10_000) // 3068 (sample)
//run(inputContent, 10_000_000) //

/*
const mod = 200 * 1
let last = 0
for (let i = 0; i < 5_000; i += mod) {
    const now = run(sampleContent, i)
    console.debug(i, now, now - last)
    last = now
}
*/

/*
const mod = (inputContent.length - 1) * 10_000
console.debug("mod", mod)
let last = 0
for (let i = 0; i < 1_000_000_000_000; i += mod) {
    const now = run(inputContent, i)
    console.debug(i, now, now - last)
    last = now
}
*/

/*
// RET: 1514285714288 (sample)
// 200 308  , cada 200 
const cycle = [300, 306, 303, 303, 301, 306, 301];
let total = 308
let cycleIndex = -1;
for (let i = 200; i <= 1_000_000_000_000; i+= 200, cycleIndex = (cycleIndex + 1) % cycle.length, total += cycle[cycleIndex]) {
    if (i % 1_000_000_000 === 0) console.debug(i, total)
}
*/

// run(sampleContent, 1_000_000_000_000)

/*
const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
console.debug(a)
console.debug(a.slice(10 - 2))
console.debug(a)
*/


// run(sampleContent, 1_000_000_000_000) // 3068 (sample)

run(inputContent, 1_000_000_000_000) // 3068 (sample)
