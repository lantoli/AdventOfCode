package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"slices"
	"strconv"
	"time"
)

const filepath05 = "inputs/05_input.txt"

func main() {
	fmt.Println(calc05(false)) // 175622908
	fmt.Println(calc05(true))  // XXX   (time: , seeds len: 3.008.511.937)
}

func calc05(expandSeeds bool) int {
	start := time.Now()
	f, _ := os.Open(filepath05)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	seeds := getNums(scanner.Text())
	fmt.Println("BEFORE EXPAND")
	if expandSeeds {
		elms := make(map[int]any)
		for i := 0; i < len(seeds); i += 2 {
			val := seeds[i]
			times := seeds[i+1]
			for j := 0; j < times; j++ {
				elms[val+j] = nil
			}
		}
		i := 0
		seeds = make([]int, len(elms))
		for k := range elms {
			seeds[i] = k
			i++
		}
	}
	follow := 0
	fmt.Println("AFTER EXPAND", len(seeds))
	//	fmt.Println("seeds:", seeds)
	done := make(map[int]bool)
	for scanner.Scan() {
		to := getNums(scanner.Text())
		if len(to) == 0 {
			done = make(map[int]bool)
			follow++
			fmt.Println("RESET", follow)
			continue
		}
		//fmt.Println("TO:", to)
		dest := to[0]
		src := to[1]
		count := to[2]
		for i := 0; i < len(seeds); i++ {
			if !done[i] && seeds[i] >= src && seeds[i] <= src+count-1 {
				seeds[i] = dest + seeds[i] - src
				done[i] = true
			}
		}
		//		fmt.Println("seeds:", seeds)
	}
	fmt.Println("SEEDS:", seeds)
	fmt.Printf("Time %s", time.Since(start))
	return slices.Min(seeds)
}

var pattern = regexp.MustCompile(`(\d+)`)

func getNums(line string) []int {
	matches := pattern.FindAllStringSubmatch(line, -1)
	nums := make([]int, len(matches))
	for i, match := range matches {
		nums[i], _ = strconv.Atoi(match[0])
	}
	return nums
}
