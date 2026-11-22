// A ministry's photo is stored on Cloudinary; the API gives its id.
const CLOUD = "https://res.cloudinary.com/dfycvaiv7";
export const photoUrl = (id) => (id ? `${CLOUD}/${id}` : null);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
