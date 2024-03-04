from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/fizzbuzz', methods=["POST"])
def fizzbuzz():
   number = request.get_json()

   num = int(number['fizzbuzz'])

   if request.method == 'POST':
      if num == 0:  
         return({"FizzBuzz":"WOMP WOMP"})
      elif num%3==0 and num%5==0: 
         return({"FizzBuzz":"FizzBuzz"})
      elif num%5==0 :
         return({"FizzBuzz":"Buzz"})
      elif num%3==0 :
         return({"FizzBuzz":"Fizz"})
      else: return({"FizzBuzz":"WOMP WOMP"}) 
       


if __name__ == "__main__":
        app.run(host="127.0.0.1", port=5000, debug=True)

