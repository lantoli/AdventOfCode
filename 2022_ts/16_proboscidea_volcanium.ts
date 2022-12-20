import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/16_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/16_sample.txt", 'utf-8');

type Valve = { name: string; rate: number; children: string[]; };
type Player = { current: Valve, visited: Set<string> };
type State = { me: Player, open: Set<string>, pressure: number, minute: number, remainRate: number };

function run(content: string, minutes: number, withHelp: boolean) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const valves: Valve[] = lines.map(line => {
        const [_full, name, rate, children] = line.match(/Valve (.*) has flow rate=(.*); tunnels? leads? to valves? (.*)/)!;
        return { name, rate: Number(rate), children: children.split(", ") }
    });
    
    const remainRate = valves.map(valve => valve.rate).reduce((a, b) => a + b);
    const first = valves.find(v => v.name === "AA")!;
    const me: Player = { current: first, visited: new Set([first.name]) };
    const states: State[] = [{ me, open: new Set(), pressure: 0, minute: 1, remainRate }];


    let maxMinute = 0;

    let ret = 0;
    while (states.length > 0) {
        const {me, open, pressure, minute, remainRate} = states.pop()!;
        const newMinute = minute + 1;
        const remainingMinutes = minutes - newMinute + 1;
        const optimistic = remainRate * remainingMinutes;
        if (optimistic <= 0 || ret > pressure + optimistic || open.size === valves.length) continue;
        
        if (me.current.rate > 0 && !open.has(me.current.name)) {
            const newPressure = me.current.rate * remainingMinutes;
            const newMe = { current: me.current, visited: new Set([me.current.name]) };
            const newState: State = { me: newMe, open: new Set([me.current.name, ...open]), 
                pressure: pressure + newPressure, minute: newMinute, remainRate: remainRate - me.current.rate };
            states.push(newState);

            if (newState.pressure > ret) { ret = newState.pressure; console.debug("PRESSURE", ret); }

            //ret = Math.max(ret, newState.pressure);
            // console.debug(minute, pressure, newPressure, newState);    
            if (minute+1 > maxMinute) { maxMinute = minute+1; console.debug("max1", maxMinute); }
        }

        for (let child of me.current.children) if (!me.visited.has(child)) {
            const newValve = valves.find(v => v.name === child)!;
            const newMe = { current: newValve, visited: new Set([child, ...me.visited]) };
            const newState = { me: newMe, current: newValve, open, pressure, minute: newMinute, remainRate };
            states.push(newState);
        }
    }
    console.debug(ret);
};

//run(sampleContent, 30, false); // 1651 (sample)

run(sampleContent, 26, true); // 1707 (sample) TEMPORAL 1327

//run(inputContent, 30, false); // 2029
//run(inputContent, 26, true); // ...
