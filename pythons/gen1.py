
"""
sort of meta-programming generator
likethis

function dibch(){
echo "
1 /media/c/
2 /media/c/play/

"

read in1
echo in-$in1
if [ $in1 = 1 ];then
	cd /media/c/
elif [ $in1 = 2 ];then
	cd /media/c/play/
fi

}

"""

file1='dibdevcmd.sh'
f=open(file1,'r')
cmds=f.read()
cmds=cmds.split('\n')
# example
cmdlist=""
generated=""
n=1
for i in cmds:
	if i=="" or i==" ":
		break

	cmdlist+="%d %s"%(n,i)
	cmdlist+="\n"
	if n==1:
		generated+="if [ $in1 = 1 ];then\n\t%s\n"%(i)
	else:
		generated+="elif [ $in1 = %d ];then\n\t%s\n"%(n,i)
	if n==len(i):
		generated+="fi"

	n+=1

echo1="echo \"%s\"\n"%(cmdlist)

cmd="""\

read in1
echo in-$in1
%s
"""%(generated)

isi="%s %s"%(echo1,cmd)

function1="""function dibch(){
%s
}
"""%(isi)

functions=function1
call="""
dibch
"""

out="%s\n%s"%(functions,call)

print(out)
# s1="%s",('\n')
# print(s1)
#echo choosen - $1
