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
	fmt.Println(calc19(false)) // 432434
	//fmt.Println(calc19(true))  // XXX
}

func calc19(part2 bool) int {
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
	if part2 {

	} else {
		for scanner.Scan() {
			line := scanner.Text()
			piece := make(map[string]int)
			for _, assig := range strings.Split(line[1:len(line)-1], ",") {
				parts := strings.Split(assig, "=")
				num, _ := strconv.Atoi(parts[1])
				piece[parts[0]] = num
			}
			total += calc19Approved(piece, workflows, "in", 0)
		}
	}
	return total
}

func calc19Approved(piece map[string]int, ws map[string]string, in string, pos int) int {
	rule := strings.Split(ws[in], ",")[pos]
	parts := strings.Split(rule, ":")
	next := parts[0]
	if len(parts) == 2 {
		next = parts[1]
		letter := parts[0][0:1]
		cond := parts[0][1]
		num, _ := strconv.Atoi(parts[0][2:])
		if cond == '<' && piece[letter] >= num {
			return calc19Approved(piece, ws, in, pos+1)
		} else if cond == '>' && piece[letter] <= num {
			return calc19Approved(piece, ws, in, pos+1)
		}
	}
	if next == "A" {
		ret := 0
		for _, v := range piece {
			ret += v
		}
		return ret
	}
	if next == "R" {
		return 0
	}
	return calc19Approved(piece, ws, next, 0)
}
