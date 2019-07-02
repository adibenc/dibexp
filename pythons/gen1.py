
"""
sort of meta-programming generator
likethis

function dibch(){
echo "
1 /media/c/
2 /media/c/play/
3 /media/c/play/ctf
4 /media/c/play/tools
5 /media/data3.23/project
6 /media/data3.23/project/pythons
7 /opt/lampp/htdocs/sisarpras
8 /opt/lampp/htdocs/rekap
9 /opt/lampp/htdocs/realcount
10 /media/c/play/comp.prog/findit
11 /media/data3.23/project/smasjid/smasjid-laravel
12 /media/data3.23/project/pythons

"

read in1
echo in-$in1
if [ $in1 = 1 ];then
	cd /media/c/
elif [ $in1 = 2 ];then
	cd /media/c/play/
elif [ $in1 = 3 ];then
	cd /media/c/play/ctf
elif [ $in1 = 4 ];then
	cd /media/c/play/tools
elif [ $in1 = 5 ];then
	cd /media/data3.23/project
elif [ $in1 = 6 ];then
	cd /media/data3.23/project/pythons
elif [ $in1 = 7 ];then
	cd /opt/lampp/htdocs/sisarpras
elif [ $in1 = 8 ];then
	cd /opt/lampp/htdocs/rekap
elif [ $in1 = 9 ];then
	cd /opt/lampp/htdocs/realcount
elif [ $in1 = 10 ];then
	cd /media/c/play/comp.prog/findit
elif [ $in1 = 11 ];then
	cd /media/data3.23/project/smasjid/smasjid-laravel
elif [ $in1 = 12 ];then
	cd /media/data3.23/project/pythons
fi

}

"""

file1='dibdevcmd.sh'
# f=open(file1,'r')
# cmds=f.read()

# example

echo1="""echo "
1 /media/c/
2 /media/c/play/" """

cmd="""\

read in1
echo in-$in1

if [ $in1 = 1 ];then
	cd /media/c/
elif [ $in1 = 2 ];then
	cd /media/c/play/
fi
"""

isi="%s\n\n%s"%(echo1,cmd)
function1="""function dibch(){\n%s\n}\n

dibch
"""%(isi)

print(function1)

#echo choosen - $1
