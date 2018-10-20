# imports
"""

string.punctuation
"""
# pre
from nltk.tokenize import TweetTokenizer
import string

# ===input===
# file txt
f=open('java.txt','r')

text=f.read()
print(text)

# ===preproses===

# pre init
tknzr = TweetTokenizer(strip_handles=True, reduce_len=True)
# pecah kalimat dengan titik
pre1=text.split(". ")

print(len(pre1))
tok=[]
lspct = list(string.punctuation)

# """
# d tokenizing
# return list
def tokenizepunc(pre1):
	res=[]

	for t,i in zip(pre1,range(1,len(pre1))):
		# print("\n",str(i))
		# print(t)
		to=tknzr.tokenize(t)
		# print("to ",to)
		pre2=[]
		
		for t2 in to:
			# print(t2)
			if t2 not in lspct:
				pre2.append(t2)
		# print("tokenized "," ".join(pre2))
		res.append(" ".join(pre2))
	
	return res
# """

print(tokenizepunc(pre1))

# , stopword removal
def preproses():
	pass

# ===proses===
# reprentasi graf &bobot
# &&&
# ===output===
# jadiken satu
def proses():
	pass
	

# ===evaluasi===
def evaluasi():
	pass
# print()
