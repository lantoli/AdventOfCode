package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
)

// 183669043 XXX (sample 161 XX)
func main() {
	solve("03_input.txt", line03a, line03b, func() int { return total03a }, func() int { return total03b })
}

var (
	total03a = 0
	total03b = 0
)

func line03a(line string) {
	re := regexp.MustCompile(`mul\((\d{1,3}),(\d{1,3})\)`)
	matches := re.FindAllStringSubmatch(line, -1)
	for _, match := range matches {
		num1, _ := strconv.Atoi(match[1])
		num2, _ := strconv.Atoi(match[2])
		total03a += num1 * num2
	}
}

func line03b(line string) {
	total03b++
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
