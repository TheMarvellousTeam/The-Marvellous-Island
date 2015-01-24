#!/usr/bin/python3

import json
import network
import world_generation as mapgen


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
        self.start_game()
        self.started=True

      self.cmd = {}

  def receive_msg(self, data):
    print("[renderer] %s"%data)

  def resolve_cmd(self):
    response = {}
    response['action'] = []
    response['order'] = []

    for addr in self.order:
      pass #resolve this shit

    # order rotation
    self.order = self.order[1:] + [self.order[0]]
    for addr in self.order:
      response['order'].append(self.players[addr]['name'])

    #self.render.send_msg(json.dumps(response))
    print(json.dumps(response))
    self.broadcast('NEW_TURN')

  def start_game(self):
    response = {}
    response['players'] = []
    response['map'] = mapgen.yolo()

    for addr in self.order:
      self.players[addr]['name'] = self.cmd[addr][7:-1]      
      response['players'].append(self.players[addr]['name'])

      print("[%s] affect name: %s"%(addr, self.players[addr]['name']))

    #self.render.send_msg("START_GAME %s"%json.dumps(response))
    print(json.dumps(response))
    self.broadcast('START_GAME')





def main(ip, portRemote, portRender):
  world = World(1)
  remote = network.RemoteServer(ip, portRemote, world)
  render = network.RenderServer(ip, portRender, world)
  network.start()


if __name__=="__main__":
  main("192.168.1.1", 1984, 19842)
