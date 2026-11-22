// What each page needs, fetched before the page renders.
// Loaders do not catch errors: a failure reaches the router's ErrorPage.
import {
  getDocuments,
  getMinistries,
  getMinistry,
  getUpcomingEvents,
  getYoutubeLinks,
} from "../Api";

export async function homeLoader() {
  const [youtubeContent, upcomingEvents] = await Promise.all([
    getYoutubeLinks(),
    getUpcomingEvents(),
  ]);
  return { youtubeContent, upcomingEvents };
}

export async function ministriesLoader() {
  return { ministries: await getMinistries() };
}

export async function ministryLoader({ params }) {
  try {
    return { ministry: await getMinistry(params.id) };
  } catch (error) {
    // A missing ministry is a 404 page, not a "didn't load" error.
    if (error?.response?.status === 404) {
      throw new Response("Ministry not found", { status: 404 });
    }
    throw error;
  }
}

export async function resourcesLoader() {
  return { documents: await getDocuments() };
}
