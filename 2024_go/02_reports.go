package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// 564 XX (sample 2 XX)
func main() {
	solve("02_input.txt", line02, calc02_1, calc02_2)
}

var (
	total = 0
)

func line02(line string) {
	nums := make([]int, 0)
	for _, numStr := range strings.Fields(line) {
		num, _ := strconv.Atoi(numStr)
		nums = append(nums, num)
	}
	s := sign(nums[1] - nums[0])
	for i := 1; i < len(nums); i++ {
		if sign(nums[i]-nums[i-1]) != s || abs(nums[i]-nums[i-1]) > 3 || nums[i] == nums[i-1] {
			return
		}
	}
	total++
}

func calc02_1() int {
	return total
}

func calc02_2() int {
	return 2
}

// DELETE

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
