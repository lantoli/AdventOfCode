package main

import (
	"bufio"
	"fmt"
	"os"
	"slices"
	"sort"
	"strings"
)

// 1083 XX (sample 7 XX)
func main() {
	solve23a()
}

var (
	file23 = "23_input.txt"
)

func solve23a() {
	f, _ := os.Open("inputs/" + file23)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	m := make(map[string][]string)
	elms := make(map[string]struct{})
	for scanner.Scan() {
		line := scanner.Text()
		a, b := line[0:2], line[3:5]
		elms[a] = struct{}{}
		elms[b] = struct{}{}
		m[a] = append(m[a], b)
		m[b] = append(m[b], a)
	}
	sorted := make([]string, 0, len(elms))
	for k := range elms {
		sorted = append(sorted, k)
	}
	sort.Strings(sorted)
	n := len(sorted)
	matrix := make([]bool, n*n)
	for i := range sorted {
		for _, val := range m[sorted[i]] {
			j := slices.Index(sorted, val)
			matrix[i*n+j] = true
			matrix[j*n+i] = true
		}
	}
	rets := make(map[string]struct{}, 0)
	for i := range sorted {
		if !strings.HasPrefix(sorted[i], "t") {
			continue
		}
		for j := range sorted {
			if j == i || !matrix[i*n+j] {
				continue
			}
			for k := j + 1; k < n; k++ {
				if k == i || !matrix[j*n+k] {
					continue
				}
				if matrix[i*n+k] {
					ret := []string{sorted[i], sorted[j], sorted[k]}
					sort.Strings(ret)
					rets[ret[0]+ret[1]+ret[2]] = struct{}{}
				}
			}
		}
	}
	fmt.Println(len(rets))
}

func extract23(elms map[string]struct{}) string {
	if len(elms) == 0 {
		panic("empty")
	}
	for k := range elms {
		delete(elms, k)
		return k
	}
	panic("unreachable")
}
