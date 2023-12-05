package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
)

const filepath04 = "inputs/04_input.txt"

func main() {
	fmt.Println(calc04a()) // 21105
	fmt.Println(calc04b()) // 5329815
}

func calc04a() int {
	total := 0
	for _, count := range winList() {
		if count > 0 {
			total += 1 << (count - 1)
		}
	}
	return total
}

func calc04b() int {
	total := 0
	list := winList()
	counts := make([]int, len(list))
	for i := range counts {
		counts[i] = 1
	}
	for i := range list {
		count := counts[i]
		total += count
		for j := 1; j <= list[i]; j++ {
			counts[i+j] += count
		}
	}
	return total
}

func winList() []int {
	ret := make([]int, 0)
	pattern := regexp.MustCompile(`(\d+)|(\|)`)
	f, _ := os.Open(filepath04)
	defer f.Close()
	for scanner := bufio.NewScanner(f); scanner.Scan(); {
		line := scanner.Text()
		matches := pattern.FindAllStringSubmatch(line, -1)
		var myTurn bool
		winning := make(map[string]bool)
		mine := make([]string, 0)
		for _, match := range matches[1:] {
			if match[0] == "|" {
				myTurn = true
			} else if myTurn {
				mine = append(mine, match[0])
			} else {
				winning[match[0]] = true
			}
		}
		count := 0
		for _, me := range mine {
			if winning[me] {
				count++
			}
		}
		ret = append(ret, count)
	}
	return ret
}
