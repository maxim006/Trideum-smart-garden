import spidev
import time
import RPi.GPIO as GPIO
import sys

spi = spidev.SpiDev()
spi.open(0,0)
spi.max_speed_hz = 5000
to_send = [0x01, 0x02, 0x03]
spi.xfer(to_send)
spi.mode = 0b01

def readChannel(channel):
	val = spi.xfer2([1,(8+channel)<<4,0])  
	data = ((val[1]&3) << 8) + val[2]
	return data

val = readChannel(0)
moisture = 100 * (1 - (val - 290) / (720-290))

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.OUT)
Gpio = GPIO.setup(11, GPIO.OUT)
while True:
	try:
		print(moisture)
		time.sleep(2)
	except KeyboardInterrupt:
		sys.exit(0)


# while True:
#     try:    
#         while moisture < 55:
#                 print (moisture)
#                 GPIO.output(11, GPIO.HIGH)
#                 print("pump on")
#                 time.sleep(2)
#                 GPIO.output(11, GPIO.LOW)
#                 print("pump off")
#                 time.sleep(5)
#     except KeyboardInterrupt:
#           sys.exit(0)