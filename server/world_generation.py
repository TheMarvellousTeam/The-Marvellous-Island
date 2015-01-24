import math
import random

def yolo():
    # params
    width = 16
    height = 16


    # generation based on the distance from the center of the island

    _map = {}

    r_max = math.sqrt( ( width/2 )*( width/2 ) + ( height/2 )*( height/2 ) ) * 1.1

    for y in range( height ):
        for x in range( width ):

            r = math.sqrt( ( x - width/2 )*( x - width/2 ) + ( y - height/2 )*( y - height/2 ) ) / r_max

            # add random
            r_blured = random.random() * 0.3 + 0.7

            # TODO please Theo do this in one line
            if  r_blured < 0.2 :
                height = 3
                _type = 'grass'
            elif  r_blured < 0.3 :
                height = 2
                _type = 'dirt'
            elif  r_blured < 0.5 :
                height = 1
                _type = 'sand'
            else :
                height = 0
                _type = 'water'


            obstacle = ''
            if ( height == 3 and random.random() > 0.9 ) or ( height == 2 and random.random() > 0.95 ) :
                obstacle = 'tree'

            _map[ x + y * width ] = {
                "height": height,
                "obstacle": obstacle
            }



    return _map
