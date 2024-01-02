package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

const filepath18 = "inputs/18_input.txt"

func main() {
	fmt.Println(calc18()) // 48652
}

func calc18() int {
	f, _ := os.Open(filepath18)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	insts := make([]inst18, 0)
	for scanner.Scan() {
		parts := strings.Fields(scanner.Text())
		count, _ := strconv.Atoi(parts[1])
		insts = append(insts, inst18{parts[0][0], count})
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
	grid := make([][]int, yrange)
	for i := range grid {
		grid[i] = make([]int, xrange)
	}
	y, x = -ymin, -xmin
	grid[y][x] = 1
	for _, inst := range insts {
		yinc, xinc := inst.inc()
		for i := 0; i < inst.count; i++ {
			y, x = y+yinc, x+xinc
			grid[y][x] = 1
		}
	}
	fmt.Println("centro", -ymin, -xmin, grid[-ymin][-xmin])
	fmt.Println("esquina", -ymin+1, -xmin+1, grid[-ymin+1][-xmin+1])
	list := append([]coord18{}, coord18{-ymin + 1, -xmin + 1})
	for len(list) > 0 {
		newList := []coord18{}
		for _, elm := range list {
			y, x = elm.y, elm.x
			if grid[y][x] == 0 {
				grid[y][x] = 2
				if y-1 >= 0 && grid[y-1][x] == 0 {
					newList = append(newList, coord18{y - 1, x})
				}
				if y+1 < yrange && grid[y+1][x] == 0 {
					newList = append(newList, coord18{y + 1, x})
				}
				if x-1 >= 0 && grid[y][x-1] == 0 {
					newList = append(newList, coord18{y, x - 1})
				}
				if x+1 < xrange && grid[y][x+1] == 0 {
					newList = append(newList, coord18{y, x + 1})
				}
			}
		}
		list = newList
	}
	total := 0
	for y := range grid {
		for x := range grid[y] {
			if grid[y][x] > 0 {
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

type coord18 struct {
	y, x int
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
