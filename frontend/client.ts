import { createClient } from "@sanity/client";

export default createClient({
  projectId: "f942yjh9",
  dataset: "production", // or the name you chose in step 1
  useCdn: true, // `false` if you want to ensure fresh data
});
