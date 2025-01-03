package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

// 268 XX  (sample 22 XX)
func main() {
	file, size, mem := "18_sample.txt", 7, 12
	if isInput18 {
		file, size, mem = "18_input.txt", 71, 1024
	}
	solve(file, line18, nil, func() int { return solve18(size, mem, false) }, func() int { return solve18(size, mem, true) })
}

var (
	isInput18 = true
	input18   = make([][]int, 0)
)

func line18(line string) {
	nums := strings.Split(line, ",")
	x, _ := strconv.Atoi(nums[0])
	y, _ := strconv.Atoi(nums[1])
	input18 = append(input18, []int{x, y})
}

func solve18(size, mem int, b bool) int {
	incs := [][]int{{0, -1}, {0, 1}, {-1, 0}, {1, 0}}
	minsteps := math.MaxInt
	grid := make([][]rune, 0)
	for range size {
		grid = append(grid, make([]rune, size))
	}
	for pos := range mem {
		x, y := input18[pos][0], input18[pos][1]
		grid[y][x] = '#'
	}
	steps := make(map[int]int)
	list := []int{0}
	steps[0] = 0
	for len(list) > 0 {
		pos := list[0]
		list = list[1:]
		y, x := pos/size, pos%size
		step, ok := steps[pos]
		if !ok {
			panic("no step")
		}
		for _, inc := range incs {
			ynext, xnext := y+inc[0], x+inc[1]
			if ynext >= 0 && ynext < size && xnext >= 0 && xnext < size && grid[ynext][xnext] != '#' {
				posnext, stepnext := ynext*size+xnext, step+1
				if _, found := steps[posnext]; !found || stepnext < steps[posnext] {
					steps[posnext] = stepnext
					list = append(list, posnext)
				}
				if ynext == size-1 && xnext == size-1 {
					minsteps = min(minsteps, stepnext)
				}
			}
		}
	}
	return minsteps
}

func drawRam(grid [][]rune) {
	for j := range grid {
		for i := range grid[0] {
			ch := grid[j][i]
			if ch == 0 {
				ch = '.'
			}
			fmt.Printf("%c", ch)
		}
		fmt.Println()
	}
	fmt.Println()
}

// DELETE

func solve(inputFile string, processLine1, processLine2 func(string), ret1, ret2 func() int) {
	f1, _ := os.Open("inputs/" + inputFile)
	defer f1.Close()
	scanner1 := bufio.NewScanner(f1)
	for scanner1.Scan() {
		line := scanner1.Text()
		if processLine1 != nil {
			processLine1(line)
		}
	}
	fmt.Println(ret1())

	f2, _ := os.Open("inputs/" + inputFile)
	defer f2.Close()
	scanner2 := bufio.NewScanner(f2)
	for scanner2.Scan() {
		line := scanner2.Text()
		if processLine2 != nil {
			processLine2(line)
		}
	}
	fmt.Println(ret2())
}

func abs[T int](x T) T {
	if x < 0 {
		return -x
	}
	return x
}

func sign[T int](x T) T {
	if x == 0 {
		return 0
	}
	if x < 0 {
		return -1
	}
	return 1
}

func min[T int](a, b T) T {
	if a <= b {
		return a
	}
	return b
}

func max[T int](a, b T) T {
	if a >= b {
		return a
	}
	return b
}

func modpos[T int](a, b T) T {
	return (a%b + b) % b
}
