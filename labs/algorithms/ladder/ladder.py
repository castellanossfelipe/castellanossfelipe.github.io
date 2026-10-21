def ways_up_to_the_top(array):
	dp = [None] * len(array)

	for i in range(len(array)):
		if i == 0:
			if array[0] == 1:
				dp[0] = 1
			else:
				dp[0] = 0
		
		if i == 1:
			if array[1] == 1:
				dp[1] = dp[0] + 1
			else:
				dp[1] = 0

		if i == 2:
			if array[2] == 1:
				dp[2] = dp[0] + dp[1] + 1
			else:
				dp[2] = 0
		
		if i >= 3:
			if array[i] == 1:
				dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
			else:
				dp[i] = 0

	return dp[-1]

# test cases

A = [0,0,1,1,1] # 2
B = [1,1,0,0,0,1] # 0
C = [1,1,1,1,1] # 13
D = [0,1,0,0,1] # 1
E = [0,1,1,1,0,1] # 5
F = [1,0,1,0,1,0,1] # 2
G = [1,1,0,1,1,0,1] # 8

H = [1,1,1,0,0,1,1,0,0,1] # 4 
I = [1,0,1,1,0,0,1,0,1,1] # 6
J = [1,1,1,1,1,1,1,1,1,1,1,1,1] # 1705
K = [1,1,1,1,1,1,1,1,1,1,1,1,1,1] # 3136
L = [1] # 1

test_cases = [A, B, C, D, E, F, G, H, I, J, K, L]

for test_case in test_cases:
	print (ways_up_to_the_top(test_case))

# 
