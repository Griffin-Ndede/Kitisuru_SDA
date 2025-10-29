import { getMinistries } from "../Api/Ministries";

export async function ministriesLoader() {
  try {
    const ministries = await getMinistries();
  return { ministries }; 
  } catch (error){
    console.error("❌ Home loader error:", error.message);
  }
}

