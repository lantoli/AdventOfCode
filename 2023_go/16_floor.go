package main

import (
	"bufio"
	"fmt"
	"os"
)

const filepath16 = "inputs/16_input.txt"

func main() {
	fmt.Println(calc16()) // 7477
}

func calc16() int {
	f, _ := os.Open(filepath16)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	grid := make([]string, 0)
	for scanner.Scan() {
		grid = append(grid, scanner.Text())
	}
	if len(grid) != len(grid[0]) {
		panic("grid is not square")
	}
	return calc16Main(grid)
}

func calc16Main(grid []string) int {
	n := len(grid)
	seen := make([][]int, n)
	for i := range seen {
		seen[i] = make([]int, n)
	}
	states := append([]st16{}, st16{0, 0, EAST, &grid})
	// seen[0][0] |= EAST
	for len(states) > 0 {
		newStates := make([]st16, 0)
		for _, state := range states {
			if seen[state.y][state.x]&state.dir > 0 {
				continue
			}
			seen[state.y][state.x] |= state.dir
			switch grid[state.y][state.x] {
			case '.':
				if state.move() {
					newStates = append(newStates, state)
				}
			case '\\':
				switch state.dir {
				case NORTH:
					state.dir = WEST
				case EAST:
					state.dir = SOUTH
				case SOUTH:
					state.dir = EAST
				case WEST:
					state.dir = NORTH
				}
				if state.move() {
					newStates = append(newStates, state)
				}
			case '/':
				switch state.dir {
				case NORTH:
					state.dir = EAST
				case EAST:
					state.dir = NORTH
				case SOUTH:
					state.dir = WEST
				case WEST:
					state.dir = SOUTH
				}
				if state.move() {
					newStates = append(newStates, state)
				}
			case '|':
				if state.dir == NORTH || state.dir == SOUTH {
					if state.move() {
						newStates = append(newStates, state)
					}
				} else {
					copy := st16{state.y, state.x, NORTH, state.grid}
					if copy.move() {
						newStates = append(newStates, copy)
					}
					copy = st16{state.y, state.x, SOUTH, state.grid}
					if copy.move() {
						newStates = append(newStates, copy)
					}
				}

			case '-':
				if state.dir == EAST || state.dir == WEST {
					if state.move() {
						newStates = append(newStates, state)
					}
				} else {
					copy := st16{state.y, state.x, EAST, state.grid}
					if copy.move() {
						newStates = append(newStates, copy)
					}
					copy = st16{state.y, state.x, WEST, state.grid}
					if copy.move() {
						newStates = append(newStates, copy)
					}
				}
			}
		}
		states = newStates
	}
	ret := 0
	for y := range seen {
		for x := range seen[y] {
			if seen[y][x] > 0 {
				ret++
			}
		}
	}
	return ret
}

type st16 struct {
	y    int
	x    int
	dir  int
	grid *[]string
}

func (s *st16) move() bool {
	switch s.dir {
	case NORTH:
		s.y--
	case EAST:
		s.x++
	case SOUTH:
		s.y++
	case WEST:
		s.x--
	}
	return s.valid()
}

func (s *st16) valid() bool {
	n := len(*s.grid)
	return s.y >= 0 && s.y < n && s.x >= 0 && s.x < n
}

const (
	NORTH = 1
	EAST  = 2
	SOUTH = 4
	WEST  = 8
)
