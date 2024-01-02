package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const filepath18 = "inputs/18_sample.txt"

func main() {
	fmt.Println(calc18(false)) // 48652
	fmt.Println(calc18(true))  // XXX
}

func calc18(swap bool) int {
	f, _ := os.Open(filepath18)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	insts := make([]inst18, 0)
	for scanner.Scan() {
		line := scanner.Text()
		if swap {
			idx := strings.Index(line, "(#") + 2
			count, _ := strconv.ParseInt(line[idx:idx+5], 16, 64)
			var ch byte
			switch line[idx+5] {
			case '0':
				ch = 'R'
			case '1':
				ch = 'D'
			case '2':
				ch = 'L'
			case 3:
				ch = 'U'
			}
			insts = append(insts, inst18{ch, int(count)})
		} else {
			parts := strings.Fields(line)
			count, _ := strconv.Atoi(parts[1])
			insts = append(insts, inst18{parts[0][0], count})
		}
	}
	return calc18Main(insts)
}

func calc18Main(insts []inst18) int {
	var ymin, xmin, ymax, xmax, y, x int
	for _, inst := range insts {
		yinc, xinc := inst.inc()
		y, x = y+yinc*inst.count, x+xinc*inst.count
		xmax, xmin, ymin, ymax = max(xmax, x), min(xmin, x), min(ymin, y), max(ymax, y)
	}
	yrange, xrange := ymax-ymin+1, xmax-xmin+1
	grid := make([][]bool, yrange)
	for i := range grid {
		grid[i] = make([]bool, xrange)
	}
	y, x = -ymin, -xmin
	grid[y][x] = true
	for _, inst := range insts {
		yinc, xinc := inst.inc()
		for i := 0; i < inst.count; i++ {
			y, x = y+yinc, x+xinc
			grid[y][x] = true
		}
	}
	fmt.Println("centro", -ymin, -xmin, grid[-ymin][-xmin])
	fmt.Println("esquina", -ymin+1, -xmin+1, grid[-ymin+1][-xmin+1])
	list := append([]int{}, (-ymin+1)*xrange-xmin+1)
	count := 0
	for len(list) > 0 {
		if len(list) > count {
			count = len(list)
			fmt.Println(count)
		}
		newList := make([]int, 0, len(list))
		for _, elm := range list {
			y, x := elm/xrange, elm%xrange
			if !grid[y][x] {
				grid[y][x] = true
				if y-1 >= 0 && !grid[y-1][x] {
					newList = append(newList, xrange*(y-1)+x)
				}
				if y+1 < yrange && !grid[y+1][x] {
					newList = append(newList, xrange*(y+1)+x)
				}
				if x-1 >= 0 && !grid[y][x-1] {
					newList = append(newList, xrange*y+x-1)
				}
				if x+1 < xrange && !grid[y][x+1] {
					newList = append(newList, xrange*y+x+1)
				}
			}
		}
		list = newList
	}
	total := 0
	for y := range grid {
		for x := range grid[y] {
			if grid[y][x] {
				total++
			}
		}
	}
	return total
}

type inst18 struct {
	dir   byte
	count int
}

func (i *inst18) inc() (yinc, xinc int) {
	switch i.dir {
	case 'R':
		xinc = 1
	case 'L':
		xinc = -1
	case 'U':
		yinc = -1
	case 'D':
		yinc = 1
	}
	return
}
