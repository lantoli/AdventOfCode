package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"sort"
)

const filepath17 = "inputs/17_input.txt"

func main() {
	fmt.Println(calc17()) // 861
}

var ret17 int
var global17 map[st17]int

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
	global17 = make(map[st17]int)
	calc17Main(grid)
	return ret17
}

func calc17Main(grid []string) {
	calc17Rec(grid, 0, &st17{0, 0, EAST, 0, len(grid)}, map[st17key]any{})
	calc17Rec(grid, 0, &st17{0, 0, SOUTH, 0, len(grid)}, map[st17key]any{})
}

func calc17Rec(grid []string, heat int, last *st17, v map[st17key]any) {
	if last.y == len(grid)-1 && last.x == len(grid)-1 {
		if heat < ret17 {
			fmt.Println(heat)
		}
		ret17 = min(ret17, heat)
		return
	}
	if heat >= ret17 {
		return
	}

	if value, exist := global17[*last]; (last.x != 0 || last.y != 0) && exist && value <= heat {
		return
	}
	global17[*last] = heat

	candidates := make([]*st17, 0)
	copy := &st17{last.y, last.x, last.dir, last.single, last.n}
	if copy.move() {
		candidates = append(candidates, copy)
	}
	copy = &st17{last.y, last.x, last.dir, last.single, last.n}
	if copy.moveLeft() {
		candidates = append(candidates, copy)
	}
	copy = &st17{last.y, last.x, last.dir, last.single, last.n}
	if copy.moveRight() {
		candidates = append(candidates, copy)
	}
	sort.Slice(candidates, func(i, j int) bool {
		return candidates[i].x+candidates[i].y >= candidates[j].x+candidates[j].y
	})
	for _, c := range candidates {
		key := st17key{c.y, c.x, c.dir}
		if _, exist := v[key]; exist {
			return
		}
		v[key] = nil
		calc17Rec(grid, heat+int(grid[c.y][c.x])-'0', c, v)
		delete(v, key)
	}
}

type st17 struct {
	y      int
	x      int
	dir    int
	single int
	n      int
}

type st17key struct {
	y   int
	x   int
	dir int
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
	return s.single <= 3 && s.y >= 0 && s.y < s.n && s.x >= 0 && s.x < s.n
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
