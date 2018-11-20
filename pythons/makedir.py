import os

dirs=[]

f1=open('c.dirs.txt','r')
dir1=f1.read()

dirs=dir1.split('\n')

for d in dirs[:20]:
    os.mkdir(d)
    print("mkdired->",d)

print("done !")
