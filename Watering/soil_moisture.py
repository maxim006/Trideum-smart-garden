import spidev 
import time

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

if __name__ == "__main__":
	try:
		while True:
			val = readChannel(0)
			# moisture = 100 * (1 - (val - 290) / (720-290))
			# if (val < 725) and (val > 270):
			# 	print(moisture, "%")
			# else: print("100%")
			print(val)
			time.sleep(2)
	except KeyboardInterrupt:
		print ("ancel.")

