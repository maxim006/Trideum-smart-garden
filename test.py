from flask import Flask, jsonify
import board
import adafruit_dht
from threading import Thread
from flask_cors import CORS
import time
from datetime import datetime
import spidev
import RPi.GPIO as GPIO
channel = 22
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.OUT)


def GPIOcleanup():
    GPIO.output(channel, GPIO.LOW)



while True:
    try:
       GPIO.output(channel, GPIO.HIGH)
       print("on")
       time.sleep(5)
    except KeyboardInterrupt:
        GPIO.output(channel, GPIO.LOW)
        exit(1)



