#dib.map.list.txt
#th
#cat dib.map.list.txt | xargs (echo 2019 | tee ) --> salah

#crypto
msgs=['done']

f1 = open('dib.map.list.txt','r')
list1=f1.read()
list1=list1.split('\n')

tahun=19
ext='.txt'
# while True:
	# try:
		# tahun=int(input('masukkan tahun'))
		# break
	# except:
		# print('coba lg')
tahun+=2000

for l in list1:
	fname=str(tahun)+'.'+l+ext
	print(fname," ready")
	f2=open(fname,'w')
	f2.write(fname)

print(msgs[0])
