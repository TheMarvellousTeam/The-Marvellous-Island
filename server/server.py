#!/usr/bin/python3

import socket
import threading
import argparse
import signal

#signal handler
def handler (signum, frame):
    print 'interupt'

class RemoteListener(threading.Thread):
    def __init__(self, connection):
        threading.Thread.__init__(self)
        self.connection = connection

    def run(self):
        self.connection.sendall("START".encode("utf-8"))
        while True:
            data = self.connection.recv(16)
            if data:
                print(data)

    def close(self):
        self.connection.close()


def main(args):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    sock.bind((args.ip, int(args.port)))

    sock.listen(3)

    clients = []

    while len(clients) < 2:
        connection, client_addr = sock.accept()
        clients.append((client_addr, RemoteListener(connection)))
        print("%s joined the game"%client_addr[0])

    for client in clients:
        client[1].start()

    sock.close()

if __name__=="__main__":
    #parsing des options
    parser = argparse.ArgumentParser()
    parser.add_argument("-ip")
    parser.add_argument("-port")

    args = parser.parse_args()
    main(args)
           
