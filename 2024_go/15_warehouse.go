package main

import (
	"bufio"
	"fmt"
	"os"
)

var (
	file15 = "15_input.txt"
)

// 1515788 XX (sample a: 2028 10092, b: )
// takes minutes using parallelism, algorithm can surely be optimized to run in seconds in serial
func main() {
	solve15a()
}

func solve15a() {
	f, _ := os.Open("inputs/" + file15)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	grid := make([][]rune, 0)
	dirs := ""
	readingDirs := false
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			readingDirs = true
			continue
		}
		if readingDirs {
			dirs += line
		} else {
			grid = append(grid, []rune(line))
		}
	}
	for _, dir := range dirs {
		y, x := pos15(grid)
		switch dir {
		case '>':
			move15a(grid, y, x, 0, 1)
		case '<':
			move15a(grid, y, x, 0, -1)
		case '^':
			move15a(grid, y, x, -1, 0)
		case 'v':
			move15a(grid, y, x, 1, 0)
		default:
			panic("invalid direction")
		}
	}
	total := 0
	for j := range grid {
		for i := range grid[0] {
			if grid[j][i] == 'O' {
				total += j*100 + i
			}
		}
	}
	fmt.Println(total)
}

func move15a(grid [][]rune, y, x, yinc, xinc int) bool {
	switch grid[y+yinc][x+xinc] {
	case '#':
		return false
	case '.':
		grid[y][x], grid[y+yinc][x+xinc] = grid[y+yinc][x+xinc], grid[y][x]
		return true
	case 'O':
		if move15a(grid, y+yinc, x+xinc, yinc, xinc) {
			grid[y][x], grid[y+yinc][x+xinc] = grid[y+yinc][x+xinc], grid[y][x]
			return true
		}
		return false
	default:
		panic("invalid move")
	}
}

func pos15(grid [][]rune) (y, x int) {
	for j := range grid {
		for i := range grid[0] {
			if grid[j][i] == '@' {
				return j, i
			}
		}
	}
	return -1, -1
}
