
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import rospy
from std_msgs.msg import String
from flask_cors import CORS
# Initialize Flask and Flask-SocketIO
app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# HTML template for a simple client
html_template = """
<!DOCTYPE html>
<html>
<head>
    <title>Sensor Data</title>
    <script src="https://cdn.socket.io/4.0.1/socket.io.min.js"></script>
    <script type="text/javascript" charset="utf-8">
        document.addEventListener('DOMContentLoaded', function () {
            var socket = io();
            socket.on('sensor_data', function (data) {
                document.getElementById('data').innerText = 'Sensor Data: ' + data;
            });
        });
    </script>
</head>
<body>
    <h1>Sensor Data</h1>
    <p id="data">Waiting for data...</p>
</body>
</html>
"""

@app.route('/')
def index():
    return html_template

# Callback function to handle data received from ROS topic
def ros_callback(data):
    sensor_data = data.data
    socketio.emit('sensor_data', sensor_data)





# Start the Flask-SocketIO server
if __name__ == '__main__':
    rospy.init_node('web_socket_subscriber', anonymous=True)
    rospy.Subscriber('/sensor_data', String, ros_callback)
    socketio.run(app, host='0.0.0.0', port=5000)