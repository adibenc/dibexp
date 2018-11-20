#!/bin/python3
# quote dalam sequence, lalu di random. customizable . Bisa dipakai di banner terminal linux.
#
# cara menampilkan banner di terminal linux.
# 1 copy quotes.py ke ~ (home dir linux)
# 2 tambahkan "python ~/quotes.py" di paling bawah .bashrc (buka .bashrc di direktori home dir)
# 3 di test. Buka terminal

import random

# f=open("~/scripts/quotes.txt",'r')
f=open("/home/x7a616d/scripts/quotes.txt",'r')
qts=f.read()
# qts=qts.split(',')
# split with """\n
qts=qts.split('"""\n')
# quotes = ()

p1="\n\n" #padding

print(len(qts))
print(p1,random.choice(qts).replace('"""',''),p1)
