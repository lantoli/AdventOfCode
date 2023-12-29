package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const filepath12 = "inputs/12_input.txt"

func main() {
	fmt.Println(calc12()) // 7025
}

func calc12() int {
	f, _ := os.Open(filepath12)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	total := 0
	for scanner.Scan() {
		line := strings.Fields(scanner.Text())
		nums := make([]int, 0)
		for _, numStr := range strings.Split(line[1], ",") {
			num, _ := strconv.Atoi(numStr)
			nums = append(nums, num)
		}
		total += calc12Line(line[0], nums)
	}
	return total
}

func calc12Line(field string, nums []int) int {
	return calc12Rec(field+".", nums, 0, 0, 0)
}

func calc12Rec(field string, nums []int, posField, posNums int, failing int) int {
	if posNums == len(nums) || posField == len(field) {
		for posField != len(field) && field[posField] != '#' {
			posField++
		}
		if posNums == len(nums) && posField == len(field) {
			return 1
		} else {
			return 0
		}
	}
	if field[posField] == '.' {
		if failing > 0 {
			if failing != nums[posNums] {
				return 0
			}
			posNums++
		}
		return calc12Rec(field, nums, posField+1, posNums, 0)
	} else if field[posField] == '#' {
		return calc12Rec(field, nums, posField+1, posNums, failing+1)
	}
	field1 := field[:posField] + "#" + field[posField+1:]
	field2 := field[:posField] + "." + field[posField+1:]
	return calc12Rec(field1, nums, posField, posNums, failing) + calc12Rec(field2, nums, posField, posNums, failing)
}
