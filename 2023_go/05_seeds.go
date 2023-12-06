package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"slices"
	"strconv"
)

const filepath05 = "inputs/05_input.txt"

func main() {
	fmt.Println(calc05()) // 175622908
}

func calc05() int {
	f, _ := os.Open(filepath05)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	seeds := getNums(scanner.Text())
	fmt.Println("seeds:", seeds)
	done := make(map[int]bool)
	for scanner.Scan() {
		to := getNums(scanner.Text())
		if len(to) == 0 {
			done = make(map[int]bool)
			fmt.Println("RESET")
			continue
		}
		fmt.Println("TO:", to)
		dest := to[0]
		src := to[1]
		count := to[2]
		for i := 0; i < len(seeds); i++ {
			if !done[i] && seeds[i] >= src && seeds[i] <= src+count-1 {
				seeds[i] = dest + seeds[i] - src
				done[i] = true
			}
		}
		fmt.Println("seeds:", seeds)
	}
	fmt.Println("SEEDS:", seeds)
	return slices.Min(seeds)
}

var pattern = regexp.MustCompile(`(\d+)`)

func getNums(line string) []int {
	matches := pattern.FindAllStringSubmatch(line, -1)
	nums := make([]int, len(matches))
	for i, match := range matches {
		nums[i], _ = strconv.Atoi(match[0])
	}
	return nums
}
