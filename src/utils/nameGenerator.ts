const firstNames = [
  'Alex', 'Jordan', 'Morgan', 'Casey', 'Taylor',
  'Riley', 'Quinn', 'Avery', 'Skylar', 'Dakota',
  'Raven', 'Phoenix', 'Sage', 'River', 'Kai',
  'Atlas', 'Nova', 'Zephyr', 'Luna', 'Orion'
];

const lastNames = [
  'Chen', 'Patel', 'Rodriguez', 'Kim', 'Nakamura',
  'Santos', 'Kowalski', 'Anderson', 'O\'Brien', 'Martinez',
  'Larsson', 'Muller', 'Dubois', 'Ivanov', 'Silva',
  'Hassan', 'Okafor', 'Yamamoto', 'Schultz', 'Novak'
];

export function generateRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}
