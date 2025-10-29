import { getMinistriesDetails } from "../Api/MinistriesDetails";

export async function ministriesDetailsLoader({ params }) {
  try {
    const ministry = await getMinistriesDetails(params);
    return { ministry };
  } catch (error) {
    console.error("❌ ministriesDetailsLoader error:", error.message);
    throw error;
  }
}
