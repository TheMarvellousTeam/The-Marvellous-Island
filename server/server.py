#!/usr/bin/python3

import socket
import threading
import argparse

class RemoteListener(threading.Thread):
    def __init__(self, connection):
        threading.Thread.__init__(self)
        self.connection = connection

    def listen(self):
        while True:
            data = self.connection.recv(16)
            if data:
                print(data)

    def close(self):
        self.connection.close()


#parsing des options
parser = argparse.ArgumentParser()
parser.add_argument("-ip")
parser.add_argument("-port")

args = parser.parse_args()


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind((args.ip, int(args.port)))

sock.listen(1)

while True:
    connection, client_addr = sock.accept()
    print(client_addr)
    listener = RemoteListener(connection)
    try:
        listener.listen()
    finally:
        listener.close()

sock.close()        
