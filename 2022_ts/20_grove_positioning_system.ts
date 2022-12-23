import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/20_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/20_sample.txt", 'utf-8')


function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    let list = lines.map(Number)
    //list = list.slice(0, 10)

    // console.debug(list)



    const mod = list.length
    // console.debug("mod", mod)

    // console.debug("before", list)
    for (let n of [...list]) {
        let idx = list.indexOf(n)
        const dir = Math.sign(n)
        const times = Math.abs(n % mod)
        // console.debug("times", n, idx, dir, times)

        for (let time = 0; time < times; time++) {

            let idxNext = idx + dir

            // console.debug("time", time, idx, idxNext, list[idx], list[idxNext])

            if (idx == 0 && dir == -1) {
                list.push(list.shift()!)
                idx = mod - 1
                idxNext = idx - 1
            }

            if (idx == mod - 1 && dir == 1) {
                list.unshift(list.pop()!)
                idx = 0
                idxNext = idx + 1
            }

            const temp = list[idxNext]
            list[idxNext] = list[idx]
            list[idx] = temp

            idx = idxNext

        }

        if (idx == 0 && dir == -1) {
            list.push(list.shift()!)
        }

        if (idx == mod - 1 && dir == 1) {
            list.unshift(list.pop()!)
        }

        // console.debug("middle", list)
        //break;
    }
    // console.debug("after", list)

    const idx0 = list.indexOf(0)

    const n1 = list[(1000 + idx0) % mod]
    const n2 = list[(2000 + idx0) % mod]
    const n3 = list[(3000 + idx0) % mod]
    console.debug(mod, n1, n2, n3, n1 + n2 + n3)
}

run(sampleContent); // 3 (sample)
run(inputContent); // 4827 too high -> otra vez 4827 (3201 + -6194 + 7820)
// 11036 = 6830 +  -2575 +  6781 TOO HIGH