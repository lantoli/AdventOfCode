package main

import (
	"bufio"
	"fmt"
	"os"
)

// 1550156 XX (sample 1930 XX)
func main() {
	solve("12_sample_2.txt", line12, nil, func() int { return solve12(false) }, func() int { return solve12(true) })
}

var (
	input12        = make([][]rune, 0)
	rows12, cols12 int
)

func line12(line string) {
	row := make([]rune, 0, len(line))
	for _, ch := range line {
		row = append(row, ch)
	}
	input12 = append(input12, row)
	rows12 = len(input12)
	cols12 = len(input12[0])
}

func solve12(sides bool) int {
	visited := make(map[int]bool)
	total := 0
	for y := range rows12 {
		for x := range cols12 {
			total += calc12(y, x, visited, sides)
		}
	}
	return total
}

func calc12(yini, xini int, visited map[int]bool, sides bool) int {
	a, p := 0, 0
	ch := input12[yini][xini]
	list := []int{yini*cols12 + xini}
	for len(list) > 0 {
		pos := list[len(list)-1]
		y, x := pos/cols12, pos%cols12
		list = list[:len(list)-1]
		if input12[y][x] != ch || visited[pos] {
			continue
		}
		visited[pos] = true
		a++
		if y == 0 || input12[y-1][x] != ch {
			p++
		}
		if y == rows12-1 || input12[y+1][x] != ch {
			p++
		}
		if x == 0 || input12[y][x-1] != ch {
			p++
		}
		if x == cols12-1 || input12[y][x+1] != ch {
			p++
		}
		if y > 0 {
			list = append(list, pos-cols12)
		}
		if y < rows12-1 {
			list = append(list, pos+cols12)
		}
		if x > 0 {
			list = append(list, pos-1)
		}
		if x < cols12-1 {
			list = append(list, pos+1)
		}
	}
	return a * p
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
