# thx geeks for geeks
import random, string, sys
from pprint import pprint

MORSE_CODE_DICT = {
     'A':'.-', 'B':'-...',
    'C':'-.-.', 'D':'-..', 'E':'.',
    'F':'..-.', 'G':'--.', 'H':'....',
    'I':'..', 'J':'.---', 'K':'-.-',
    'L':'.-..', 'M':'--', 'N':'-.',
    'O':'---', 'P':'.--.', 'Q':'--.-',
    'R':'.-.', 'S':'...', 'T':'-',
    'U':'..-', 'V':'...-', 'W':'.--',
    'X':'-..-', 'Y':'-.--', 'Z':'--..',
    '1':'.----', '2':'..---', '3':'...--',
    '4':'....-', '5':'.....', '6':'-....',
    '7':'--...', '8':'---..', '9':'----.',
    '0':'-----', ', ':'--..--', '.':'.-.-.-',
    '?':'..--..', '/':'-..-.', '-':'-....-',
    '(':'-.--.', ')':'-.--.-'
}

# Function to encrypt the string
# according to the morse code chart
def encrypt(message):
    cipher = ''
    for letter in message:
        if letter != ' ':
  
            # Looks up the dictionary and adds the
            # correspponding morse code
            # along with a space to separate
            # morse codes for different characters
            cipher += MORSE_CODE_DICT[letter] + ' '
        else:
            # 1 space indicates different characters
            # and 2 indicates different words
            cipher += ' '
  
    return cipher
  
def decrypt(message):
    message += ' '
  
    decipher = ''
    citext = ''
    for letter in message:
        if (letter != ' '):
            i = 0
            citext += letter
        else:
            i += 1

            if i == 2 :
                decipher += ' '
            else:
                decipher += list(MORSE_CODE_DICT.keys())[list(MORSE_CODE_DICT
                .values()).index(citext)]
                citext = ''
  
    return decipher

def learn():
    pprint(MORSE_CODE_DICT)

def quiz():
    questions = MORSE_CODE_DICT.keys()
    questions = list([q for q in questions if q in string.ascii_uppercase])
    idx = random.randint(0,len(questions))
    ch = questions[idx]
    inp = input("Morse for "+ch+" > ")
    ans = MORSE_CODE_DICT[ch]
    if ans == inp:
        print("correct!")
    else:
        print("false! ans:",ch,"=",ans)

# Hard-coded driver function to run the program
def main():
    message = "GEEKS-FOR-GEEKS"
    result = encrypt(message.upper())
    print (result)
  
    message = "--. . . -.- ... -....- ..-. --- .-. -....- --. . . -.- ... "
    result = decrypt(message)
    print (result)
  
# Executes the main function
if __name__ == '__main__':
    arg1 = sys.argv[1]
    if arg1 == "" or arg1 == "main":
        main()
    elif arg1 == "q":
        quiz()
    elif arg1 == "l":
        learn()
    else:
        main()