import { readFileSync } from 'fs';

const inputContent = readFileSync("01_input.txt", 'utf-8');
const lines = inputContent.split('\n');

function part1() {
    let total = 0, max = 0;
    for (let line of lines) {
        const val = +line;
        total = val === 0 ? 0 : total + val;
        max = Math.max(max, total);
    }

    console.debug(max); // 67027 
};

function part2() {
    let total = 0;
    let list: number[] = []; // We could use a Heap but problem is small

    for (let line of lines) {
        const val = +line;
        if (val == 0) {
            list.push(total);
            total = 0;
        } else {
            total += val;
        }
    }
    const s = list.sort((a, b) => a - b);
    console.debug(s.pop()! + s.pop()! + s.pop()!); // 197291
};

part2();
