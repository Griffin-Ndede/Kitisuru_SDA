import { getMinistries } from "../Api/Ministries";

export async function ministriesLoader() {
  try {
    const ministries = await getMinistries();
  return { ministries }; 
  } catch (error){
    console.error("❌ Ministries loader error:", error.message);
  }
}

