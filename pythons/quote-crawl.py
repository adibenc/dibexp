from urllib import request

print("quotes :)")
# idrange=[1,20]
# idrange=[15,20]
idrange=[1,2001]
url="http://quotesondesign.com/wp-json/posts/"
res=""
zero=[]

def url1(url,p1):
    return

for i in range(idrange[0],idrange[1]):
    try:
        un=url+str(i)
        print(un)
        r1=request.urlopen(un)
        str1=str(r1.read())
        res+=str1+"\n"
        if i!=idrange[1]:
            res+=","
        print(str1)
    # except HTTPError as he:
    except :
        print(i,"x")
        zero.append(i)
        pass
    if i%100==0:
		
		fout=str(i)+".txt"
		print(res)
		res=res.replace('b\'',"")
		res=res.replace('}\'',"}")
		print(res)
		p1="["
		p2="]"
		fout2=open(fout,'w')
		fout2.write(p1+res+p2)
		print("written to",fout)
		print("zero",zero)
