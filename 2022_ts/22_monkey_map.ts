// Part 2 not done yet
import { readFileSync } from 'fs'
import assert from 'assert';

const inputContent = readFileSync("inputs/22_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/22_sample.txt", 'utf-8')

const incs = [ [0, 1], [1, 0], [0, -1], [-1, 0]  ];

function getBoard(content: string, size: number) {
  const lines = content.split('\n')
  lines.pop() // Remove last empty line
  const grid: string[] = lines.slice(0, lines.length - 2)
  const path = lines[lines.length - 1]

  assert(grid.length % size === 0)
  const faceRows = Math.floor(grid.length / size)
  const faceCols = Math.floor(12 / faceRows)
  const rows = faceRows * size
  const cols = faceCols * size
  for (let i = 0; i < grid.length; i++) {
    assert(grid[i].length % size === 0)
    assert(grid[i].length <= cols)
    grid[i] += ' '.repeat(cols - lines[i].length)
    assert(grid[i].length == cols)
  }
  // console.debug("check sizes",faceRows, faceCols, rows, cols)
  return { grid, faceRows, faceCols, rows, cols, path }
}

function run(content: string, size: number) {
  const { grid, faceRows, faceCols, rows, cols, path } = getBoard(content, size)
  let y = 0, x = grid[0].indexOf('.'), dir = 0

  for (let i = 0; i < path.length; ) switch(path[i]) {
    case 'L': dir = (dir + 3) % 4; i++; break;
    case 'R': dir = (dir + 1) % 4; i++; break;
    default: 
      for (var moves = 0; i < path.length && path[i] !== 'L' && path[i] !== 'R'; i++) {
        moves = moves * 10 + path[i].charCodeAt(0) - '0'.charCodeAt(0)
      }
      for (let move = 0, yend = y, xend = x; move < moves; move++, y = yend, x = xend) {
        // console.debug("move ini", move, y, x, yend, xend, board[yend][xend])
        do {
          yend += incs[dir][0]; xend += incs[dir][1]
          if (yend == -1) yend = rows - 1
          if (yend == rows) yend = 0
          if (xend == -1) xend = cols - 1
          if (xend == cols) xend = 0
        } while (grid[yend][xend] === ' ')
        // console.debug("move ini adj", move, y, x, yend, xend)
        if (grid[yend][xend] === '#') break
      }
      // console.debug("moves", moves, "coord", y+1, x+1)
      // console.debug("pos", y, x)
      break;
  }

  console.debug(y+1, x+1, dir, 1000 * (y+1) + 4 * (x+1) + dir)
}

run(sampleContent, 4); // 6032 (sample)
run(inputContent, 50); // 109094

run(sampleContent, 4); // 5031 (sample) PART 2
