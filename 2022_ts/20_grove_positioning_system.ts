import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/20_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/20_sample.txt", 'utf-8')

function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    let list = lines.map((line, index) => [Number(line), index])
    //list = list.slice(0, 10)
    // console.debug(list)

    const mod = list.length
    
    console.debug("before", list.map(([n, _]) => n))
    for (let i = 0; i < list.length; i++) {
        const initIdx = list.findIndex(([_, index]) => index === i)!
        const initN = list[initIdx][0]
        const n = list[initIdx][0] % (mod -1)
        let finalIdx = initIdx + n
        if (finalIdx > mod - 1) finalIdx -= mod - 1
        if (finalIdx <= 0) finalIdx += mod - 1
        const dir = Math.sign(finalIdx - initIdx)
        for (let times = 0; times < Math.abs(finalIdx - initIdx); times++) {
            [list[initIdx + dir * times], list[initIdx + dir * (times + 1)]] = [list[initIdx + dir * (times + 1)], list[initIdx + dir * times]]
        }
        console.debug("middle", initN, list.map(([n, _]) => n))
    }
    console.debug("after", list.map(([n, _]) => n))

    const idx0 = list.findIndex(([n, _]) => n === 0)

    const n1 = list[(1000 + idx0) % mod][0]
    const n2 = list[(2000 + idx0) % mod][0]
    const n3 = list[(3000 + idx0) % mod][0]

    console.debug("indexes", mod, idx0, (1000 + idx0) % mod, (2000 + idx0) % mod, (3000 + idx0) % mod)

    console.debug(mod, n1, n2, n3, n1 + n2 + n3)
}

run(sampleContent); // 3 (sample)
run(inputContent); // 3700

