from base.cases.DummySKM import DummySKM

class Tester:
    def __init__(self):
        print("Tester::start")
        self.dskm = DummySKM()
    
    def all(self):
        print("Login")
        self.dskm.login("demo","123")

t = Tester()
t.all()