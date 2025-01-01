package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

var (
	file14         = "14_input.txt"
	cols14, rows14 = 101, 103
	//cols14, rows14 = 11, 7 // sample
)

// 215476074 XX (sample 12 XX)
func main() {
	solve14()
}

func solve14() {
	f, _ := os.Open("inputs/" + file14)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	midcol, midrow := cols14/2, rows14/2
	q1, q2, q3, q4 := 0, 0, 0, 0
	for scanner.Scan() {
		px, py, vx, vy := next14(scanner.Text())
		x := modpos(px+vx*100, cols14)
		y := modpos(py+vy*100, rows14)
		if x < midcol && y < midrow {
			q1++
		} else if x > midcol && y < midrow {
			q2++
		} else if x < midcol && y > midrow {
			q3++
		} else if x > midcol && y > midrow {
			q4++
		}
	}
	total := q1 * q2 * q3 * q4
	fmt.Println(total)
}

func next14(line string) (px, py, vx, vy int) {
	l := strings.Fields(line)
	p := strings.Split(strings.Split(l[0], "=")[1], ",")
	v := strings.Split(strings.Split(l[1], "=")[1], ",")
	px, _ = strconv.Atoi(p[0])
	py, _ = strconv.Atoi(p[1])
	vx, _ = strconv.Atoi(v[0])
	vy, _ = strconv.Atoi(v[1])
	return px, py, vx, vy
}
