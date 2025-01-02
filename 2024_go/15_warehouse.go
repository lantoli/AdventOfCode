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
	solve15(false)
	solve15(true)
}

func solve15(large bool) {
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
		//fmt.Printf("%c - %d\n", dir, i)
		//drawWarehouse(grid)
		y, x := pos15(grid)
		if i == 180000 {
			fmt.Println("break")
		}
		switch dir {
		case '>':
			movex15a(grid, y, x, 1)
		case '<':
			movex15a(grid, y, x, -1)
		case '^':
			movey15a(grid, y, x, -1)
		case 'v':
			movey15a(grid, y, x, 1)
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

func movex15a(grid [][]rune, y, x, xinc int) bool {
	switch ch := grid[y][x+xinc]; ch {
	case '#':
		return false
	case '.':
		grid[y][x], grid[y][x+xinc] = grid[y][x+xinc], grid[y][x]
		return true
	case 'O', '[', ']':
		if movex15a(grid, y, x+xinc, xinc) {
			grid[y][x], grid[y][x+xinc] = grid[y][x+xinc], grid[y][x]
			return true
		}
		return false
	default:
		panic("invalid move")
	}
}

func movey15a(grid [][]rune, y, x, yinc int) bool {
	switch ch := grid[y+yinc][x]; ch {
	case '#':
		return false
	case '.':
		grid[y][x], grid[y+yinc][x] = grid[y+yinc][x], grid[y][x]
		return true
	case 'O', '[', ']':
		if movey15a(grid, y+yinc, x, yinc) {
			grid[y][x], grid[y+yinc][x] = grid[y+yinc][x], grid[y][x]
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
