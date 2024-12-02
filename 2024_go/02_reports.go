package main

import (
	"strconv"
	"strings"
)

// 564 XX (sample 2 XX)
func main() {
	solve("02_input.txt", line02a, line02b, func() int { return total02a }, func() int { return total02b })
}

var (
	total02a = 0
	total02b = 123
)

func line02a(line string) {
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
	total02a++
}

func line02b(line string) {

}
