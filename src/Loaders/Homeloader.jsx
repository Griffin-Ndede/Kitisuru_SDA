import { getYoutubeContent } from "../Api/YoutubeContent";
import { getUpcomingEvents } from "../Api/UpcomingEvents";

export async function homeLoader() {
  try {
    const [youtubeContent, upcomingEvents] = await Promise.all([
      getYoutubeContent(),
      getUpcomingEvents(),
    ]);
    return { youtubeContent, upcomingEvents, error: null };
  } catch (error) {
    console.error("❌ Home loader error:", error.message);

    // return fallback data to avoid app crash
    return {
      youtubeContent: [],
      upcomingEvents: [],
      error:
        "Oops! We couldn’t load the data. Please check your internet connection or try again later.",
    };
  }
}
