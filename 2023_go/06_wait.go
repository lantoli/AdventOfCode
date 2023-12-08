package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
)

const filepath06 = "inputs/06_input.txt"

func main() {
	fmt.Println(calc06()) // 625968
}

func calc06() int {
	total := 1
	var pattern = regexp.MustCompile(`(\d+)`)
	f, _ := os.Open(filepath06)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	times := pattern.FindAllStringSubmatch(scanner.Text(), -1)
	scanner.Scan()
	distances := pattern.FindAllStringSubmatch(scanner.Text(), -1)
	for i := range times {
		time, _ := strconv.Atoi(times[i][0])
		distance, _ := strconv.Atoi(distances[i][0])
		subtotal := 0
		for j := 1; j < time; j++ {
			if (time-j)*j > distance {
				subtotal++
			}
		}
		total *= subtotal
	}
	return total
}
