from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



dht_device = adafruit_dht.DHT22(board.D4)

@app.route('/dht22/tempC', methods=["GET"])
def tempC():
	try:
		temperature_c = dht_device.temperature
		return({"temp": temperature_c})
	except RuntimeError as error:
		print(error.args[0])
		
@app.route('/dht22/tempF', methods=["GET"])
def tempF():
   try:
      temperature_c = dht_device.temperature
      temperature_f = temperature_c * (9/5) + 32
      return({"temp": temperature_f})
   except RuntimeError as error:
      print(error.args[0])
		
@app.route('/dht22/humidity', methods=["GET"])
def humidity():
	try:
		humidity = dht_device.humidity
		return({"temp": humidity})
	except RuntimeError as error:
		print(error.args[0])
		
@app.route('/start/watering', methods=["GET"])
def watering():
	return "watering"

if __name__ == "__main__":
        app.run(host="127.0.0.1", port=5000, debug=True)

