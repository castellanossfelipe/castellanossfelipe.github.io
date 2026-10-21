import math

"""
A full (or complete) binary search tree is a binary search tree where all the levels are full.
A tree like this contains 2^k -1  nodes if the tree has k levels.
Let's suppose that the tree contains different integers from interval [1, 2^k] = {1,2,3,..., 2^k},
that is one number is missing.

Your task is to write a code to find this missing number in O(k) steps.

The tree (that is the input of your code) is given by a tuple, where the first member of the tuple is
the value  being in the root while the second member of the tuple is a list of length $2^k$, where list[i] is a small list for each i:

- if i+1 is the missing number then this small list is empty
- if i+1 is a leaf in the tree then the small list is [0, 0]
- if i+1 is an inner node in the tree then the small list is [left_child, right_child].

In your code you may suppose that the input array represents a non-empty,
valid full binary search tree.
"""

# some sample inputs

A = (3, [[0, 0], [], [1, 4], [0, 0]]) # 2 is missing
B = (4, [[0, 0], [1, 3], [0, 0], [2, 6], [0, 0], [5, 7], [0, 0], []]) # 8 is missing
C = (8, [[0, 0], [1, 3], [0, 0], [2, 6], [0, 0], [5, 7], [0, 0], [4, 13], [], [0, 0], [10, 12], [0, 0], [11, 15], [0, 0], [14, 16], [0, 0]]) # 9 is missing

D = (2, [[0, 0], [1, 3], [0, 0], []]) # 4 is missing
E = (5, [[0, 0], [1, 3], [0,0], [], [2, 7], [0, 0], [6, 8], [0, 0]]) # 4 is missing
F = (8, [[0, 0], [1, 3], [0, 0], [2, 6], [0, 0], [5, 7], [0, 0], [4, 12], [0,0], [9, 11], [0, 0], [10, 15], [], [0, 0], [14, 16], [0, 0]]) # 13 is missing


def missing_number(input):
    two_k = len(input[1])
    k = int(math.log2(two_k))

    left_bound = 1
    # We could set an upper bound (right = 2^(k)), but that is accounted for in t and mid

    current_node = input[0]
    t = k
    while current_node is not None:
        mid = left_bound + 2**(t-1) - 1
        if current_node == mid:
            left_bound = current_node + 1

            if input[1][current_node-1][1] is not None and input[1][current_node-1][1] != 0:
                right_child = int(input[1][current_node-1][1])
            else:
                right_child = None

            current_node = right_child

        elif current_node > mid:
            # We could do right = current_node - 1, however, that is unnecessary
            if input[1][current_node-1][0] is not None and input[1][current_node-1][0] != 0:
                left_child = input[1][current_node-1][0]
            else:
                left_child = None

            current_node = left_child

        t = t - 1
    return left_bound

print(missing_number(A))
print(missing_number(B))
print(missing_number(C))
print(missing_number(D))
print(missing_number(E))
print(missing_number(F))