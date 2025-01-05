package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

// 19927218456 XX (sample 37327623 XX)
func main() {
	solve22()
}

var (
	file22 = "22_input.txt"
)

func solve22() {
	f, _ := os.Open("inputs/" + file22)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	total := 0
	for scanner.Scan() {
		num, _ := strconv.Atoi(scanner.Text())
		total += calc22(num)
	}
	fmt.Println(total)
}

func calc22(num int) int {
	for range 2000 {
		num = ((num * (1 << 6)) ^ num) % 16777216
		num = ((num / (1 << 5)) ^ num) % 16777216
		num = ((num * (1 << 11)) ^ num) % 16777216
	}
	return num
}
