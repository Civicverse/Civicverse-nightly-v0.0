export interface Avatar {
  civicId: string;
  name: string;
  options: {
    hair: string;
    skin: string;
  };
  level: number;
  xp: number;
  balance: number;
  trust: number;
  invites: string[];
  unlocked: boolean;
}

export function createAvatar(civicId: string, name: string): Avatar {
  return {
    civicId,
    name,
    options: { hair: "blue", skin: "orc" },
    level: 1,
    xp: 0,
    balance: 0,
    trust: 0,
    invites: [],
    unlocked: false
  };
}

