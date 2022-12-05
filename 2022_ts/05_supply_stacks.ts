import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/05_input.txt", 'utf-8');
const lines = inputContent.split('\n');
lines.pop(); // Remove last empty line

type Move = { move: number, from: number, to:number };
type Stacks = string[][];

const originalStacks: Stacks = [
    [ "N", "D", "M", "Q", "B", "P", "Z"],
    [ "C", "L", "Z", "Q", "M", "D", "H", "V"],
    [ "Q", "H", "R", "D", "V", "F", "Z", "G" ],
    [ "H", "G", "D", "F", "N"],
    [ "N", "F", "Q" ],
    [ "D", "Q", "V", "Z", "F", "B", "T" ],
    [ "Q", "M", "T", "Z", "D", "V", "S", "H"], 
    [ "M", "G", "F", "P", "N", "Q"],
    [ "B", "W", "R", "M"]
];

const moves: Move[] = lines.filter(line => line.startsWith("move")).map(line => line.replaceAll(/move |from |to /g, "")).
    map(numbers => numbers.split(" ")).map(n => ({ move: Number(n[0]), from: Number(n[1]) - 1, to: Number(n[2]) - 1 }));

const moveOne1 = (stacks: Stacks, move: Move) => { 
    for (let i = 0; i < move.move; i++) {
        stacks[move.to].push(stacks[move.from].pop()!) 
    }
};

const moveOne2 = (stacks: Stacks, move: Move) => { 
    const temp: string[] = [];
    for (let i = 0; i < move.move; i++) {
        temp.push(stacks[move.from].pop()!) 
    }
    for (let i = 0; i < move.move; i++) {
        stacks[move.to].push(temp.pop()!) 
    }
};

function run(moveOne: (stacks: Stacks, move: Move) => void) {
    const clone = (input: string[]) => input.map(elm => elm);
    const stacks = originalStacks.map(elm => clone(elm));
    for (let move of moves) {
        moveOne(stacks, move);
    }
    const result = stacks.map(stack => stack.pop()!).join(""); 
    console.debug(result);
};

run(moveOne1); // QGTHFZBHV
run(moveOne2); // MGDMPSZTM
