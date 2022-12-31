// Part 2 not done yet
import { appendFile, readFileSync } from 'fs'
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

function run(content: string, size: number, isCube: boolean) {
  const { grid, faceRows, faceCols, rows, cols, path } = getBoard(content, size)
  let ylast = 0, xlast = grid[0].indexOf('.'), dirlast = 0 // DEJAR ESTE
  // let ylast = 5, xlast = 6, dirlast = 3
  console.debug("INI", ylast+1, xlast+1, dirlast)

  for (let i = 0; i < path.length; ) switch(path[i]) {
    case 'L': dirlast = (dirlast + 3) % 4; i++; break;
    case 'R': dirlast = (dirlast + 1) % 4; i++; break;
    default: 
      for (var moves = 0; i < path.length && path[i] !== 'L' && path[i] !== 'R'; i++) {
        moves = moves * 10 + path[i].charCodeAt(0) - '0'.charCodeAt(0)
      }
      const dirborrar = dirlast, xborrar = xlast, yborrar = ylast
      for (let move = 0, y = ylast, x = xlast, dir = dirlast; move < moves; move++, ylast = y, xlast = x, dirlast = dir) {
        do {
          y += incs[dir][0]; x += incs[dir][1]
          let overflow = false
          if (y == -1) { y = rows - 1; overflow = true }
          if (y == rows) { y = 0; overflow = true }
          if (x == -1) { x = cols - 1; overflow = true }
          if (x == cols) { x = 0; overflow = true }

          if (isCube) {
            let ycube = Math.floor(y / size), xcube = Math.floor(x / size)
            let yposcube = y % size, xposcube = x % size

            // console.debug("move", move, y, x, dir, grid[y][x], "cube", ycube, xcube, yposcube, xposcube)

            if ( (overflow || grid[y][x] === ' ') && 
                 (yposcube === 0 || yposcube === size - 1 || xposcube === 0 || xposcube === size - 1 ) ) {
              let applied = false

              if (ycube == 1 && xcube == 3 && xposcube == 0) {
                applied = true
                console.debug("ACTIVANDO 1", ycube, xcube, yposcube, xposcube, dir, y+1, x+1)
                assert(dir === 0)
                xposcube = size - yposcube - 1
                yposcube = 0
                ycube++

                dir = 1
                y = ycube * size + yposcube
                x = xcube * size + xposcube
                console.debug("NUEVO", dir, y+1, x+1)
              }

              if (ycube == 0 && xcube == 2 && yposcube == 0) {
                applied = true
                console.debug("ACTIVANDO 2", ycube, xcube, yposcube, xposcube, dir, y+1, x+1)
                assert(dir === 1)
                yposcube = size - 1
                xposcube = size - xposcube - 1
                ycube = 1
                xcube = 0

                dir = 3
                y = ycube * size + yposcube
                x = xcube * size + xposcube
                console.debug("NUEVO", dir, y+1, x+1)
              }

              if (ycube == 0 && xcube == 1 && yposcube == size - 1) {
                applied = true
                console.debug("ACTIVANDO 3", ycube, xcube, yposcube, xposcube, dir, y+1, x+1)
                assert(dir === 3)
                yposcube = xposcube
                xposcube = 0
                xcube++

                dir = 0
                y = ycube * size + yposcube
                x = xcube * size + xposcube
                console.debug("NUEVO", dir, y+1, x+1, grid[y][x])
              }
              if (!applied) {
                console.debug("NO RULE", ycube, xcube, yposcube, xposcube, dir, y+1, x+1, grid[y][x])
              }
            }
          }
        } while (!isCube && grid[y][x] === ' ')
        // console.debug("move ini adj", move, y, x, yend, xend)
        if (grid[y][x] === '#') break
      }
      // console.debug("moves", moves, "coord", y+1, x+1)
      // console.debug("pos", y, x)
      console.debug("from", yborrar+1, xborrar+1, dirborrar, "to", ylast+1, xlast+1, dirlast)
      break;
  }

  console.debug(ylast+1, xlast+1, dirlast, 1000 * (ylast+1) + 4 * (xlast+1) + dirlast)
}

// run(sampleContent, 4, false); // 6032 (sample)
// run(inputContent, 50, false); // 109094

run(sampleContent, 4, true); // 5031 (sample) PART 2
