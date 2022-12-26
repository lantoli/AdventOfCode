// Part 2 not working yet
// Use export NODE_OPTIONS="--max-old-space-size=8192"
import { readFileSync } from 'fs'

const inputContent = readFileSync("inputs/19_input.txt", 'utf-8')
const sampleContent = readFileSync("inputs/19_sample.txt", 'utf-8')

enum res { ore, clay, obsidian, geode }
const len = Object.keys(res).length / 2

type State = {
  resources: number[],
  robots: number[],
  minute: number,
  bad: boolean
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
  const states: State[] = [ {resources, robots, minute: 0, bad: false } ]
  let maxGeodes = 0
  // let maxTime = 0
  let count = 0
  const visited = new Map<string, State>()

  let diffMinus = 0, diffZero = 0, diffPlus = 0

  while (states.length > 0) {
    const state = states.pop()!
    if (state.bad) continue
    count++
    // console.debug("state", state, "remaining", states)
    let { resources, robots, minute } = state
    
//    if (minute > minutes) continue
    
    let key = robots.join(",") + ":" + resources.join(",")
    const v = visited.get(key)
    if (typeof v !== "undefined"){
      const diff = state.minute - v.minute
      if (diff === 0) diffZero++; else if (diff < 0) diffMinus++; else diffPlus++
      //if (diff < 0) console.debug(diff , "visited", key, visited.get(key), state)
      count++
      if (diff >= 0) continue; else v.bad = true
    }
    visited.set(key, state)


    for (let i = 0; i < len; i++) {
      let rounds = 0
      for (let j = 0; j < len; j++)  {
        const cost = robotCost[i][j];
        if (resources[j] < cost) {
          if (robots[j] > 0) {
            rounds = Math.max(rounds, Math.ceil((cost - resources[j]) / robots[j]))
          } else {
            rounds = Infinity
          }
        }
      }
      // console.debug(`will build ${i} in ${rounds} rounds`)
      if (Number.isFinite(rounds)) {
        rounds++
        const newMinute = minute + rounds
        if (newMinute < minutes) {
          const newRobots = [...robots]
          newRobots[i]++
          const newResources = [...resources]
          for (let j = 0; j < len; j++) {
            newResources[j] += rounds * robots[j] - robotCost[i][j]
          }
          const newState = { resources: newResources, robots: newRobots, minute: newMinute, bad: false }
          // console.debug("new state", newState)
          states.push(newState)
          if (maxGeodes < newRobots[res.geode]) {
            maxGeodes = newRobots[res.geode]
            console.debug("maxGeodes1", maxGeodes)
          }
        } else {
          const remaining = minutes - minute
          const geodes = resources[res.geode] + remaining * robots[res.geode]
          if (maxGeodes < geodes) {
            maxGeodes = geodes
            console.debug("maxGeodes2", maxGeodes,resources[res.geode], robots[res.geode], "time", minutes, minute, remaining)
          } 
        } 
      }
    }
  }
  // console.debug("DIFFS", diffMinus, diffZero, diffPlus)
  
  return maxGeodes
}

function run(content: string) {
    const lines = content.split('\n')
    lines.pop() // Remove last empty line

    let ret = 0
    let idx = 1
    for (let robotCost of lines.map(robotCostFromBlueprint)) {
      const geodes = getGeodes(robotCost)
      ret += geodes * idx
      idx++
      console.debug(geodes)
    }    
    console.debug(ret)
  }

//run(sampleContent); // 33 (sample)
 run(inputContent); // 1616
 

