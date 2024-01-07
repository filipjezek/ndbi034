from typing import Tuple
import math

# https://stackoverflow.com/a/36867493

def calc_row_idx(k: int, n: int) -> int:
    try:
        foo = int(math.ceil((1/2.) * (- (-8*k + 4 *n**2 -4*n - 7)**0.5 + 2*n -1) - 1))
    except:
        print(k, n)
        raise
    return foo

def elem_in_i_rows(i: int, n: int) -> int:
    return i * (n - 1 - i) + (i*(i + 1))//2

def calc_col_idx(k: int, i: int, n: int) -> int:
    return n - elem_in_i_rows(i + 1, n) + k

def condensed_to_square_idx(idx: int, n: int) -> Tuple[int, int]:
    i = calc_row_idx(idx, n)
    j = calc_col_idx(idx, i, n)
    return i, j