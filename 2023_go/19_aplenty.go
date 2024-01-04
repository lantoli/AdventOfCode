package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const filepath19 = "inputs/19_input.txt"

func main() {
	fmt.Println(calc19()) // 432434
}

func calc19() int {
	f, _ := os.Open(filepath19)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	workflows := make(map[string]string)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			break
		}
		index := strings.Index(line, "{")
		workflows[line[:index]] = line[index+1 : len(line)-1]
	}
	total := 0
	for scanner.Scan() {
		line := scanner.Text()
		piece := make(map[string]int)
		for _, assig := range strings.Split(line[1:len(line)-1], ",") {
			parts := strings.Split(assig, "=")
			num, _ := strconv.Atoi(parts[1])
			piece[parts[0]] = num
		}
		if calc19Approved(piece, workflows, "in") {
			for _, v := range piece {
				total += v
			}
		}
	}
	return total
}

func calc19Approved(piece map[string]int, ws map[string]string, in string) bool {
	for _, rule := range strings.Split(ws[in], ",") {
		parts := strings.Split(rule, ":")
		next := parts[0]
		if len(parts) == 2 {
			letter := parts[0][0:1]
			cond := parts[0][1]
			num, _ := strconv.Atoi(parts[0][2:])
			if cond == '<' && piece[letter] >= num {
				continue
			} else if cond == '>' && piece[letter] <= num {
				continue
			}
			next = parts[1]
		}
		if next == "A" {
			return true
		} else if next == "R" {
			return false
		} else {
			return calc19Approved(piece, ws, next)
		}
	}
	return true
}
