# Classes

## Colour

colour in RGBA format

## Position

x, y coordinate with 0,0 being top left corner

## Strategy

A strategy allows a player to choose what cells to target with a custom army.

## Player

the distinct sides/teams in the game


## Army

The unit of attack belonging to a team. The size of the army dictates how powerful it is.
Only one army can occupy a cell at a time. Multiple teams can target the same cell for 
conquest but only one army wins.

## Target

The target describes what an army can target.

## Targeters

The targeters are the armies that target a cell. It resolves the winner of multiple armies
targeting a single cell. 

## Cell

A cell is never destroyed and is used to store information about a fixed coordinate.

## Board

The board is a representation of the current state of the game.
The board does not understand game logic and is just an abstraction
over the data structures used to store the board state.

## View
The view is able to render a board. It is able to render only the squares that have 
changed colour.

## Game

game logic and entry point
