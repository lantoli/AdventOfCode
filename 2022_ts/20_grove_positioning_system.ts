import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/20_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/20_sample.txt", 'utf-8')


function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    const list = lines.map(Number)

    // console.debug(list)

    const mod = list.length

    for (let n of [...list]) {
        let current = list.indexOf(n)
        // console.debug("index", idx, n)
        n %= mod
        if (n < 0) n += mod - 1

        let future = current + n
        if (future >= mod) future -= mod - 1

        // if (future < 0) future += mod
        
        // console.debug(n, current, future, list)

        const inc = Math.sign(future - current)
        while (future != current) {
            [ list[current], list[current + inc] ] = [ list[current + inc], list[current] ]
            current += inc
        }

        // console.debug("after", list)

        /*
        if (n < 0) n += mod - 1
       //  console.debug("new", n)
        for (let move = 0; move < n; move ++) {
            const idxNext = (idx + 1) % mod

            if (idxNext == 0) {
                list.unshift(list.pop()!)
              //  console.debug("skip", idx, idxNext, list)
                move--
            } else {
                const temp = list[idxNext]
                list[idxNext] = list[idx]
                list[idx] = temp
              //  console.debug("move", idx, idxNext, list)
            }
            idx = idxNext
            //[ list[idx], list[idxNext] ] = [ list[idxNext], list[idx] ]
        }
        */
     //   console.debug(n, list)
     //   console.debug()
        // break;
    }

    const idx0 = list.indexOf(0)

    const n1 = list[(1000 + idx0) % mod]
    const n2 = list[(2000 + idx0) % mod]
    const n3 = list[(3000 + idx0) % mod]
    console.debug(mod, n1, n2, n3, n1 + n2 + n3)
}

run(sampleContent); // 3 (sample)
run(inputContent); // 4827 too high -> too 4827

