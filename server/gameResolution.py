import world_generation as mapgen
import random

class Game :

    def __init__(self):

        # generate a new map
        self.world = mapgen.yolo()

        # height / with of the world
        self.size = 16

        # prepare the list of player
        self.players = {}

        # prepare the order list
        self.order = []

    def _newBestStartposition():

        # not in the water
        # not on a tree
        # not on a tile where there is currently a player
        # heuritic : far away from the center, far away from the other spawn
        # iterate on all the position like a boss

        return {
            "x": 0,
            "y": 0
        }

    def addPlayer(name):

        # determine the starting position
        spawn = self._newBestStartposition()

        self.players[ name ] = {
            "spawn" : spawn,
            "x" : spawn.x,
            "y" : spawn.y,
        }

        # set as last position
        self.order.append( name )

    def _nextTurn():

        self.order.reverse()
        next = self.order.pop()
        self.order.reverse()
        self.order.append( next )


    def _resolveOneCommand( command ):

        # command is a atomic command

        # TODO

    def resolve( commands ):

        # commands is dictionnary of list of command ( indexed by players )

        actions = []
        turnOrder = []

        while( 1 ){

            # grab the next player
            next_player = self.order.index( 0 )

            # grab the next player's command
            if len( commands ) :
                0

        }

    def playerAsJson():
        # TODO
        return {}

    def turnOrderAsJson():
        # TODO
        return {}

    def worldAsJson():
        # TODO
        return {}
