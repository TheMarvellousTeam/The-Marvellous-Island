#!/usr/bin/python3

import asyncore
import socket
import json

def out(s):
  return s.encode("utf-8")


class World:

  def __init__(self, nb_players):
    self.players = {}
    self.cmd = {} 
    self.nb_players = nb_players
    self.order = []
    self.started = False

  def init_render(self, handler):
    self.render = handler

  def add_player(self, addr, handler):
    self.players[addr] = {}
    self.players[addr]['handler'] = handler 
    self.order.append(addr)
    print("%s joined the game"%addr)

    if len(self.players) == self.nb_players:
      self.broadcast("START")

  def broadcast(self, msg):
    for addr, stuff in self.players.items():
      stuff['handler'].send_msg(msg)

  def receive_cmd(self, addr, data):
    print("[%s] %s"%(addr, data))   
    self.cmd[addr] = str(data)

    if len(self.cmd) == self.nb_players:
      if self.started:
        self.resolve_cmd()
      else:
        self.resolve_name()
        self.started=True

  def receive_msg(self, data):
    print("[renderer] %s"%data)

  def resolve_cmd(self):
    if self.cmd[addr][0].startswith("NAME"):
      self.resolve_name()
    else:

    response = {}
    response['action'] = []
    response['order'] = []
    for addr in self.order:
      pass

    self.order = self.order[1:] + [self.order[0]]
    for addr in self.order:
      response['order'].append(self.players[addr]['name'])

    self.render.send_msg(json.dumps(response))
    self.broadcast("NEW_TURN")

  def resolve_name(self):
    response = {}
    response['players'] = []

    for addr in self.order:
      self.players[addr]['name'] = self.cmd[addr][5:]      
      response['players'].append(self.players[addr]['name'])

      print("[%s] affect name: %s"%(addr, self.players[addr]['name']))

    self.render.send_msg(json.dumps(response))
    self.broadcast("NEW_TURN")

class RemoteHandler(asyncore.dispatcher_with_send):

  def __init__(self, sock, addr, world):
    asyncore.dispatcher_with_send.__init__(self, sock)
    self.addr = addr
    self.world = world

  def handle_read(self):
    data = self.recv(512)
    if data:
      self.world.receive_cmd(self.addr, data)

  def handle_close(self):
    self.close()

  def send_msg(self, msg):
    self.send(out(msg))


class RenderHandler(asyncore.dispatcher_with_send):

  def __init__(self, sock, world):
    asyncore.dispatcher_with_send.__init__(self, sock)
    self.world = world

  def handle_read(self):
    data = self.recv(512)
    if data:
      self.world.receive_msg(data)

  def send_msg(self, msg):
    self.send(out(msg))

  def handle_close(self):
    self.close()


class RemoteServer(asyncore.dispatcher):

  def __init__(self, host, port, world):
    asyncore.dispatcher.__init__(self)
    self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
    self.set_reuse_addr()
    self.bind((host, port))
    self.listen(world.nb_players)

    self.world = world

  def handle_accept(self):
    pair = self.accept()
    if pair is not None:
      sock, addr = pair
      self.world.add_player(addr, RemoteHandler(sock, addr, world))

  def handle_close(self):
    self.close()


class RenderServer(asyncore.dispatcher):
  
  def __init__(self, host, port, world):
    asyncore.dispatcher.__init__(self)
    self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
    self.set_reuse_addr()
    self.bind((host, port))
    self.listen(1)

    self.world = world

  def handle_accept(self):
    pair = self.accept()
    if pair is not None:
      sock, addr = pair
      self.world.init_render(RenderHandler(sock, self.world))




def main(ip, portRemote, portRender):
  world = World(1)
  remote = RemoteServer(ip, portRemote, world)
  render = RenderServer(ip, portRender, world)
  asyncore.loop()


if __name__=="__main__":
  main("192.168.1.1", 1984, 19842)

