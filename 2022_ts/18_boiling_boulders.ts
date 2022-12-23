import { debug } from 'console';
import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/18_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/18_sample.txt", 'utf-8');

const incs = [ [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1] ]

function run(content: string) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const input = lines.map(line => line.split(",").map(x => Number(x)))

    const max = input.flat().reduce((a, b) => Math.max(a, b)) + 2

    // console.debug(max)

    const cubes = new Set<number>(input.map(([x, y, z]) =>  (x + 1) * max * max + (y + 1) * max + (z + 1)))

    let total = 0
    for (let cube of cubes) {
        const x = Math.floor(cube / (max * max))
        const y = Math.floor((cube - x * max * max) / max)
        const z = cube - x * max * max - y * max
        total += 6 - incs.filter(([xinc, yinc, zinc]) => cubes.has((x + xinc) * max * max + (y + yinc) * max + (z + zinc))).length
    }

    console.debug(total)

};

run(sampleContent); // 64 (sample)
run(inputContent); // 4242
