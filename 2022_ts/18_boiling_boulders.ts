import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/18_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/18_sample.txt", 'utf-8');

const incs = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]

function fromCube(max: number, cube: number) : number[] {
    const x = Math.floor(cube / (max * max))
    const y = Math.floor((cube - x * max * max) / max)
    const z = cube - x * max * max - y * max
    return [x, y, z]
}

function toCube(max: number, [x, y, z]: [number, number, number]) : number {
    return x * max * max + y * max + z
}

function run1(content: string) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const input = lines.map(line => line.split(",").map(x => Number(x)))

    const max = input.flat().reduce((a, b) => Math.max(a, b)) + 2

    // console.debug(max)

    const cubes = new Set<number>(input.map(([x, y, z]) => toCube(max, [x+1, y+1, z+1])))

    let total = 0
    for (let cube of cubes) {
        const [x, y, z] = fromCube(max, cube)
        total += 6 - incs.filter(([xinc, yinc, zinc]) => cubes.has(toCube(max, [x + xinc, y + yinc, z + zinc]))).length
    }

    console.debug(total)

};

run1(sampleContent); // 64 (sample)
run1(inputContent); // 4242
