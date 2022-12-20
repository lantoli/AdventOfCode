import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/16_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/16_sample.txt", 'utf-8');

type Valve = { name: string; rate: number; children: string[]; };
type State = { current: Valve, open: Set<string>, visited: Set<string>, pressure: number, minute: number, remainRate: number };

function run(content: string, minutes: number) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const valves: Valve[] = lines.map(line => {
        const [_full, name, rate, children] = line.match(/Valve (.*) has flow rate=(.*); tunnels? leads? to valves? (.*)/)!;
        return { name, rate: Number(rate), children: children.split(", ") }
    });
    
    const remainRate = valves.map(valve => valve.rate).reduce((a, b) => a + b);
    const first = valves.find(v => v.name === "AA")!;
    const states: State[] = [{ current: first, open: new Set(), visited: new Set([first.name]), pressure: 0, minute: 1, remainRate }];

    let maxMinute = 0;

    let ret = 0;
    while (states.length > 0) {
        const {current, open, visited, pressure, minute, remainRate} = states.pop()!;
        
        const newMinute = minute + 1;
        const remainingMinutes = minutes - newMinute + 1;

        //const toOpen = valves.filter(valve => !open.has(valve.name) && valve.rate > 0);
        //const valOpen = toOpen.map(v => v.rate).reduce((a, b) => a + b, 0);
        const optimistic = remainRate * remainingMinutes;
        //console.debug("SEE", minute, pressure, ret, pressure + optimistic);
        if (optimistic <= 0 || ret > pressure + optimistic || open.size === valves.length) continue;
        

        if (current.rate > 0 && !open.has(current.name)) {
            const newPressure = current.rate * remainingMinutes;
            const newState: State = { current, open: new Set([current.name, ...open]), 
                visited: new Set([current.name]), pressure: pressure + newPressure, minute: newMinute, remainRate: remainRate - current.rate };
            states.push(newState);

            if (newState.pressure > ret) { ret = newState.pressure; console.debug("PRESSURE", ret); }

            //ret = Math.max(ret, newState.pressure);
            // console.debug(minute, pressure, newPressure, newState);    
            if (minute+1 > maxMinute) { maxMinute = minute+1; console.debug("max1", maxMinute); }
        }

        for (let child of current.children) if (!visited.has(child)) {
            const newValve = valves.find(v => v.name === child)!;
            if (newMinute < minutes) {
                if (newMinute > maxMinute) { maxMinute = newMinute; console.debug("max2", maxMinute); }
                const newState = { current: newValve, open, visited: new Set([child, ...visited]), pressure, minute: newMinute, remainRate };
                states.push(newState);
            }
        }
    }
    console.debug(ret);
};

run(sampleContent, 30); // 1651 (sample)

// run(sampleContent, 26); // 1707 (sample)

run(inputContent, 30); // 2029
//run(inputContent, 26); // ...
