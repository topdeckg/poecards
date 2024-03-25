"""
card.py
Card class for the card game
"""

class Card:
    def __init__(self, name, cost, description):
        self.name = name
        self.cost = cost
        self.description = description

    def __str__(self):
        return f"{self.name} ({self.cost}): {self.description}"
    
    def __repr__(self):
        return f"Card({self.name}, {self.cost}, {self.description})"

