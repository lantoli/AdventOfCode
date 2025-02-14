package main

import (
	"fmt"
	"strings"
)

var (
	isInput17 = true
)

// 3,6,3,7,0,7,0,3,0 869230000000 too low (sample 4,6,3,5,6,3,5,2,1,0 117440)
// takes hours, algorithm can surely be optimized
// WIP: 374940000000000, estimated 8^11 = 281474976710656
func main() {
	//solve17a()
	solve17c()
}

func solve17a() {
	a, b, c := 729, 0, 0
	program := []int{0, 1, 5, 4, 3, 0}
	if isInput17 {
		a = 51064159
		program = []int{2, 4, 1, 5, 7, 5, 1, 6, 0, 3, 4, 6, 5, 5, 3, 0}
	}
	out := calc17(a, b, c, program, false)
	fmt.Println(strings.Trim(strings.Join(strings.Fields(strings.Trim(fmt.Sprint(out), "[]")), ","), " "))
}

func solve17b() {
	b, c := 0, 0
	program := []int{0, 3, 5, 4, 3, 0}
	if isInput17 {
		program = []int{2, 4, 1, 5, 7, 5, 1, 6, 0, 3, 4, 6, 5, 5, 3, 0}
	}
	for a := 0; ; a++ {
		if a%10_000_000 == 0 {
			fmt.Println(a)
		}
		if calc17(a, b, c, program, true) != nil {
			fmt.Println(a)
			break
		}
	}
}

func solve17c() {
	program := []int{2, 4, 1, 5, 7, 5, 1, 6, 0, 3, 4, 6, 5, 5, 3, 0}
outer:
	for aa := 374940000000000; ; aa++ {
		if aa%10_000_000_000 == 0 {
			fmt.Println(aa)
		}
		count := 0
		for a, b := aa, 0; a > 0; count++ {
			b = (a & 7) ^ 5
			a /= 1 << 3
			out := (b ^ 6 ^ (a / (1 << b))) & 7
			if count == len(program) || out != program[count] {
				continue outer
			}
		}
		if count == len(program) {
			fmt.Println(aa)
			break
		}
	}
}

func calc17(a, b, c int, program []int, checkEqual bool) []int {
	out := make([]int, 0)
	outCount := 0
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
			val := combo % 8
			if checkEqual {
				if outCount == len(program) || val != program[outCount] {
					return nil
				}
				outCount++
			} else {
				out = append(out, val)
			}
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
	if checkEqual {
		if outCount != len(program) {
			return nil
		} else {
			return program
		}
	}
	return out
}
