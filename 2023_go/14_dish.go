package main

import (
	"bufio"
	"fmt"
	"os"
)

const filepath14 = "inputs/14_input.txt"

func main() {
	fmt.Println(calc14()) // 109665
}

func calc14() int {
	f, _ := os.Open(filepath14)
	defer f.Close()
	scanner := bufio.NewScanner(f)
	m := make([][]byte, 0)
	for scanner.Scan() {
		m = append(m, []byte(scanner.Text()))
	}
	return calc14Main(m)
}

func calc14Main(m [][]byte) int {
	rows, cols := len(m), len(m[0])
	for y := 1; y < rows; y++ {
		for x := 0; x < cols; x++ {
			if m[y][x] == 'O' {
				for inc := 1; y-inc >= 0 && m[y-inc][x] == '.'; inc++ {
					m[y-inc][x] = 'O'
					m[y-inc+1][x] = '.'
				}
			}
		}
	}
	total := 0
	for y := 0; y < rows; y++ {
		for x := 0; x < cols; x++ {
			if m[y][x] == 'O' {
				total += rows - y
			}
		}
	}
	return total
}
