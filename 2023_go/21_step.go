package main

import (
	"bufio"
	"fmt"
	"os"
)

const filepath21 = "inputs/21_input.txt"

func main() {
	fmt.Println(calc21()) // 3677
}

func calc21() int {
	f, _ := os.Open(filepath21)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	grid := make([]string, 0)
	for scanner.Scan() {
		grid = append(grid, scanner.Text())
	}
	if len(grid) != len(grid[0]) {
		panic("grid is not square")
	}
	return calc21Main(grid)
}

func calc21Main(grid []string) int {
	n := len(grid)
	var y, x int
outer:
	for y = 0; y < n; y++ {
		for x = 0; x < n; x++ {
			if grid[y][x] == 'S' {
				break outer
			}
		}
	}
	v := map[int]any{y*n + x: nil}
	for i := 0; i < 64; i++ {
		newv := make(map[int]any)
		for k := range v {
			for _, inc := range [][2]int{{-1, 0}, {1, 0}, {0, 1}, {0, -1}} {
				y, x := k/n+inc[0], k%n+inc[1]
				if y >= 0 && y < n && x >= 0 && x < n && grid[y][x] != '#' {
					newv[y*n+x] = nil
				}
			}
		}
		v = newv
	}
	return len(v)
}
