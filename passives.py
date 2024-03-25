"""
passives.py
passive tree, inspired by Path of Exile

the passive tree is represented in game code as a dict
each keys are unique passive names
example:

"Minor Strength 1": {
    "type": "attribute",
    "attribute": "strength",
    "value": 5,
    "linked": ["Minor Strength 2", "Minor Armor 1"]
},
"Fire Resistance": {
    "type": "resistance",
    "element": "fire",
    "value": 10
}

the class stores the individual passives as a list for the player. a different module will handle the lookups and application of the passives
"""

class Passive:
    """
    init an emputy list to store the passives
    """
    def __init__(self):
        self.passives = []

    def add_passive(self, passive):
        """
        add a passive to the list
        """
        self.passives.append(passive)

    def remove_passive(self, passive):
        """
        remove a passive from the list
        """
        self.passives.remove(passive)

    def __str__(self):
        return "\n".join([str(passive) for passive in self.passives])

    def __repr__(self):
        return f"Passive({self.passives})"