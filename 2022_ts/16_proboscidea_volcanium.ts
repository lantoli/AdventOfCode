import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/16_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/16_sample.txt", 'utf-8');

type Valve = { name: string; rate: number; children: string[]; };
type State = { current: Valve, open: Set<string>, pressure: number, minute: number };

function run(content: string) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const valves: Valve[] = lines.map(line => {
        const [_full, name, rate, children] = line.match(/Valve (.*) has flow rate=(.*); tunnels? leads? to valves? (.*)/)!;
        return { name, rate: Number(rate), children: children.split(", ") }
    });
    
    const first = valves.find(v => v.name === "AA")!;
    const states: State[] = [{ current: first, open: new Set([first.name]), pressure: 0, minute: 1 }];

    const minutes = 30;

    let maxMinute = 0;

    let ret = 0;
    while (states.length > 0) {
        const {current, open, pressure, minute} = states.shift()!;
        if (open.size === valves.length) continue;
        for (let child of current.children) {
            const newValve = valves.find(v => v.name === child)!;
            if (!open.has(child) && newValve.rate > 0) {
                const newMinute = minute + 2;
                if (newMinute < minutes) {
                    const newPressure = newValve.rate * (minutes - newMinute + 1);
                    const newState = { current: newValve, open: new Set([child, ...open]), pressure: pressure + newPressure, minute: newMinute };
                    states.push(newState);
                    ret = Math.max(ret, newState.pressure);
                    // console.debug(minute, pressure, newPressure, newState);    
                    if (newMinute > maxMinute) { maxMinute = newMinute; console.debug("max1", maxMinute); }
                }    
            }

            const newMinute = minute + 1;
            if (newMinute < minutes) {
                if (newMinute > maxMinute) { maxMinute = newMinute; console.debug("max2", maxMinute); }
                const newState = { current: newValve, open: new Set([...open]), pressure, minute: newMinute };
                states.push(newState);
        }
        }
    }
    console.debug(ret);
};

run(sampleContent); // 1651 (sample)
