from selenium import *
from .browser import Browser

class BaseSelenium:
    URL = "https://www.instagram.com"
    RETRY_LIMIT = 10

    def __init__(self, has_screen=True):
        self.browser = Browser(has_screen, driverPath="/media/data1/project1/dibexp/pythons/seleniums/dummy/chromedriver")
        self.page_height = 0
    
    def logger(self, string):
        print("Base::%s " % string)

    def toPage(self, url):
        browser = self.browser
        return browser.get(url)
    
    def fillField(self, el, data):
        browser = self.browser

        field = browser.find_one(el)
        field.send_keys(data)

        return el, data
    
    def clickEl(self, el):
        browser = self.browser

        clickable = browser.find_one(el)
        clickable.click()

        return el

    def login(self, username="", passwd=""):
        url = "%s/accounts/login/" % (self.URL)
        self.toPage(url)
        browser = self.browser
        u_input = browser.find_one('input[name="username"]')
        u_input.send_keys(username)
        p_input = browser.find_one('input[name="password"]')
        p_input.send_keys(passwd)

        login_btn = browser.find_one(".L3NKy")
        login_btn.click()