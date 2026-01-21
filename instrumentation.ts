import { registerOTel, OTLPHttpProtoTraceExporter } from "@vercel/otel";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

export function register() {
  registerOTel({
    serviceName: "simple-vercel-ai",
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPHttpProtoTraceExporter({
          url: "https://api.raindrop.ai/v1/traces",
          headers: {
            Authorization: `Bearer ${process.env.RAINDROP_WRITE_KEY}`,
          },
        })
      ),
    ],
  });
}
