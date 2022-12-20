import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/16_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/16_sample.txt", 'utf-8');

type Valve = { name: string; rate: number; childNames: string[]; children: Valve[] };
type Player = { current: Valve, visited: Set<string> };
type State = { me: Player, el: Player, open: Set<string>, pressure: number, minute: number, remainRate: number };

function run(content: string, minutes: number, withElephant: boolean) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const valves: Valve[] = lines.map(line => {
        const [_full, name, rate, childName] = line.match(/Valve (.*) has flow rate=(.*); tunnels? leads? to valves? (.*)/)!;
        return { name, rate: Number(rate), childNames: childName.split(", "), children: [] };
    });
    for (let valve of valves) {
        valve.children = valve.childNames.map(name => valves.find(v => v.name === name)!);
    }
    
    const remainRate = valves.map(valve => valve.rate).reduce((a, b) => a + b);
    const firstValve = valves.find(v => v.name === "AA")!;
    const firstPlayer: Player = { current: firstValve, visited: new Set([firstValve.name]) };
    const states: State[] = [{ me: firstPlayer, el: firstPlayer, open: new Set(), pressure: 0, minute: 1, remainRate }];

    let maxMinute = 0;

    let ret = 0;
    while (states.length > 0) {
        const {me, el, open, pressure, minute, remainRate} = states.pop()!;
        const newMinute = minute + 1;
        const remainingMinutes = minutes - newMinute + 1;
        const optimistic = remainRate * remainingMinutes;
        if (optimistic <= 0 || ret > pressure + optimistic || open.size === valves.length) continue;

        const newMes: Player[] = me.current.children.filter(child => !me.visited.has(child.name)).map(child => 
            ({ current: child, visited: new Set([child.name, ...me.visited])}));

        const newEls: Player[] = el.current.children.filter(child => !el.visited.has(child.name)).map(child => 
            ({ current: child, visited: new Set([child.name, ...el.visited])}));

        const openMe = me.current.rate > 0 && !open.has(me.current.name);
        const openEl = el.current.rate > 0 && !open.has(el.current.name);

        if (openMe) {
            const newPressure = me.current.rate * remainingMinutes;
            const newMe: Player = { current: me.current, visited: new Set([me.current.name]) };
            let newState: State = { me: newMe, el, open: new Set([me.current.name, ...open]), 
                pressure: pressure + newPressure, minute: newMinute, remainRate: remainRate - me.current.rate };
            ret = Math.max(ret, newState.pressure);

            if (withElephant && openEl && me.current !== el.current) {
                const newPressure = el.current.rate * remainingMinutes;
                const newEl: Player = { current: el.current, visited: new Set([el.current.name]) };
                states.push({...newState, el: newEl, open: new Set([el.current.name, ...newState.open]), 
                    pressure: newState.pressure + newPressure, remainRate: newState.remainRate - el.current.rate });
                ret = Math.max(ret, newState.pressure + newPressure);
            }

            if (!withElephant || newEls.length == 0) {
                states.push(newState);
            } else for (let newEl of newEls) {
                states.push({...newState, el: newEl });
            }
        }

        if (withElephant && openEl) {
            const newPressure = el.current.rate * remainingMinutes;
            const newEl: Player = { current: el.current, visited: new Set([el.current.name]) };
            let newState: State = { me, el: newEl, open: new Set([el.current.name, ...open]), 
                pressure: pressure + newPressure, minute: newMinute, remainRate: remainRate - el.current.rate };
            ret = Math.max(ret, newState.pressure);

            if (openMe && me.current !== el.current) {
                const newPressure = me.current.rate * remainingMinutes;
                const newMe: Player = { current: me.current, visited: new Set([me.current.name]) };
                states.push({...newState, me: newMe, open: new Set([me.current.name, ...newState.open]), 
                    pressure: newState.pressure + newPressure, remainRate: newState.remainRate - me.current.rate });
                ret = Math.max(ret, newState.pressure + newPressure);
                }
            
            if (newMes.length == 0) {
                states.push(newState);
            } else for (let newMe of newMes) {
                states.push({...newState, me: newMe });
            }
        }

        if (withElephant) for (let newMe of newMes) for (let newEl of newEls) {
            states.push({ me: newMe, el: newEl, open, pressure, minute: newMinute, remainRate });
        }   
        if (!withElephant || newEls.length == 0) for (let newMe of newMes) states.push({ me: newMe, el, open, pressure, minute: newMinute, remainRate });
        if (newMes.length == 0) for (let newEl of newEls) states.push({ me, el: newEl, open, pressure, minute: newMinute, remainRate });
    }
    console.debug(ret);
};

run(sampleContent, 30, false); // 1651 (sample)
run(sampleContent, 26, true); // 1707 (sample)
run(inputContent, 30, false); // 2029
run(inputContent, 26, true); // 2723
