package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

var (
	cols14, rows14 = 101, 103
	//cols14, rows14 = 11, 7 // sample
	px14, py14, vx14, vy14 []int
)

// 215476074 XX (sample 12 XX)
func main() {
	solve("14_input.txt", line14, nil, solve14a, solve14b)
}

func solve14a() int {
	var x, y []int
	for i := range px14 {
		x = append(x, modpos(px14[i]+vx14[i]*100, cols14))
		y = append(y, modpos(py14[i]+vy14[i]*100, rows14))
	}
	q1, q2, q3, q4 := quad14(x, y)
	return q1 * q2 * q3 * q4
}

func solve14b() int {
	return 0
}

func quad14(x, y []int) (q1, q2, q3, q4 int) {
	midcol, midrow := cols14/2, rows14/2
	for i := range x {
		if x[i] < midcol && y[i] < midrow {
			q1++
		} else if x[i] > midcol && y[i] < midrow {
			q2++
		} else if x[i] < midcol && y[i] > midrow {
			q3++
		} else if x[i] > midcol && y[i] > midrow {
			q4++
		}
	}
	return q1, q2, q3, q4
}

func line14(line string) {
	px, py, vx, vy := next14(line)
	px14 = append(px14, px)
	py14 = append(py14, py)
	vx14 = append(vx14, vx)
	vy14 = append(vy14, vy)
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

// DELETE

func solve(inputFile string, processLine1, processLine2 func(string), ret1, ret2 func() int) {
	f1, _ := os.Open("inputs/" + inputFile)
	defer f1.Close()
	scanner1 := bufio.NewScanner(f1)
	for scanner1.Scan() {
		line := scanner1.Text()
		if processLine1 != nil {
			processLine1(line)
		}
	}
	fmt.Println(ret1())

	f2, _ := os.Open("inputs/" + inputFile)
	defer f2.Close()
	scanner2 := bufio.NewScanner(f2)
	for scanner2.Scan() {
		line := scanner2.Text()
		if processLine2 != nil {
			processLine2(line)
		}
	}
	fmt.Println(ret2())
}

func abs[T int](x T) T {
	if x < 0 {
		return -x
	}
	return x
}

func sign[T int](x T) T {
	if x == 0 {
		return 0
	}
	if x < 0 {
		return -1
	}
	return 1
}

func min[T int](a, b T) T {
	if a <= b {
		return a
	}
	return b
}

func modpos[T int](a, b T) T {
	return (a%b + b) % b
}
