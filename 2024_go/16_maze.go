package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strings"
)

// 102504 too high  XX (sample 7036 11048, )
func main() {
	solve("16_input.txt", line16, nil, func() int { return solve16(false) }, func() int { return solve16(true) })
}

var (
	input16                        = make([][]rune, 0)
	rows16, cols16, yini16, xini16 int
)

func line16(line string) {
	row := make([]rune, 0, len(line))
	for _, ch := range line {
		row = append(row, ch)
	}
	input16 = append(input16, row)
	rows16 = len(input16)
	cols16 = len(input16[0])
	if idx := strings.Index(line, "S"); idx != -1 {
		yini16, xini16 = rows16-1, idx
	}
}

func solve16(b bool) int {
	dirs := [][]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}
	dir := 0
	ret := math.MaxInt64
	pos := dir*cols16*rows16 + yini16*cols16 + xini16
	list := append([]int(nil), pos)
	scores := make(map[int]int)
	scores[pos] = 0
	for len(list) > 0 {
		pos = list[0]
		list = list[1:]
		dir, y, x := pos/(cols16*rows16), pos/cols16%rows16, pos%cols16
		score, ok := scores[pos]
		if !ok {
			panic(fmt.Sprintf("not found: %d %d %d %d", pos, dir, y, x))
		}
		if ynext, xnext := y+dirs[dir][0], x+dirs[dir][1]; input16[ynext][xnext] != '#' {
			if input16[ynext][xnext] == 'E' {
				ret = min(ret, score+1)
			} else {
				posnext := dir*cols16*rows16 + ynext*cols16 + xnext
				nextscore := score + 1
				curscore := scores[posnext]
				if curscore == 0 || nextscore < curscore {
					scores[posnext] = nextscore
					list = append(list, posnext)
				}
			}
		}
		nextdir := (dir + 1) % 4
		posnext := nextdir*cols16*rows16 + y*cols16 + x
		nextscore := score + 1000
		curscore := scores[posnext]
		if curscore == 0 || nextscore < curscore {
			scores[posnext] = nextscore
			list = append(list, posnext)
		}
		nextdir = (dir - 1 + 4) % 4
		posnext = nextdir*cols16*rows16 + y*cols16 + x
		curscore = scores[posnext]
		if curscore == 0 || nextscore < curscore {
			scores[posnext] = nextscore
			list = append(list, posnext)
		}
	}
	return ret
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

func max[T int](a, b T) T {
	if a >= b {
		return a
	}
	return b
}

func modpos[T int](a, b T) T {
	return (a%b + b) % b
}
