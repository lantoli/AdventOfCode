package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
)

// XX XX (sample XX XX)
func main() {
	solve("20_sample.txt", line20, nil, func() int { return solve20(false) }, func() int { return solve20(true) })
}

var (
	input20                            = make([]bool, 0)
	rows20, cols20, posini20, posend20 int
	dirs20                             = [][]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}
)

func line20(line string) {
	cols20 = len(line)
	for i, ch := range line {
		if ch == '#' {
			input20 = append(input20, true)
		} else {
			input20 = append(input20, false)
			if ch == 'S' {
				posini20 = rows20*cols20 + i
			} else if ch == 'E' {
				posend20 = rows20*cols20 + i
			}
		}
	}
	rows20++
}

type st20 struct {
	pos, count int
}
type stc20 struct {
	cheat1, cheat2 int
}

func solve20(b bool) int {
	return calc20()
}

func calc20() int {
	maxcount := fast20(0, 0) - 64
	cheats := make(map[stc20]interface{})
	visited := make(map[int]int)
	list := []st20{{posini20, 0}}
	ret := math.MaxInt
	for len(list) > 0 {
		st := list[0]
		list = list[1:]
		if st.pos == posend20 {
			ret = min(ret, st.count)
			continue
		}
		if v, found := visited[st.pos]; found && st.count >= v {
			continue
		}
		visited[st.pos] = st.count
		y, x := st.pos/cols20, st.pos%cols20
		for _, dir := range dirs20 {
			ynew, xnew := y+dir[0], x+dir[1]
			if ynew > 0 && ynew < rows20-1 && xnew > 0 && xnew < cols20-1 {
				if input20[ynew*cols20+xnew] {
					cheat1 := ynew*cols20 + xnew
					for _, dir2 := range dirs20 {
						ynew2, xnew2 := ynew+dir2[0], xnew+dir2[1]
						if (ynew2 != ynew || xnew2 != xnew) && ynew2 > 0 && ynew2 < rows20-1 && xnew > 0 && xnew2 < cols20-1 {
							cheat2 := ynew2*cols20 + xnew2
							count := fast20(cheat1, cheat2)
							if count <= maxcount {
								cheats[stc20{cheat1, cheat2}] = nil
							}
						}
					}
				} else {
					list = append(list, st20{ynew*cols20 + xnew, st.count + 1})
				}
			}
		}
	}
	return len(cheats)
}

// 9324 (sample 84)
func fast20(cheat1, cheat2 int) int {
	old1, old2 := input20[cheat1], input20[cheat2]
	input20[cheat1], input20[cheat2] = false, false
	visited := make(map[int]int)
	list := []st20{{posini20, 0}}
	ret := math.MaxInt
	for len(list) > 0 {
		st := list[0]
		list = list[1:]
		if st.pos == cheat1 {
			st = st20{cheat2, st.count + 1}
		}
		if st.pos == posend20 {
			ret = min(ret, st.count)
			continue
		}
		if v, found := visited[st.pos]; found && st.count >= v {
			continue
		}
		visited[st.pos] = st.count
		y, x := st.pos/cols20, st.pos%cols20
		for _, dir := range dirs20 {
			ynew, xnew := y+dir[0], x+dir[1]
			if ynew >= 0 && ynew < rows20 && xnew >= 0 && xnew < cols20 && !input20[ynew*cols20+xnew] {
				list = append(list, st20{ynew*cols20 + xnew, st.count + 1})
			}
		}
	}
	input20[cheat1], input20[cheat2] = old1, old2
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
