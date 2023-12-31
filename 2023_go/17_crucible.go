package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
)

const filepath17 = "inputs/17_sample.txt"

func main() {
	fmt.Println(calc17()) // XXX
}

var ret17 int

func calc17() int {
	f, _ := os.Open(filepath17)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	grid := make([]string, 0)
	for scanner.Scan() {
		grid = append(grid, scanner.Text())
	}
	if len(grid) != len(grid[0]) {
		panic("grid is not square")
	}
	ret17 = math.MaxInt
	calc17Main(grid)
	return ret17
}

func calc17Main(grid []string) {
	calc17Rec(grid, 0, &[]st17{st17{0, 0, EAST, 0, len(grid)}})
	//calc17Rec(grid, 0, &[]st17{st17{0, 0, SOUTH, len(grid)}})
}

func calc17Rec(grid []string, heat int, visited *[]st17) {
	last := (*visited)[len(*visited)-1]
	if last.y == len(grid)-1 && last.x == len(grid)-1 {
		ret17 = min(ret17, heat)
		return
	}
	for i := 0; i < len(*visited)-1; i++ {
		if (*visited)[i].y == last.y && (*visited)[i].x == last.x && (*visited)[i].dir == last.dir {
			return
		}
	}
	if heat >= ret17 {
		return
	}
	copy := st17{last.y, last.x, last.dir, last.single, last.n}
	if copy.move() {
		*visited = append(*visited, copy)
		calc17Rec(grid, heat+int(grid[copy.y][copy.x])-'0', visited)
		*visited = (*visited)[:len(*visited)-1]
	}
	copy = st17{last.y, last.x, last.dir, last.single, last.n}
	if copy.moveLeft() {
		*visited = append(*visited, copy)
		calc17Rec(grid, heat+int(grid[copy.y][copy.x])-'0', visited)
		*visited = (*visited)[:len(*visited)-1]
	}
	copy = st17{last.y, last.x, last.dir, last.single, last.n}
	if copy.moveRight() {
		*visited = append(*visited, copy)
		calc17Rec(grid, heat+int(grid[copy.y][copy.x])-'0', visited)
		*visited = (*visited)[:len(*visited)-1]
	}
}

type st17 struct {
	y      int
	x      int
	dir    int
	single int
	n      int
}

func (s *st17) move() bool {
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
	s.single++
	return s.single <= 33 && s.y >= 0 && s.y < s.n && s.x >= 0 && s.x < s.n
}

func (s *st17) moveLeft() bool {
	s.dir = map[int]int{NORTH: WEST, WEST: SOUTH, SOUTH: EAST, EAST: NORTH}[s.dir]
	s.single = 0
	return s.move()
}

func (s *st17) moveRight() bool {
	s.dir = map[int]int{NORTH: EAST, EAST: SOUTH, SOUTH: WEST, WEST: NORTH}[s.dir]
	s.single = 0
	return s.move()
}

const (
	NORTH = 1
	EAST  = 2
	SOUTH = 4
	WEST  = 8
)
