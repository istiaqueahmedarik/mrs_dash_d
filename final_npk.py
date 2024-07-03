from flask import Flask, render_template
from flask_socketio import SocketIO
import minimalmodbus
import serial
import time
import threading
import random
from flask_cors import CORS  # Import CORS from flask-cors

# Initialize Flask and SocketIO
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app,cors_allowed_origins="*")
import serial.tools.list_ports

def list_com_ports():
    ports = serial.tools.list_ports.comports()
    available_ports = [port.device for port in ports]
    return available_ports
list_com_ports()

# Configure the instrument (sensor)
# instrument = minimalmodbus.Instrument('COM14', 1)  # Port name, slave address (in decimal)
# instrument.serial.baudrate = 4800
# instrument.serial.bytesize = 8
# instrument.serial.parity = serial.PARITY_NONE
# instrument.serial.stopbits = 1
# instrument.serial.timeout = 1  # seconds

# Function to read and emit sensor data
def read_sensor_data():
    while True:
        try:
            # Read and scale humidity (address 0x0000)
            # humidity_raw = instrument.read_register(0x0000, 0, 3)
            # humidity = humidity_raw * 0.1
            humidity = random.randint(0, 100)
            # Read and scale temperature (address 0x0001)
            # temperature_raw = instrument.read_register(0x0001, 0, 3)
            # temperature = temperature_raw * 0.1
            temperature = random.randint(0, 100)
            # Read conductivity (address 0x0002)
            # conductivity_raw = instrument.read_register(0x0002, 0, 3)
            # conductivity = conductivity_raw
            # conductivity = random.randint(0, 100)
            # Read and scale pH (address 0x0003)
            # ph_raw = instrument.read_register(0x0003, 0, 3)
            # ph = ph_raw * 0.1
            conductivity = random.randint(0, 100)
            # Read nitrogen (address 0x0004)
            # nitrogen_raw = instrument.read_register(0x0004, 0, 3)
            # nitrogen = nitrogen_raw
            nitrogen = random.randint(0, 100)
            # Read phosphorus (address 0x0005)
            # phosphorus_raw = instrument.read_register(0x0005, 0, 3)
            # phosphorus = phosphorus_raw
            phosphorus = random.randint(0, 100)
            # Read potassium (address 0x0006)
            # potassium_raw = instrument.read_register(0x0006, 0, 3)
            # potassium = potassium_raw
            potassium = random.randint(0, 100)

            # ph_raw = instrument.read_register(0x0003, 0, 3)
            # ph = ph_raw * 0.1
            # print(f"pH: {ph} (Raw: {ph_raw})")
            ph = random.randint(0, 100)

            # Emit data to the client

            sensor_data = {
                "humidity": humidity,
                "temperature": temperature,
                "conductivity": conductivity,
                "ph": ph,
                "nitrogen": nitrogen,
                "phosphorus": phosphorus,
                "potassium": potassium
            }
            print(sensor_data)
            socketio.emit('sensor_data', sensor_data)

        except minimalmodbus.NoResponseError:
            print("Error: No response from the sensor. Check connections and power.")
        except minimalmodbus.InvalidResponseError:
            print("Error: Received invalid response from the sensor.")
        except Exception as e:
            print(f"Error: {e}")

        time.sleep(5)  # Wait for 5 seconds before the next read

# Background thread for reading sensor data
def start_reading():
    thread = threading.Thread(target=read_sensor_data)
    thread.daemon = True
    thread.start()



# Run the server
if __name__ == '__main__':
    start_reading()
    socketio.run(app, host='0.0.0.0', port=5000)

