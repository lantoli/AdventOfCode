import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/21_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/21_sample.txt", 'utf-8')

type Monkey = { name: string, expr: string, value?: number}

function getValue(map: Map<string, Monkey>, monkey: Monkey) : number {
    if (monkey.value !== undefined) return monkey.value
    const [exp1, op, exp2] = monkey.expr.split(" ")
    let ret = 0
    switch(op) {
        case "+": ret = getValue(map, map.get(exp1)!) + getValue(map, map.get(exp2)!); break
        case "-": ret =  getValue(map, map.get(exp1)!) - getValue(map, map.get(exp2)!); break
        case "*": ret = getValue(map, map.get(exp1)!) * getValue(map, map.get(exp2)!); break
        case "/": ret = Math.floor(getValue(map, map.get(exp1)!) / getValue(map, map.get(exp2)!)); break
        default: throw new Error("Unknown operator: " + op)
    }
    return monkey.value = ret
}

function getMonkeys(content: string) : Map<string, Monkey> {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    const map = new Map<string, Monkey>()
    for (const line of lines) {
        const [name, expr] = line.split(': ')
        const value = parseInt(expr)
        const monkey = { name, expr, value: isNaN(value) ? undefined : value}
        map.set(name, monkey,)
    };
    return map
}

function run1(content: string) {
    const map = getMonkeys(content)
    const root = map.get("root")!
    console.debug(getValue(map, root))
}

function run2(content: string) {
    const map = getMonkeys(content)
    const root = map.get("root")!
    const [exp1, _op, exp2] = root.expr.split(" ")
    const val2 = getValue(map, map.get(exp2)!)

    const snapshot = new Map([...map.entries()].map(([name, monkey]) => [name, monkey.value]))

    for (let num = 0; ; num ++) {
        map.get("humn")!.value = num
        if (getValue(map, map.get(exp1)!) === val2) {
            console.debug(num)
            return
        }
        if (num % 10_000 === 0) console.debug(num, val2, map.get(exp1)!.value)
        for (const monkey of map.values()) monkey.value = snapshot.get(monkey.name)
    }

    // console.debug(exp1, exp2, getValue(map, map.get(exp1)!), getValue(map, map.get(exp2)!))
}

//run1(sampleContent); // 152 (sample)
//run1(inputContent); // 194501589693264

// run2(sampleContent); // 301 (sample)
run2(inputContent); // 301 TOO LOW

