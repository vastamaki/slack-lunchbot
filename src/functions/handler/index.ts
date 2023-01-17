import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: "cron(30 8 ? * MON-FRI *)",
    },
  ],
  environment: {
    SLACK_WEBHOOK: "$${env:SLACK_WEBHOOK}",
  },
};
