#!/usr/bin/python3

import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

sock.bind(("10.45.18.219", 1984))

sock.listen(1)

while True:
    connection, client_addr = sock.accept()
    print(client_addr)
    try:
        while True:
            data = connection.recv(16)
            if data:
                print(data)
    finally:
        connection.close()

sock.close()        
