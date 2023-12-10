package main

import (
	"bufio"
	"fmt"
	"os"
)

const filepath10 = "inputs/10_input.txt"

func main() {
	fmt.Println(calc10()) // 7093
}

func calc10() int {
	f, _ := os.Open(filepath10)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	maze := make([][]byte, 0)
	for scanner.Scan() {
		line := []byte(scanner.Text())
		maze = append(maze, line)
	}
	rows := len(maze)
	cols := len(maze[0])
	var srow, scol int
	for row := 0; row < rows; row++ {
		for col := 0; col < cols; col++ {
			if maze[row][col] == 'S' {
				srow = row
				scol = col
				break
			}
		}
	}
	fmt.Println("S", srow, scol)
	total := 0
	states := append([]state{}, state{srow, scol})
	visited := make(map[int]bool)
	if infos[maze[srow-1][scol]].s {
		states = append(states, state{srow - 1, scol})
	}
	if infos[maze[srow+1][scol]].n {
		states = append(states, state{srow + 1, scol})
	}
	if infos[maze[srow][scol+1]].w {
		states = append(states, state{srow, scol + 1})
	}
	if scol > 0 && infos[maze[srow][scol-1]].e {
		states = append(states, state{srow, scol - 1})
	}

	for {
		newStates := make([]state, 0)
		for _, s := range states {
			pos := s.row*cols + s.col
			if !visited[pos] {
				visited[pos] = true
				i := infos[maze[s.row][s.col]]
				if i.n {
					newStates = append(newStates, state{s.row - 1, s.col})
				}
				if i.s {
					newStates = append(newStates, state{s.row + 1, s.col})
				}
				if i.e {
					newStates = append(newStates, state{s.row, s.col + 1})
				}
				if i.w {
					newStates = append(newStates, state{s.row, s.col - 1})
				}
			}
		}
		if len(newStates) == 0 {
			break
		}
		states = newStates
		total++
	}
	return total
}

var infos = map[byte]info{
	'|': {true, true, false, false},
	'-': {false, false, true, true},
	'L': {true, false, true, false},
	'J': {true, false, false, true},
	'7': {false, true, false, true},
	'F': {false, true, true, false},
}

type info struct {
	n, s, e, w bool
}

type state struct {
	row, col int
}
