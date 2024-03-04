#!/bin/bash

cd ~
sudo apt update
sudo apt upgrade
sudo apt install python3-dev python3-pip
cd Trideum-smart-garden
python3 -m venv env
. ./env/bin/activate
pip install -r Requirements.txt
echo "done"
