"""
deck.py
Deck class for the card game

this is a "Slay the Spire" type card game
cards are drawn from a deck and played in a hand
cards do a variety of things, like attack, defend, curse or buff
"""

import random
from card import Card

class Deck:
    def __init__(self, cards):
        self.cards = []
        for card in cards:
            self.cards.append(Card(card["name"], card["cost"], card["description"]))

    def draw_card(self):
        return random.choice(self.cards)

    def shuffle_deck(self):
        random.shuffle(self.cards)

    def add_card(self, card):
        self.cards.append(card)

    def remove_card(self, card):
        self.cards.remove(card)

    def __str__(self):
        return "\n".join([str(card) for card in self.cards])

    def __repr__(self):
        return f"Deck({self.cards})"