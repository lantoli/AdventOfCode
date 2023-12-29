package main

import (
	"bufio"
	"fmt"
	"os"
)

const filepath13 = "inputs/13_input.txt"

func main() {
	fmt.Println(calc13()) // 33728
}

func calc13() int {
	f, _ := os.Open(filepath13)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	total := 0
	m := make([]string, 0)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			total += calc13Map(m)
			m = make([]string, 0)
		} else {
			m = append(m, line)
		}
	}
	if len(m) > 0 {
		total += calc13Map(m)
	}
	return total
}

func calc13Map(m []string) int {
	rows, cols := len(m), len(m[0])
outer1:
	for x := 0; x+1 < cols; x++ {
		for inc := 0; x-inc >= 0 && x+1+inc < cols; inc++ {
			for y := 0; y < rows; y++ {
				if m[y][x-inc] != m[y][x+inc+1] {
					continue outer1
				}
			}
		}
		return x + 1
	}
outer2:
	for y := 0; y+1 < rows; y++ {
		for inc := 0; y-inc >= 0 && y+1+inc < rows; inc++ {
			for x := 0; x < cols; x++ {
				if m[y-inc][x] != m[y+inc+1][x] {
					continue outer2
				}
			}
		}
		return (y + 1) * 100
	}
	return 0
}
