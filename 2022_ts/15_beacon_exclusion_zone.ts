import { readFileSync } from 'fs';

const inputContent = readFileSync("inputs/15_input.txt", 'utf-8');
const sampleContent = readFileSync("inputs/15_sample.txt", 'utf-8');

type Sensor = {
    y: number;
    x: number;
    range: number;
};


function run1(content: string, y: number) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const occupied = new Set<number>();
    const sensors: Sensor[] = [];
    for (const line of lines) {
        // console.debug(line);
        const [_full, xsensor, ysensor, xbacon, ybacon] = line.match(/Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/)!.map(Number);
        if (ysensor == y) occupied.add(xsensor);
        if (ybacon == y) occupied.add(xbacon);
        sensors.push({y: ysensor, x: xsensor, range: Math.abs(ybacon - ysensor) + Math.abs(xbacon - xsensor)});
    }

    let maxRange = Math.max(...sensors.map(s => s.range));
    let xini = Math.min(...sensors.map(s => s.x)) - maxRange;
    let xend = Math.max(...sensors.map(s => s.x)) + maxRange;

    console.debug("ranges", maxRange, xini, xend);    

    let count = 0;
    for (let x = xini; x <= xend; x++) if (!occupied.has(x)) {
        for (let sensor of sensors) {
            if (Math.abs(sensor.y - y) + Math.abs(sensor.x - x) <= sensor.range) {
                // console.log("count", x, sensor);
                count++;
                break;
            }
        }
    }
    console.debug(count);    
};

function run2(content: string, tunning: number, max: number) {
    const lines = content.split('\n');
    lines.pop(); // Remove last empty line

    const occupied = new Set<number>();
    const sensors: Sensor[] = [];
    for (const line of lines) {
        // console.debug(line);
        const [_full, xsensor, ysensor, xbacon, ybacon] = line.match(/Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/)!.map(Number);
        occupied.add(xsensor * tunning + ysensor);
        occupied.add(xbacon * tunning + ybacon);
        sensors.push({y: ysensor, x: xsensor, range: Math.abs(ybacon - ysensor) + Math.abs(xbacon - xsensor)});
    }

    let maxRange = Math.max(...sensors.map(s => s.range));
    let xini = Math.min(...sensors.map(s => s.x)) - maxRange;
    let xend = Math.max(...sensors.map(s => s.x)) + maxRange;
    let yini = Math.min(...sensors.map(s => s.y)) - maxRange;
    let yend = Math.max(...sensors.map(s => s.y)) + maxRange;

    console.debug("ranges first", maxRange, xini, xend, yini, yend);    
    xini = Math.max(0, xini);
    yini = Math.max(0, yini);
    xend = Math.min(max, xend);
    yend = Math.min(max, yend);
    console.debug("ranges adjusted", maxRange, xini, xend, yini, yend);    

    for (let y = yini; y <= yend; y++) 
    for (let x = xini; x <= xend; x++) 
    if (!occupied.has(x * tunning + y)) {
        let found = true;
        for (let sensor of sensors) {
            if (Math.abs(sensor.y - y) + Math.abs(sensor.x - x) <= sensor.range) {
                // console.log("count", x, sensor);
                found = false;
                break;
            }
        }
        if (found) {
            console.log("found", x * tunning + y, x, y);
            return;
        } 
    }
};

//run1(sampleContent, 10); // 26 (sample)
//run1(inputContent, 2_000_000); // 5125700
// run2(sampleContent, 4_000_000, 20); // 56000011 (sample)
run2(inputContent, 4_000_000, 4_000_000); // ...
