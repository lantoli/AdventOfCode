import { readFileSync } from 'fs'
import assert from 'assert'

const inputContent = readFileSync("inputs/24_input.txt", 'utf-8')
const sample1Content = readFileSync("inputs/24_sample1.txt", 'utf-8')
const sample2Content = readFileSync("inputs/24_sample2.txt", 'utf-8')

const dirs = [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
const dirChars = ["^", "v", "<", ">"]

const mcm = (a: number, b: number): number => (a * b) / mcd(a, b);
const mcd = (a: number, b: number): number => (b === 0) ? a : mcd(b, a % b);

function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    const rows = lines.length
    const cols = lines[1].length
    const cycle = mcm(rows - 2, cols - 2)
    const mod = Math.max(cols, rows, cycle) + 2 // small safety margin
    const fromCoord = (y: number, x: number) => y * mod + x
    const toCoord = (n: number) => [Math.floor(n / mod), n % mod]
    
    function allowed(minute: number, y: number, x: number) {
        if (x <= 0 || x >= cols - 1 || y < 0 || y > cols - 1) return false
        if (y === 0 && x !== 1) return false
        if (y === rows - 1 && x !== cols - 2) return false
        return !history[minute % cycle].some(dir => dir.includes(fromCoord(y, x)))
    }

    const iniBlizzard: number[][] = new Array(dirs.length).fill(0).map(() => [])
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const ch = lines[y][x]
        const dirIndex = dirChars.indexOf(ch)
        if (dirIndex != -1) iniBlizzard[dirIndex].push(fromCoord(y, x)) 
    }

    const history: number[][][] = [iniBlizzard]
    for (let idxHistory = 1; idxHistory <= cycle; idxHistory++) {
        const prev = history[idxHistory - 1]
        const current: number[][] = new Array(dirs.length).fill(0).map(() => [])
        history.push(current)

        for (let idx in dirs) {
            const [yinc, xinc] = dirs[idx]
            for (const coord of prev[idx]) {
                const [y, x] = toCoord(coord)
                const [newy, newx] = [(y + yinc - 1 + rows - 2) % (rows - 2) + 1, (x + xinc - 1 + cols - 2) % (cols - 2) + 1]
                //console.debug("old", y, x, "new", newy, newx, "dir", yinc, xinc)
                current[idx].push(fromCoord(newy, newx))
            }
        }
    }
    
    const ini = fromCoord(0, 1), end = fromCoord(rows - 1, cols - 2)

    let states = new Set([ini])
    outer: for (var minute = 1; ; minute++) {
        //console.debug("minute", minute, "states", states)
        const newStates = new Set<number>();
        for (const state of states) {
            // console.debug("state", state.minute, toCoord(state.coord), state.path.map(toCoord).join(" ") , "min", min)
            const [y, x] = toCoord(state)

            // console.debug("coord", toCoord(state.coord), "newMinute", newMinute, "min", min)
            for (const [yinc, xinc] of dirs) {
                const [ynew, xnew] = [y + yinc, x + xinc]
                if (allowed(minute, ynew, xnew)) {
                    const newState = fromCoord(ynew, xnew)
                    if (newState === end) break outer;
                    newStates.add(newState)
                }
            }

            if (allowed(minute, y, x)) newStates.add(state)
        }
        states = newStates
    }
    //console.debug("choosen", choosen, choosen.path.map(toCoord).join(" "))
    //console.debug("xini, xend", xini, xend)

    console.debug(minute)
}

run(sample1Content) // 10  (sample 1)
run(sample2Content) // 18 (sample 2)
run(inputContent) // 255
