package main

import (
	"bufio"
	"fmt"
	"os"
)

func solve(inputFile string, processLine func(string), ret1, ret2 func() int) {
	f, _ := os.Open("inputs/" + inputFile)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		processLine(scanner.Text())
	}
	fmt.Println(ret1())
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
