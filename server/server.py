#!/usr/bin/python3

import socket
import threading

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


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind(("10.45.18.219", 1984))

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
