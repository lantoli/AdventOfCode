package main

import (
	"sort"
	"strconv"
	"strings"
)

// 2580760 25358365 (sample 11 31)
func main() {
	solve("01_input.txt", line01, calc01_1, calc01_2)
}

var (
	list1 []int
	list2 []int
)

func line01(line string) {
	nums := strings.Fields(line)
	num1, _ := strconv.Atoi(nums[0])
	num2, _ := strconv.Atoi(nums[1])
	list1 = append(list1, num1)
	list2 = append(list2, num2)
}

func calc01_1() int {
	sort.Ints(list1)
	sort.Ints(list2)
	total := 0
	for i := 0; i < len(list1); i++ {
		total += abs(list1[i] - list2[i])
	}
	return total
}

func calc01_2() int {
	map2 := make(map[int]int)
	for _, x := range list2 {
		map2[x]++
	}
	total := 0
	for _, x := range list1 {
		total += x * map2[x]
	}
	return total
}
