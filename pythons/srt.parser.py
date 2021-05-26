# srt subtitle parser to basic datatypes
import re

patterns = {
    "base": r"[0-9]{1,4}\n.*\n.*\n.*",
    "idx": r"[0-9]{1,4}\n",
    "time": r".* --> .*",
    "text": r",[0-9]{3}\n.*\n.*",
    "lasttime": r",[0-9]{3}\n",
}

def parse(sub):
    text = re.findall( patterns['text'], sub )
    text = re.sub( patterns["lasttime"], "", text[0] )
    ret = {
        "idx": re.findall( patterns['idx'], sub ),
        "time": re.findall( patterns['time'], sub ),
        "text": text,
    }

    return ret

fname = "en.av.end.srt"
content = open(fname, "r").read()
subs = re.findall( patterns['base'] ,content)
print(len(subs))
print(subs[0])
print(parse(subs[0]))

with open("result", 'w') as f:
    for sub in subs:
        p = parse(sub)
        f.write(p['text'] + "\n")
    print("finish")