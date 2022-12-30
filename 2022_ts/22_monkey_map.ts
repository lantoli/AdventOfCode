// NOTE: Part 1 is not working yet
import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/22_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/22_sample.txt", 'utf-8')

const incs = [ [0, 1], [1, 0], [0, -1], [-1, 0]  ];

function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    const board: string[] = lines.slice(0, lines.length - 2)
    const path = lines[lines.length - 1]

    let y = 0, x = lines[0].indexOf('.')
    let dir = 0

    // console.debug(y, x, dir)

    for (let i = 0; i < path.length; i++) {
        if (path[i] === 'L') {
            dir = (dir + 3) % 4
        } else if (path[i] === 'R') {
            dir = (dir + 1) % 4
        } else {
            let moves = 0
            while (i < path.length && path[i] !== 'L' && path[i] !== 'R') {
              moves = moves * 10 + path[i++].charCodeAt(0) - '0'.charCodeAt(0)
            }
            i--
            const [yinc, xinc] = incs[dir]
            for (let move = 0; move < moves; move++) {
              let yend = y + yinc
              let xend = x + xinc
              if (yend == -1) {
                yend = board.length - 1
                while (xend >= board[yend].length) yend--;
              }
              if (yend == board.length) {
                yend = 0
                while (xend >= board[yend].length) yend++;
              }
              if (xend == -1) xend = board[yend].length - 1
              if (xend == board[yend].length) xend = 0
              // console.debug("move ini", move, y, x, yend, xend, board[yend][xend], board[yend].length)
              while (board[yend][xend] === ' ') {
                yend += yinc
                xend += xinc
                if (yend == -1) yend = board.length - 1
                if (yend == board.length) yend = 0
                if (xend == -1) xend = board[yend].length - 1
                if (xend == board[yend].length) xend = 0
              }
              // console.debug("move ini adj", move, y, x, yend, xend)
              if (board[yend][xend] === '#') break;
              y = yend; x = xend
            }
            console.debug("moves", moves, "coord", y+1, x+1)
            // console.debug("pos", y, x)
        }
    }

    console.debug(y+1, x+1, dir, 1000 * (y+1) + 4 * (x+1) + dir)
  }

//run(sampleContent); // 6032 (sample)
run(inputContent); // 179210
