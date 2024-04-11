from flask import Flask, jsonify
import board
import adafruit_dht
from threading import Thread
from flask_cors import CORS
import time
from datetime import datetime
import spidev
import RPi.GPIO as GPIO


app = Flask(__name__)
CORS(app)

dht_device = adafruit_dht.DHT22(board.D4)
temperature_c = 0
temperature_f = 0
humidity = 0
val = 0
lidclosed = True


def update_temperature():
    global temperature_c
    global temperature_f
    global humidity
    while True:
        try:
            temperature_c = dht_device.temperature
            temperature_f = temperature_c * (9/5) + 32
            humidity = dht_device.humidity
        except RuntimeError as error:
            print(error.args[0])
        time.sleep(1)

spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz = 5000 

def readChannel(channel):
	val = spi.xfer2([1,(8+channel)<<4,0])
	data = ((val[1]&3) << 8) + val[2]
	return data
val = readChannel(0)

def update_moisture():
	global moisture
	global val
	while True:
		try:
			moisture = 100 * (1 - (val - 270) / (700-270))
		except RuntimeError as error:
			print(error.args[0])
		time.sleep(1)
		
update_thread = Thread(target=update_temperature)
update_thread = Thread(target=update_moisture)
update_thread.daemon = True
update_thread.start()

@app.route('/dht22/tempC', methods=["GET"])
def tempC():
	try:
		temperature_c = dht_device.temperature
		float = temperature_c
		format_tempc = "{:.2f}".format(float)
		return({"temp": format_tempc})
	except RuntimeError as error:
		print(error.args[0])
		
@app.route('/dht22/tempF', methods=["GET"])
def tempF():
	try:
		temperature_c = dht_device.temperature
		float = temperature_c * (9/5) + 32
		format_tempf = "{:.2f}".format(float)
		return({"temp": format_tempf})
	except RuntimeError as error:
	    print(error.args[0])
		
@app.route('/dht22/humidity', methods=["GET"])
def humidity():
	try:
		humidity = dht_device.humidity
		float = humidity
		format_hum = "{:.2f}".format(float)
		return({"humidity": format_hum})
	except RuntimeError as error:
		print(error.args[0])

@app.route('/sensor/Moisture', methods=["GET"])
def Moisture():
	try:
		val = readChannel(0)
		if (val != 0):
			moisture = 100 * (1 - (val - 270) / (700-270))
			float = moisture
			format_moist = "{:.2f}".format(float)
			return({"Moisture": format_moist})
	except RuntimeError as error:
		print(error.args[0])
	
@app.route('/start/watering', methods=["GET"])
def watering():
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(17, GPIO.OUT)
	val = readChannel(0)
	moisture = 100 * (1 - (val - 270) / (700-270))
	if moisture < 55:
		try:
			GPIO.output(17, GPIO.HIGH)
			time.sleep(2.0)
			GPIO.output(17, GPIO.LOW)
			time.sleep(5)
			return("watered")
		except RuntimeError as error:
			print(error.args[0])
	elif moisture > 55:
		return("wet")

@app.route('/start/fan', methods=["GET"])
async def startfan():
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(18, GPIO.OUT)
	temperature_c = dht_device.temperature
	# if (temperature_c * (9/5) + 32) > 74:
	try:
		thread = Thread(target=startFanLogic)
		thread.start()
		return("fan is on")
	except RuntimeError as error:
		return(error.args[0])
	
@app.route('/stop/fan', methods=["GET"])
async def stopfan():
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(18, GPIO.OUT)
	temperature_c = dht_device.temperature
	# if (temperature_c * (9/5) + 32) > 70:
	try:
		thread = Thread(target=stopFanLogic)
		thread.start()
		return("fan is off")
	except RuntimeError as error:
		return(error.args[0])

def startFanLogic():
    GPIO.output(18, GPIO.HIGH)

def stopFanLogic():
    GPIO.output(18, GPIO.LOW)

@app.route('/lighton', methods=["GET"])
def lighton():
	try:
		thread = Thread(target=LightonLogic)
		thread.start()
		return("Lights On")
	except RuntimeError as error:
		return(error.args[0])

def LightonLogic():
	channel = 21
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(channel, GPIO.OUT)
	GPIO.output(channel, GPIO.HIGH)
	
@app.route('/lightoff', methods=["GET"])
def lightoff():
	try:
		thread = Thread(target=LightoffLogic)
		thread.start()
		return("Lights Off")
	except RuntimeError as error:
		return(error.args[0])


def LightoffLogic():
	channel = 21
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(channel, GPIO.OUT)
	GPIO.output(channel, GPIO.LOW)

