// NOTE: Part 2 takes 3 days, I couldn't find the modulus / repeating logic. 
// TODO: find good solution for part 2

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

function run(content: string, rocks: number) {

    const start = new Date().getTime();

    const lines = content.split('\n')
    lines.pop() // Remove last empty line
    const moves = [...lines[0]]

    const width = 7
    let board: number[] = [255]
    let moveIndex = -1

    let highestPos = 0
    
    const safetyKeep = 1_000, safetyLimit = 10_000_000
        
    for (let count = 0, shapeIndex = 0; count < rocks; count++, shapeIndex = (shapeIndex + 1) % shapes.length) {

        if (board.length >= safetyLimit) {
            const deleteCount = safetyLimit - safetyKeep
            board = board.slice(deleteCount)
            highestPos += deleteCount
        }

        const shape  = shapes[shapeIndex]
        const highest = highestRock(board)

        // if (count % 1_000_000 == 0) {
        if (count % 1_000_000_000 == 0) {
            let elapsed = Math.floor((new Date().getTime() - start) / 1000 / 60);
            console.debug(elapsed, Math.floor(1_000_000_000_000 / count), count, highest + highestPos)
        }

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
    
    // console.debug(highestRock(board) + highestPos)


    // FOUND 2671 *****************
    // FOUND 2671 *****************
    //const mod = 200 * 7  , 200 * 53
    // const mod = 10600
    //const min = mod * 2
    // console.debug("equals", board[min], board[min + mod], board[min] ===  board[min + mod])
    //console.debug("equals2", board[min+1], board[min+1 + mod], board[min+1] ===  board[min+1 + mod])
    // console.debug("equals3", board[min+2], board[min+2 + mod], board[min+2] ===  board[min+2 + mod])

    //const mod = moves.length * 5;

    /*
    const mod = 7136912 //  53, 2862, 151739   SAMPLE: 2671,    7136912
    let lastMod = mod
    const ini = 2000

    loop: while(ini + lastMod < highestRock(board) + highestPos) {
        console.debug("trying", lastMod)
        for (let y = ini; y < ini + lastMod; y++) {
            if (board[y] !== board[y + lastMod]) {
                lastMod += mod
                continue loop
            }
        }
        console.debug("FOUND", lastMod)
        return board;
    }
    */


    //for (let y = 300; y < 30000; y += 200) console.debug(y, board[y])

    return highestRock(board) + highestPos
    //console.debug(highestRock(board) + highestPos)
    // return board;
}

/*
const mod = 200 // 53 // 151739 // 2862 // 53
const total = 0
for (let i = mod * 2, count = 0; count < 10; i += mod, count++) {
    const now = run(sampleContent, i)
    const before = run(sampleContent, i - mod)
    console.debug(i, now, now - before)
}
//const cycle = [300, 306, 303, 303, 301, 306, 301];
//let total = 308
*/

/*
// SEGUNDO
for (let z = 1; z < 30; z++) {
    const mod = 50455 * z
    const total = 0
    let before = 0
    const list: number[] = []
    for (let i = mod * 1, count = 0; count < 30; i += mod, count++) {
        const now = run(inputContent, i)
        list.push(now - before)
        before = now
        //console.debug(i, now, now - before)
    }
    console.debug(z, list)
}
//const cycle = [300, 306, 303, 303, 301, 306, 301];
//let total = 308
*/


//run(sampleContent, 1_000_000) // 1514285714288 (sample)


// run(inputContent, 2022) // 3215
// run(inputContent, 1_000_000_000_000) // ...

//const total = 1_000_000_000_000
//const mod = 53


// 1514285714288 / 53: 28571428571   

/*
// RET: ...
// 76409  , cada 50455 = 10091 * 5
const each = 50455
const cycle = [76403, 76403, 76402, 76405, 76400, 76408, 76402];
let total = 76409
let cycleIndex = -1;
let show = 0;
let i = each
for (; i <= 1_000_000_000_000 + 50_000; i+= each, cycleIndex = (cycleIndex + 1) % cycle.length, total += cycle[cycleIndex]) {
   // if (show++ % 10_000_000 === 0) console.debug(i, total)
}
*/
//console.debug(i, total)

// **** TOO LOW: 1451662504977, 1514285770486, 1514285846888: 1514285846888,   NOT CORRECT: 1514285900000
//1514285770486
//1514285846888
// 1514285900000 // PROBAR JUST INCORRECT
// 1514285870000 // JUST INCORRECT

// PENULTIMA EJEUCION i, total. 1000000037110 1514285770486
// ULTIMA1000000087565 1514285846888

// RET: 1514285714288 (sample)
// 200 308  , cada 200 
/*
const cycle = [300, 306, 303, 303, 301, 306, 301];
let total = 308
let cycleIndex = -1;
for (let i = 200; i <= 1_000_000_000_000; i+= 200, cycleIndex = (cycleIndex + 1) % cycle.length, total += cycle[cycleIndex]) {
    if (i % 1_000_000_000 === 0) console.debug(i, total)
}
*/

/*
const mod = 200
let last = 0
const list: number[] = []
for (let i = mod; i < 10_000; i+= mod) {
    const now = run(sampleContent, i)
    list.push(now - last)
    last = now
}
console.log(list)
*/

/*
const mod = 10091 * 5
let last = 0
const list: number[] = []
const total = 100
for (let i = 1; i <= total; i++) {
    const now = run(sampleContent, i * mod)
    list.push(now - last)
    console.log(now - last)
    last = now
}
console.log(list)
*/


/*
// Condicion > 200 * 8  ,
// restar 200 * 7, total += 2120
let calc1 = 1_000_000_000_000
let total1 = 0
while (calc1 > 200 * 8) {
    calc1 -= 200 * 7
    total1 += 2120
}
total1 += run(sampleContent, calc1)
console.debug(total1)
*/

/*
// Condicion > 200 * 8  ,
// restar 200 * 7, total += 2120
let calc2 = 10_000_000
let total2 = 0
while (calc2 >= 50455 * 8) {
    calc2 -= 50455 * 7
    total2 += 534823 + 21733
}
total2 += run(inputContent, calc2)
console.debug(total2)

console.debug(run(inputContent, 10_000_000))
*/
// INCORRECT: 1514285721354



//run(sampleContent, 1_000_000) // 1514285714288 (sample)




//const mod = 1 //  53, 2862, 151739   SAMPLE: 2671,    7136912

/*
let prev = run(inputContent, 100_000)
for (let i = 1; i < 200; i++) {
    const next = run(inputContent, 100_000 + 7136912 * i);
    console.debug(next - prev)
    prev = next
}
*/



console.debug(run(sampleContent, 2022)) // 3068 (sample)
console.debug(run(inputContent, 2022)) // 3215

console.debug(run(sampleContent, 100_000_000)) // 1514285714288 (sample)
console.debug(run(inputContent, 1_000_000_000_000)) // 1575811209487
