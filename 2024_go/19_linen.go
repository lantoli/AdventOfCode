package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// 278 XX (sample 6 XX)
func main() {
	solve19a()
}

var (
	file19 = "19_input.txt"
)

func solve19a() {
	f, _ := os.Open("inputs/" + file19)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	patterns := strings.Split(scanner.Text(), ", ")
	scanner.Scan()
	total := 0
	cache := map[string]bool{"": true}
	for scanner.Scan() {
		if calc19a(patterns, scanner.Text(), cache) {
			total++
		}
	}
	fmt.Println(total)
}

func calc19a(patterns []string, line string, cache map[string]bool) bool {
	if val, ok := cache[line]; ok {
		return val
	}
	for _, pattern := range patterns {
		if strings.HasPrefix(line, pattern) {
			newLine := line[len(pattern):]
			if calc19a(patterns, newLine, cache) {
				cache[newLine] = true
				return true
			}
		}
	}
	cache[line] = false
	return false
}
