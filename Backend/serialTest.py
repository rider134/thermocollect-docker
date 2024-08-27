import serial


with serial.Serial("/dev/pts/4", 921600, timeout=1) as ser:
    while(1):
        ans = ser.readline() 
        print(ans)
        if("Facade" in str(ans,'UTF8')):
            for i in range(30):
                ser.write(ans)

            ser.write(" OK\n".encode("ASCII"))

