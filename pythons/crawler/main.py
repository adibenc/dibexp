from crawler import *
# from dummyheader import setting

c = Crawler()
url = "url"
c.headers = setting['headers'][0]
req, content, soup = c.crawlAndParse(url)
c.toFile("dummy/site.a", content)