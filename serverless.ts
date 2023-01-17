import type { AWS } from "@serverless/typescript";

import handler from "@functions/handler";

const serverlessConfiguration: AWS = {
  service: "slack-lunchbot",
  frameworkVersion: "3.26.0",
  plugins: ["serverless-esbuild"],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    deploymentMethod: "direct",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { handler },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
    },
  },
} as any;

module.exports = serverlessConfiguration;
