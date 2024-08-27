from pickle import TRUE
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from ilock import ILock
import serial
import yaml
import time
from filelock import FileLock, Timeout

def current_millis():
    return round(time.time() * 1000)

def read_yaml(file_path):
    with open(file_path, "r") as f:
        return yaml.safe_load(f)


config = read_yaml("config.yaml")
print(config)
port = config["PORT"]
baud_rate = config["BAUD_RATE"]
read_End = config["READEND"]
delay = config["DELAY"]
print("Server running with serial Connection at: " + port + " , " + str(baud_rate))
print("Server running with settings: read End:" + read_End + " , delay:" + str(delay))



print("Port for serial connection: " + port)

app = Flask (__name__)
app.config ['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ThermoCollect.db'
app.config ["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

from Model.Facade import Facade, FacadeSchema
    
facade_shema = FacadeSchema()
facades_schema = FacadeSchema(many=True)

lock = FileLock("db_init.lock", timeout=10)  
###################################################################################
#check if tables are created
import migrateDb
with app.app_context():
  try:
    with lock:
      tables = db.inspect(db.get_engine()).get_table_names()
      print("logging tables:")
      print(tables)
      if "facade" not in tables:
        migrateDb.initDB()
        tables = db.inspect(db.get_engine()).get_table_names()
        print("logging tables:")
        print(tables)
  except Timeout:
    print("Database initialization lock timeout")
####################################################################################


@app.route('/api')
def hello():
    return 'Hello, World!'

@app.route('/api/facade/<id>', methods=['GET'])
def getFacade(id):
  facade = db.session.get(Facade, id)
  return facade_shema.dump(facade)

@app.route('/api/facade/<id>', methods = ['PUT'])
def updateFacade(id):
  json_data = request.get_json()
  if not json_data:
    return jsonify({'message': 'Invalid request'}), 400

  facade = facade_shema.load(json_data, session = db.session)

  try:
    #todo send commands
    msg = sendSerial(facade.facadeId + ":mod = " + str(facade.mode))
    if(facade.mode == 3 or facade.mode == 4 or facade.mode == 5):
      msg += sendSerial(facade.facadeId + ":par = " + str(facade.angle))

    db.session.add(facade)
    db.session.commit()
    return jsonify({'id' : facade.id, 'message' : msg}), 200
  except Exception as e:
    print(e)
    return jsonify({'message' : 'Error while updating Facade over serialPort ' + str(e), 'facade' : facade_shema.dump(facade)}), 500
 

@app.route('/api/facades')
def getFacades():
  return jsonify(facades_schema.dump(db.session.query(Facade).all()))

@app.route('/api/command', methods = ['PUT'])
def sendCommand():
  json_data = request.get_json()
  if not json_data or "message" not in json_data:
    return jsonify({'message': 'Invalid request or message'}), 400
 
  try:
    msg = sendSerial(json_data["message"])
    return jsonify({"message" : msg}), 200
  except Exception as e:
    print(e)
    return jsonify({'message' : 'Error while updating Facade over serialPort ' + str(e)}), 500
 
##################################################################################################
#send commands over SerialPort
def sendSerial(message, readUntilFlag = True):
    message += "\n"
    with ILock('ZP', timeout=1):
        with serial.Serial(port, baud_rate, timeout=1) as ser:
            start = current_millis()     
            ser.write(message.encode("ASCII"))

            if(readUntilFlag):           
              ans = ser.readline()    
              while(TRUE):
                line = ser.readline() 
                if(read_End in str(line,'UTF8')):
                  ans += line
                  end = current_millis()
                  break
                if(current_millis() > start + 200):
                  ans += line
                  if(read_End in str(ans,'UTF8')):
                    end = current_millis()
                    break
                  else:
                    raise Exception("Timeout was reached, no correct response in 200 ms, msg: " + str(ans,'UTF8').replace('\r',''))
                ans += line

            msg = str(ans,'UTF8')         
            print("Received message: " + msg)
            print(start) 
            print(end) 
            msg += "\ntime: " + str(end - start)
            return msg


if __name__ == "__main__":
    app.run()