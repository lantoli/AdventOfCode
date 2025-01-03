package main

import (
	"fmt"
	"strings"
)

var (
	isInput17 = true
)

// 3,6,3,7,0,7,0,3,0 XX (sample 4,6,3,5,6,3,5,2,1,0 XX)
// takes minutes using parallelism, algorithm can surely be optimized to run in seconds in serial
func main() {
	solve17(false)
}

func solve17(partB bool) {
	a, b, c := 729, 0, 0
	program := []int{0, 1, 5, 4, 3, 0}
	out := make([]int, 0)
	if isInput17 {
		a = 51064159
		program = []int{2, 4, 1, 5, 7, 5, 1, 6, 0, 3, 4, 6, 5, 5, 3, 0}
	}
	// examples
	// a, b, c, program = 0, 0, 9, []int{2, 6}
	// a, b, c, program = 10, 0, 0, []int{5, 0, 5, 1, 5, 4}
	// a, b, c, program = 2024, 0, 0, []int{0, 1, 5, 4, 3, 0}
	for ip := 0; ip < len(program); {
		opcode, literal := program[ip], program[ip+1]
		combo := literal
		if literal == 4 {
			combo = a
		} else if literal == 5 {
			combo = b
		} else if literal == 6 {
			combo = c
		}
		moveip := true
		switch opcode {
		case 0: // adv
			a /= 1 << combo
		case 1: // bxl
			b ^= literal
		case 2: // bst
			b = combo % 8
		case 3: // jnz
			if a != 0 {
				moveip = false
				ip = literal
			}
		case 4: // bxc
			b ^= c
		case 5: // out
			out = append(out, combo%8)
		case 6: // bdv
			b = a / (1 << combo)
		case 7: // cdv
			c = a / (1 << combo)
		default:
			panic(fmt.Sprintf("invalid opcode: %d", opcode))
		}
		if moveip {
			ip += 2
		}
	}
	fmt.Println(strings.Trim(strings.Join(strings.Fields(strings.Trim(fmt.Sprint(out), "[]")), ","), " "))
}
