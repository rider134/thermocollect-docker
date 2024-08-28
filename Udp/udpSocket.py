import socket
import logging

class CustomFormatter(logging.Formatter):

    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)"

    FORMATS = {
        logging.DEBUG: grey + format + reset,
        logging.INFO: grey + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


def extract_ip():
    st = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:       
        st.connect(('10.255.255.255', 1))
        IP = st.getsockname()[0]
    except Exception:
        IP = 0
    finally:
        st.close()
    return IP


logging.basicConfig(filename="/var/log/udpServer/udpServer.log", format='%(asctime)s %(message)s')
log = logging.getLogger("udpServerLog")
logging.root.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

ch.setFormatter(CustomFormatter())

log.addHandler(ch)

log.info("Udp Thread running")

server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server_socket.bind(('', 12000))


while True:
    try:
        message, address = server_socket.recvfrom(1024)
        log.info("CLient Adress:" + str(address))
        ip = extract_ip()

        if(ip == 0):
            raise Exception("no Ip found")
        
        log.info('Server Ip: ' + str(ip))
       #addrs = netifaces.ifaddresses('wlan0')
       # log.info(addrs)
        
       # if netifaces.AF_INET in addrs:
       #     message = addrs[netifaces.AF_INET]
        #    log.info('ip: ' + message)
        #else :
        #   log.warn('netifaces no ip found')

        server_socket.sendto(bytes(ip, encoding='utf8'), address)
    except Exception as err:
        log.error("error: " + str(err))






