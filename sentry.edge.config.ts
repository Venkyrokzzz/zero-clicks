import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://486f917cc64b445f1b689220ac230db7@o4511511790878720.ingest.de.sentry.io/4511511802740816",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
