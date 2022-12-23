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

function run(content: string) {
    const map = getMonkeys(content)
    const root = map.get("root")!
    console.debug(getValue(map, root))
}

run(sampleContent); // 152 (sample)
run(inputContent); // 194501589693264

