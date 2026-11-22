// Small helpers shared by the Members and Clusters pages.
// People who signed in before names were collected (the first admin) show their
// username instead of a dash. Members added without a sign-in have a made-up one, so not those.
export const fullName = (m) =>
  `${m.first_name} ${m.last_name}`.trim() || (!m.record_only && m.username) || "—";

// The four states a person can be in, in the order an admin cares about them.
export const statusOf = (m) =>
  !m.is_active ? "off" : m.record_only ? "record" : !m.approved ? "waiting" : "active";

export const statusLabels = {
  active: "Active",
  waiting: "Waiting for approval",
  record: "No sign-in yet",
  off: "Switched off",
};

export const genderLabels = { male: "Male", female: "Female", "": "—" };

export const kindLabels = { prayer_cell: "Prayer cell", department: "Department" };

// A person matches a search if every word appears in their name, email or phone.
export const matchesSearch = (m, search) => {
  const text = `${fullName(m)} ${m.email} ${m.phone}`.toLowerCase();
  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
};