in1 = 6
in2 = 13
in3 = 19
in4 = 26

def cleanup():
    GPIO.output( in1, GPIO.LOW )
    GPIO.output( in2, GPIO.LOW )
    GPIO.output( in3, GPIO.LOW )
    GPIO.output( in4, GPIO.LOW )
    GPIO.cleanup()



@app.route('/closelid', methods=["GET"])
def closelid():
    import RPi.GPIO as GPIO
    import time
    global lidclosed
    step_sleep = 0.002
    step_count = 2048  # 5.625*(1/64) per step, 4096 steps is 360°
    direction = False  # True for clockwise, False for counter-clockwise
    # defining stepper motor sequence (found in documentation http://www.4tronix.co.uk/arduino/Stepper-Motors.php)
    step_sequence = [[1, 0, 0, 1],
                     [1, 0, 0, 0],
                     [1, 1, 0, 0],
                     [0, 1, 0, 0],
                     [0, 1, 1, 0],
                     [0, 0, 1, 0],
                     [0, 0, 1, 1],
                     [0, 0, 0, 1]]
    # setting up
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(in1, GPIO.OUT)
    GPIO.setup(in2, GPIO.OUT)
    GPIO.setup(in3, GPIO.OUT)
    GPIO.setup(in4, GPIO.OUT)
    # initializing
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)
    motor_pins = [in1, in2, in3, in4]
    motor_step_counter = 0

    if not lidclosed:
        try:
            i = 0
            for i in range(step_count):
                for pin in range(0, len(motor_pins)):
                    GPIO.output(motor_pins[pin], step_sequence[motor_step_counter][pin])
                if direction == True:
                    motor_step_counter = (motor_step_counter - 1) % 8
                elif direction == False:
                    motor_step_counter = (motor_step_counter + 1) % 8
                time.sleep(step_sleep)

            GPIO.output(in1, GPIO.LOW)
            GPIO.output(in2, GPIO.LOW)
            GPIO.output(in3, GPIO.LOW)
            GPIO.output(in4, GPIO.LOW)
            lidclosed = True
            return "Lid closed successfully"
        except KeyboardInterrupt:
            cleanup()
            exit(1)
    else:
        return "Lid is already closed"

		



@app.route('/openlid', methods=["GET"])
def openlid():
    import RPi.GPIO as GPIO
    import time
    global lidclosed
    step_sleep = 0.002
    step_count = 2048  # 5.625*(1/64) per step, 4096 steps is 360°
    direction = True  # True for clockwise, False for counter-clockwise
    # defining stepper motor sequence (found in documentation http://www.4tronix.co.uk/arduino/Stepper-Motors.php)
    step_sequence = [[1, 0, 0, 1],
                     [1, 0, 0, 0],
                     [1, 1, 0, 0],
                     [0, 1, 0, 0],
                     [0, 1, 1, 0],
                     [0, 0, 1, 0],
                     [0, 0, 1, 1],
                     [0, 0, 0, 1]]
    # setting up
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(in1, GPIO.OUT)
    GPIO.setup(in2, GPIO.OUT)
    GPIO.setup(in3, GPIO.OUT)
    GPIO.setup(in4, GPIO.OUT)
    # initializing
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)
    motor_pins = [in1, in2, in3, in4]
    motor_step_counter = 0
    if lidclosed:
        try:
            i = 0
            for i in range(step_count):
                for pin in range(0, len(motor_pins)):
                    GPIO.output(motor_pins[pin], step_sequence[motor_step_counter][pin])
                if direction == True:
                    motor_step_counter = (motor_step_counter - 1) % 8
                elif direction == False:
                    motor_step_counter = (motor_step_counter + 1) % 8
                # else: # defensive programming
                # 	return( "uh oh... direction should *always* be either True or False" )
                # 	cleanup()
                # 	exit( 1 )s
                time.sleep(step_sleep)

            GPIO.output(in1, GPIO.LOW)
            GPIO.output(in2, GPIO.LOW)
            GPIO.output(in3, GPIO.LOW)
            GPIO.output(in4, GPIO.LOW)
            lidclosed = False
            return "Lid opened successfully"  # Return statement added
        except KeyboardInterrupt:
            cleanup()
            exit(1)
    else:
        return "Lid is already opened"


if __name__ == '__main__':
    app.run(debug=True)

@app.route('/clock')
def concat_time_shared_value():
	current_time = datetime.now().strftime('%Y-%m-%d 	%H:%M:%S')
	return jsonify({'time': f'{current_time}'})