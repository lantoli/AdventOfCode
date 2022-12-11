import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/10_input.txt", 'utf-8');
//const inputContent = readFileSync("inputs/10_sample.txt", 'utf-8');
const lines = inputContent.split('\n');
lines.pop(); // Remove last empty line

const wide = 40, high = 6;

const state = {
    x: 1,
    cycle: 0,
    process() { this.process1(); this.process2(); },

    when: [20, 60, 100, 140, 180, 220],
    values: [] as number[],
    process1() { if (this.cycle == this.when[this.values.length]) this.values.push(this.x) },
    result1() { console.log(this.when.map((w, idx) => w * this.values[idx]).reduce((a, b) => a + b)) },

    crt: new Array(wide * high).fill(false) as boolean[],
    process2() {
        const pos = this.cycle - 1;
        const posLine = pos % wide;
        const [from, to] = [Math.max(0, this.x - 1), Math.min(wide - 1, this.x + 1)];
        if (posLine >= from && posLine <= to) this.crt[pos] = true;
    },
    result2() {
        this.crt.forEach((val, idx) => {
            if (idx > 0 && idx % wide == 0) process.stdout.write("\n");
            process.stdout.write(val ? "#" : ".");
        });
        process.stdout.write("\n")
    }
};

function run() {
    for (var line of lines) {
        const [instr, arg] = line.split(" ");
        if (instr === "noop") {
            state.cycle++;
            state.process();
        } else if (instr === "addx") {
            state.cycle++;
            state.process();
            state.cycle++;
            state.process();
            state.x += Number(arg);
        } else throw new Error("unexpected");
    }
    state.result1();
    state.result2();
};

run(); // 15360, PHLHJGZA
/*
###..#..#.#....#..#...##..##..####..##..
#..#.#..#.#....#..#....#.#..#....#.#..#.
#..#.####.#....####....#.#......#..#..#.
###..#..#.#....#..#....#.#.##..#...####.
#....#..#.#....#..#.#..#.#..#.#....#..#.
#....#..#.####.#..#..##...###.####.#..#.
*/
