#dib.map.list.txt
#th
#cat dib.map.list.txt | xargs (echo 2019 | tee ) --> salah

import os

msgs=['done']

f1 = open('dib.map.list.txt','r')
list1=f1.read()
list1=list1.split('\n')

tahun=19
ext='.txt'
i=0
while True:
	try:
		tahun=int(input('masukkan tahun : '))
		break
	except:
		print('coba lg')
		i+=1
		if i > 3: 
			print('hmm')
			exit(0)

tahun+=2000
s='.' #separator
gdir=str(tahun)

os.mkdir(gdir)

for l in list1:
	for i in range(1,3):
		fname='./'+gdir+'/'+str(tahun)+s+l+s+str(i)+ext
		print(fname,"ready")
		f2=open(fname,'w')
		if i == 1:
			fname+='\n0101'+str(tahun)
		elif i == 2:
			fname+='\n0107'+str(tahun)
		
		f2.write(fname)
		f2.close()

print(msgs[0])
