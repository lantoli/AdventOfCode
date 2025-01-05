package main

import (
	"bufio"
	"fmt"
	"os"
)

// XX XX (sample 126384 XX)
func main() {
	solve("21_sample.txt", line21, nil, func() int { return solve21(false) }, func() int { return solve21(true) })
}

var (
	input21 = make([]string, 0)
)

func line21(line string) {
	input21 = append(input21, line)
}

func solve21(b bool) int {
	total := 0
	for codes := range input21 {	
		total +=calc01a()	
	}
	return total
}

func calc21(codes string) int
	const n = 10
	dirpad := [][]string{
		{"7", "8", "9"},
		{"4", "5", "6"},
		{"1", "2", "3"},
		{"", "0", "A"},
	}
	numpad := [][]string{
		{"", "^", "A"},
		{"<", "v", ">"},
	}
	dirpos := 3*n + 2
	num1pos := 2
	for _, code := range codes {
	}
	return 0
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
