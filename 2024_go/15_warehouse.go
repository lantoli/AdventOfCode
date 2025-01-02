package main

import (
	"bufio"
	"fmt"
	"os"
)

var (
	file15 = "15_sample.txt"
)

// 1515788 XX (sample a: 2028 10092, b: 9021)
// takes minutes using parallelism, algorithm can surely be optimized to run in seconds in serial
func main() {
	// solve15a(false)
	solve15a(true)
}

func solve15a(large bool) {
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
			if large {
				row := make([]rune, 0)
				for _, r := range line {
					switch r {
					case '#':
						row = append(row, '#', '#')
					case 'O':
						row = append(row, '[', ']')
					case '.':
						row = append(row, '.', '.')
					case '@':
						row = append(row, '@', '.')
					default:
						panic("invalid large input")
					}
				}
				grid = append(grid, row)
			} else {
				grid = append(grid, []rune(line))
			}
		}
	}
	for i, dir := range dirs {
		fmt.Printf("%c - %d\n", dir, i)
		drawWarehouse(grid)
		y, x := pos15(grid)
		if i == 180 {
			fmt.Println("break")
		}
		switch dir {
		case '>':
			move15a(grid, y, x, 0, 1, true)
		case '<':
			move15a(grid, y, x, 0, -1, true)
		case '^':
			move15a(grid, y, x, -1, 0, true)
		case 'v':
			move15a(grid, y, x, 1, 0, true)
		default:
			panic("invalid direction")
		}
	}
	total := 0
	for j := range grid {
		for i := range grid[0] {
			if grid[j][i] == 'O' || grid[j][i] == '[' {
				total += j*100 + i
			}
		}
	}
	fmt.Println(total)
}

func move15a(grid [][]rune, y, x, yinc, xinc int, doMove bool) bool {
	switch ch := grid[y+yinc][x+xinc]; ch {
	case '#':
		return false
	case '.':
		doMove15a(grid, y, x, yinc, xinc, doMove)
		return true
	case 'O', '[', ']':
		if ch == 'O' || yinc == 0 {
			if move15a(grid, y+yinc, x+xinc, yinc, xinc, false) {
				if doMove {
					move15a(grid, y+yinc, x+xinc, yinc, xinc, doMove)
					doMove15a(grid, y, x, yinc, xinc, doMove)
				}
				return true
			}
			return false
		}
		if ch == ']' {
			x--
		}
		a := move15a(grid, y+yinc, x+xinc, yinc, xinc, false)
		b := move15a(grid, y+yinc, x+xinc+1, yinc, xinc, false)
		if a && b {
			if doMove {
				move15a(grid, y+yinc, x+xinc, yinc, xinc, doMove)
				doMove15a(grid, y, x, yinc, xinc, doMove)
			}
			return true
		}
		return false
	default:
		panic("invalid move")
	}
}

func drawWarehouse(grid [][]rune) {
	for j := range grid {
		for i := range grid[0] {
			fmt.Print(string(grid[j][i]))
		}
		fmt.Println()
	}
	fmt.Println()
}

func doMove15a(grid [][]rune, y, x, yinc, xinc int, doMove bool) {
	if doMove {
		ch := grid[y][x]
		grid[y][x], grid[y+yinc][x+xinc] = grid[y+yinc][x+xinc], grid[y][x]
		if ch == '[' && yinc != 0 {
			grid[y][x+1], grid[y+yinc][x+xinc+1] = grid[y+yinc][x+xinc+1], grid[y][x+1]
		}
		if ch == ']' && yinc != 0 {
			drawWarehouse(grid)
			panic("not domove")
			//grid[y][x-1], grid[y+yinc][x+xinc-1] = grid[y+yinc][x+xinc-1], grid[y][x-1]
		}
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
