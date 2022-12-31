// Note: wrapInput assumes the face layout in my input, it may fail for other input layouts. 
// I created the die in paper to figure out the wrapping rules.
import { readFileSync } from 'fs'
import assert from 'assert';

const inputContent = readFileSync("inputs/22_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/22_sample.txt", 'utf-8')

type Info = { dir: number, ycube: number, xcube: number, yposcube: number, xposcube:number }

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
  return { grid, faceRows, faceCols, rows, cols, path }
}

function wrapSample(info: Info, size: number) : Info {
  const { dir, ycube, xcube, yposcube, xposcube } = info
  if (ycube == 1 && xcube == 3 && xposcube == 0 && dir === 0)
    return { dir: 1, ycube: ycube + 1, xcube, yposcube: xposcube, xposcube: size - yposcube - 1 }
  
  if (ycube == 0 && xcube == 2 && yposcube == 0 && dir == 1) 
    return { dir: 3, ycube: ycube + 1, xcube: 0, yposcube: size - 1, xposcube: size - xposcube - 1 }

  if (ycube == 0 && xcube == 1 && yposcube == size - 1 && dir == 3) 
    return { dir: 0, ycube, xcube: xcube + 1, yposcube: xposcube, xposcube: 0 }

    throw new Error("Wrapping not supported")
}

function wrapInput(info: Info, size: number) : Info {
  const { dir, ycube, xcube, yposcube, xposcube } = info
  if (ycube == 3 && xcube == 1 && yposcube == size - 1 && dir === 3)
    return { dir: 0, ycube: 3, xcube: 0, yposcube: xposcube, xposcube: 0 }

  if (ycube == 2 && xcube == 2 && xposcube == size - 1 && dir === 2)
    return { dir: 0, ycube: 0, xcube: 1, yposcube: size - yposcube - 1, xposcube: 0 }

  if (ycube == 0 && xcube == 0 && xposcube == size - 1 && dir === 2)
    return { dir: 0, ycube: 2, xcube: 0, yposcube: size - yposcube - 1, xposcube: 0 }

  if (ycube == 1 && xcube == 0 && yposcube == size - 1 && dir === 3)
    return { dir: 0, ycube: 1, xcube: 1, yposcube: xposcube, xposcube: 0 }

  if (ycube == 1 && xcube == 0 && xposcube == size - 1 && dir === 2)
    return { dir: 1, ycube: 2, xcube: 0, yposcube: 0, xposcube: yposcube }

  if (ycube == 1 && xcube == 2 && xposcube == 0 && dir === 0)
    return { dir: 3, ycube: 0, xcube: 2, yposcube: size - 1, xposcube: yposcube }

  if (ycube == 1 && xcube == 2 && yposcube == 0 && dir === 1)
    return { dir: 2, ycube: 1, xcube: 1, yposcube: xposcube, xposcube: size - 1 }

  if (ycube == 3 && xcube == 2 && yposcube == size - 1 && dir === 3)
    return { dir, ycube: 3, xcube: 0, yposcube, xposcube}

  if (ycube == 3 && xcube == 2 && xposcube == size - 1 && dir === 2)
    return { dir: 1, ycube: 0, xcube: 1, yposcube: 0, xposcube: yposcube }

  if (ycube == 3 && xcube == 1 && yposcube == 0 && dir === 1)
    return { dir: 2, ycube: 3, xcube: 0, yposcube: xposcube, xposcube: size - 1 }

  if (ycube == 2 && xcube == 2 && xposcube == 0 && dir === 0)
    return { dir: 2, ycube: 0, xcube: 2, yposcube: size - yposcube - 1, xposcube: size - 1 }

  if (ycube == 0 && xcube == 0 && yposcube == 0 && dir === 1)
    return { dir, ycube: 0, xcube: 2, yposcube, xposcube }

  if (ycube == 3 && xcube == 1 && xposcube == 0 && dir === 0)
    return { dir: 3, ycube: 2, xcube: 1, yposcube: size - 1, xposcube: yposcube }
    
  if (ycube == 0 && xcube == 0 && xposcube == 0 && dir === 0)
    return { dir: 2, ycube: 2, xcube: 1, yposcube: size - yposcube - 1, xposcube: size - 1 }

  throw new Error("Wrapping not supported")
}

function run(content: string, size: number, wrap?: (info: Info, size: number) => Info) {
  const { grid, faceRows, faceCols, rows, cols, path } = getBoard(content, size)
  let ylast = 0, xlast = grid[0].indexOf('.'), dirlast = 0 // DEJAR ESTE

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

          if (typeof wrap !== "undefined") {
            let ycube = Math.floor(y / size), xcube = Math.floor(x / size)
            let yposcube = y % size, xposcube = x % size

            if ( (overflow || grid[y][x] === ' ') && 
                 (yposcube === 0 || yposcube === size - 1 || xposcube === 0 || xposcube === size - 1 ) ) {

              const info = wrap({ dir, ycube, xcube, yposcube, xposcube }, size)
              y = info.ycube * size + info.yposcube
              x = info.xcube * size + info.xposcube
              dir = info.dir
            }
            assert (grid[y][x] !== ' ')
          }

        } while (grid[y][x] === ' ')
        if (grid[y][x] === '#') break
      }
      break;
  }
  console.debug(1000 * (ylast+1) + 4 * (xlast+1) + dirlast)
}

run(sampleContent, 4);                // 6032 (sample)
run(sampleContent, 4, wrapSample);    // 5031 (sample)
run(inputContent, 50);                // 109094
run(inputContent, 50, wrapInput);     // 53324
