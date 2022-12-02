import { readFileSync } from 'fs';

type Round = {you: number, me: number};
type HandResult = (round: Round) => number;

const inputContent = readFileSync("02_input.txt", 'utf-8');
const lines = inputContent.split('\n');
lines.pop(); // Remove last empty line
const rounds: Round[] = lines.map(line => line.split(' '))
                .map(([a, b]) => a == "A" ? [1, b] : a == "B" ? [2, b] : [3, b])
                .map(([a, b]) => b == "X" ? [a, 1] : b == "Y" ? [a, 2] : [a, 3])
                .map(([a, b]) => ({ you: Number(a), me: Number(b) }));
 
function run(handle: HandResult) {
    const result = rounds.map(handle).reduce((a, b) => a + b);
    console.debug(result);
};

function handResult1({you, me}: Round) : number {
    const winPoints = (you == me) ? 3 : (you - me == -1 || you - me == 2) ? 6 : 0;
    return winPoints + me;
}

function handResult2({you, me}: Round) : number {
    if (me == 1) { // lose
        return (you - 1 - 3) % 3 + 3;
    } else if (me == 2) { // draw
        return 3 + you;
    } else { // win
        return 6 + you % 3 + 1;
    }
}

run(handResult1); // 9651
run(handResult2); // 10560
