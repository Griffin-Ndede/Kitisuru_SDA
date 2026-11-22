// What data each page needs. React Router runs these before showing a page.
//
// Loaders don't catch errors: if a request fails, the error goes to
// <ErrorPage /> (errorElement in App.jsx), so every page handles failures
// the same way.
import {
  getDocuments,
  getMinistries,
  getMinistryDetails,
  getUpcomingEvents,
  getYoutubeLinks,
} from "../Api";

// Sermons and events are fetched at the same time.
export const homeLoader = async () => {
  const [youtubeContent, upcomingEvents] = await Promise.all([
    getYoutubeLinks(),
    getUpcomingEvents(),
  ]);
  return { youtubeContent, upcomingEvents };
};

export const ministriesLoader = async () => ({
  ministries: await getMinistries(),
});

export const ministryDetailsLoader = async ({ params }) => ({
  ministry: await getMinistryDetails(params.id),
});

export const resourcesLoader = async () => ({
  documents: await getDocuments(),
});
