// Part 1 not working yet
import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/19_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/19_sample.txt", 'utf-8')

enum res { ore, clay, obsidian, geode }
const len = Object.keys(res).length / 2

type State = {
  resources: number[],
  robots: number[],
  minute: number
}

const minutes = 24

function robotCostFromBlueprint(line: string): number[][] {
  const oreRobot = line.match(/Each ore robot costs (\d+) ore./)!
  const clayRobot = line.match(/Each clay robot costs (\d+) ore./)!
  const obsidianRobot = line.match(/Each obsidian robot costs (\d+) ore and (\d+) clay./)!
  const geodeRobot = line.match(/Each geode robot costs (\d+) ore and (\d+) obsidian./)!

  const robots : number[][] = new Array(len).fill(0).map(() => new Array(len).fill(0));
  robots[res.ore][res.ore] = parseInt(oreRobot[1])
  robots[res.clay][res.ore] = parseInt(clayRobot[1])
  robots[res.obsidian][res.ore] = parseInt(obsidianRobot[1])
  robots[res.obsidian][res.clay] = parseInt(obsidianRobot[2])
  robots[res.geode][res.ore] = parseInt(geodeRobot[1])
  robots[res.geode][res.obsidian] = parseInt(geodeRobot[2])
  return robots
}

function getGeodes(robotCost: number[][]): number {
  const resources = new Array(len).fill(0)
  const robots = new Array(len).fill(0)
  robots[res.ore] = 1
  const states: State[] = [ {resources, robots, minute: 0 } ]
  let maxGeodes = 0
  let maxTime = 0

  const visited = new Set<string>()
  let count = 0
  let discard = 0

  while (states.length > 0) {
    const state = states.shift()!
    count++
    //console.debug("state", state, "remaining", states)
    let { resources, robots, minute } = state
    if (minute > minutes) continue

    if (robots[res.geode] == 0 && maxGeodes - resources[res.geode] > minutes - minute ) {
      discard++
      continue
    }

    let ser = resources.join(",") + "-" + robots.join(",")
    if (visited.has(ser)) continue
    visited.add(ser)
    minute++
    if (minute > maxTime) {
      maxTime = minute
      console.debug("maxTime", maxTime, "visited", visited.size, "count", count, "discard", discard)
    }
    for (let i = 0; i < len; i++) {
      const newResources = [...resources]
      let buy = true
      for (let j = 0; j < len; j++) {
        if ((newResources[j] -= robotCost[i][j]) < 0) buy = false
      }
      if (buy) {
        const newRobots = [...robots]
        newRobots[i]++
        for (let i = 0; i < len; i++) newResources[i] += robots[i]
        const newState = { resources: newResources, robots: newRobots, minute }
        states.push(newState) 
        //console.debug("buying", newState, "states", states)
      }
      //console.debug("buy", buy, i)
    }

    const newResources = [...state.resources]
    for (let i = 0; i < len; i++) newResources[i] += robots[i]
    if (resources[res.geode] > maxGeodes) {
      maxGeodes = resources[res.geode]
      console.debug("maxGeodes", maxGeodes, "visited", visited.size, "count", count, "discard", discard)
    }
    //maxGeodes = Math.max(maxGeodes, resources[res.geode])
    states.push({ resources: newResources, robots, minute })

  }
  
  return maxGeodes
}

function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    const robotCost = lines.slice(0, 1).map(robotCostFromBlueprint)
    const geodes = robotCost.map(getGeodes)
    const ret = geodes.map((geode, idx) => (idx + 1) * geode).reduce((a, b) => a + b, 0)

    console.debug(geodes)
    console.debug(ret)
  }

run(sampleContent); // 33 (sample)
// run(inputContent); // ...

