import asyncore
import socket


def out(s):
  return s.encode("utf-8")

def start():
  asyncore.loop()


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
      self.world.add_player(addr, RemoteHandler(sock, addr, self.world))

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
