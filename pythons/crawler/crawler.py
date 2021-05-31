"""

for personal usage only

"""
import requests
from bs4 import BeautifulSoup
import random
import os

class Subject:
    crawlResult = []

    def __init__(self, fullname, alias):
        self.fullname = fullname
        self.alias = alias
        a=1

    def setChild(self, subject):
        self.child = subject

    def getKeywords(self):
        return self.alias+[self.fullname]
    
    def getOutputPrefix(self):
        return self.fullname[0:3]
    
    def initCrawler(self):
        print("crawle inited at subject "+self.fullname)
        c = Crawler()
        return 1
    
    def __repr__(self):
        return "Subject::"+self.fullname+"::"+self.alias

class Parser:
    def __init__(self, content):
        self.content = content

    def bsoup(self):
        soup = BeautifulSoup(self.content, 'html.parser')
        return soup

class Crawler:
    # search subject in urls
    def __init__(self,name="crawler", tofile=True):
        # self.tofile = False
        self.tofile = tofile
        self.crawlCnt = 1
        self.name = name
    
    # crawl from single url
    def crawl(self, url):
        # no ssl crawl
        headers = None

        if self.headers is not None:
            headers = self.headers
        # requests.Session()
        req = requests.get(url, verify=False, headers=headers)
        content = req.text
        
        self.crawlCnt +=1

        return req, content

    """
    req, content, soup = c.crawlAndParse(url)
    """
    def crawlAndParse(self, url):
        req, content = self.crawl(url)
        soup = BeautifulSoup(content, 'html.parser')

        return req, content, soup

    def crawlToFile(self, url):
        req, content = self.crawl(url)
        if self.tofile:
            self.toFile("p"+str(self.crawlCnt)+".html",content)
        else:
            print(content)
        
        return req, content

    def toFile(self, fname, write):
        f = open(fname,'w').write(write)
        # if os.exist("result")
        # os.mkdir("result")
        # append filename to result/output endline
        # f = open("output",'w').write(name)
        print("to",fname)

        return 1
    
    def __repr__(self):
        return "Crawler::"+self.name
