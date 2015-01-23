#!/usr/bin/python3

import socketserver

class ChickensHandler(socketserver.StreamRequestHandler):
    
    def handle(self):
        self.data = self.rfile.readline().strip()
        print("{} wrote:".format(self.client_address[0]))
        print(self.data)

if __name__=="__main__":
    HOST, PORT = "10.45.18.219", 1984
    
    server = socketserver.TCPServer((HOST, PORT), ChickensHandler)
    server.serve_forever()
