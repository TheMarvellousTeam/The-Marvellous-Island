Communication Protocol
======

# Direction

Each cell of the grid is associated to a coordinate (x,y).

Consider the very top corner of the grid on the viewer ( basically this corner is usually filled with water ), it the (0,0) point.

Now if you move along the x axis ( positive ), you will go __down and right__. With the y axis you will go __down and left__.

The transcription of the four direction as (x,y) vector is available in __doc/direction.json__.


# Server input

## Controller

Controllers must connect to __*host*:*port*/comm/controller__

Once the connection is established, the room must be selected with a req

```
name : "room"
data : {
    "room" : "my_room_name"
}
```

Then a name can be provided with ( optionnal )

```
name : "name"
data : {
    "name" : "my_name"
}
```

Then for each command phase, player command should be sent

```
name : "cmds"
data : {
    "cmds" : [
        {
            // .. command
        },
        // .. another command
    ]
}
```

Commands can be sent one by one or in one request, the resolution phase will not start until each player have at least the right number of commands. If the player provide more commands than the rules allows, the additionnal commands will be ignored.

The list of available commands is in __doc/acceptableCmds.json__.


## Viewer

Viewers must connect to __*host*:*port*/comm/viewer__  ( same host and port as for controllers )

Once the connection is established, the room must be selected with a req

```
name : "room"
data : {
    "room" : "my_room_name"
}
```

Nothing else is requiered for the viewers.


# Server output

When an element of the game change, the server will notify the viewer ( and controller for a restricted list of things ).

Also each time an action is performed on the game ( move, fire, death ... ) The server will send a timed request.

The list of outputs is available in output.json.  
