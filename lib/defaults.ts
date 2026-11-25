export const DEFAULT_CAMPAIGNS = [
  {
    type: "winback",
    name: "Win-back after 21 days",
    trigger_days: 21,
    bonus_stamps: 1,
    message: "Hi {name}! It's been a while 💛 Come in this week and we'll add a bonus stamp to your {business} card — you're {left} away from a {reward}.",
  },
  {
    type: "birthday",
    name: "Birthday treat",
    trigger_days: 0,
    bonus_stamps: 2,
    message: "Happy birthday {name}! 🎂 We've added 2 bonus stamps to your {business} card. Treat yourself today.",
  },
  {
    type: "welcome",
    name: "Welcome & first-visit nudge",
    trigger_days: 3,
    bonus_stamps: 0,
    message: "Welcome to the {business} club, {name}! ☕ Show your code at the counter on your next visit — your first stamp is waiting.",
  },
];

export const CATEGORIES: Record<string, { label: string; icon: string; reward: string }> = {
  cafe: { label: "Café / Coffee shop", icon: "☕", reward: "free cappuccino" },
  restaurant: { label: "Restaurant", icon: "🍽️", reward: "free dessert" },
  bakery: { label: "Bakery / Sweets", icon: "🧁", reward: "free pastry" },
  salon: { label: "Salon / Spa", icon: "💈", reward: "free haircut add-on" },
  retail: { label: "Retail / Kirana", icon: "🛍️", reward: "₹100 off" },
  gym: { label: "Gym / Studio", icon: "🏋️", reward: "free PT session" },
};
