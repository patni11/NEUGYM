// Within ./pages/api/inngest.ts
import { serve } from "inngest/next";
import scraperFn from "../../inngest/scraper";
// Create an API that hosts zero functions.
export default serve("NEUGymTrends", [scraperFn]);
