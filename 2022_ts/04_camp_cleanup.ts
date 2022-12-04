import { readFileSync } from 'fs';

type Coords = [number, number][];
const LEFT = 0, RIGHT = 1;

const inputContent = readFileSync("inputs/04_input.txt", 'utf-8');
const lines = inputContent.split('\n');
lines.pop(); // Remove last empty line

const hasOverlap1 = ([r1, r2]: Coords) => r1[RIGHT] >= r2[RIGHT];
const hasOverlap2 = ([r1, r2]: Coords) => r1[RIGHT] >= r2[LEFT];

function leftBiggerFirst([r1, r2]: Coords) : Coords {
    return (r1[LEFT] < r2[LEFT]) || (r1[LEFT] == r2[LEFT] && r1[RIGHT] >= r2[RIGHT]) ? [r1, r2] : [r2, r1];
}

function coords(line:string) : Coords {
    return line.split(',').map(elm => elm.split('-')).map(elm => [Number(elm[LEFT]), Number(elm[RIGHT])]);
}

function run(hasOverlap : (coords: Coords) => boolean) {
   const result = lines.map(coords).map(leftBiggerFirst).filter(hasOverlap).length; 
   console.debug(result);
};

run(hasOverlap1); // 657
run(hasOverlap2); // 938
