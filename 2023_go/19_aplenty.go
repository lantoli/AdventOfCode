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
	fmt.Println(calc19(true))  // XXX
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
	ch := make(chan int)
	if part2 {
		for x := 1; x <= 4000; x++ {
			for m := 1; m <= 4000; m++ {
				for a := 1; a <= 4000; a++ {
					for s := 1; s <= 4000; s++ {
						piece := map[string]int{
							"x": x,
							"m": m,
							"a": a,
							"s": s,
						}
						go calc19Approved(ch, piece, workflows, "in")
					}
					for s := 1; s <= 4000; s++ {
						total += <-ch
					}
				}
				fmt.Println(x, m, total)
			}
		}
	} else {
		count := 0
		for scanner.Scan() {
			line := scanner.Text()
			piece := make(map[string]int)
			for _, assig := range strings.Split(line[1:len(line)-1], ",") {
				parts := strings.Split(assig, "=")
				num, _ := strconv.Atoi(parts[1])
				piece[parts[0]] = num
			}
			go calc19Approved(ch, piece, workflows, "in")
			count++
		}
		for count > 0 {
			total += <-ch
			count--
		}
	}
	return total
}

func calc19Approved(ch chan int, piece map[string]int, ws map[string]string, in string) {
	ch <- calc19ApprovedRec(piece, ws, in)
}

func calc19ApprovedRec(piece map[string]int, ws map[string]string, in string) int {
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
			ret := 0
			for _, v := range piece {
				ret += v
			}
			return ret
		} else if next == "R" {
			return 0
		} else {
			return calc19ApprovedRec(piece, ws, next)
		}
	}
	return 0
}
