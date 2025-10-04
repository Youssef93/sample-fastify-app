// otel.ts – import this as EARLY as possible (first line in main)
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor, ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { isLocalEnv } from 'src/framework/utils';

const projectId = process.env.GCP_PROJECT_ID; // strongly recommended in prod

// Sample 100% locally; sample N% in prod (default 5%)
const sampleRate = isLocalEnv() ? 1.0 : Number(process.env.OTEL_TRACES_SAMPLER_ARG ?? '0.05');

// Exporter: disable in local if you like; or swap to ConsoleSpanExporter
const exporter = !isLocalEnv() ? new TraceExporter({ projectId }) : undefined;

// Batch processor tuning (slightly larger queue; modest delay)
const spanProcessor =
  exporter &&
  new BatchSpanProcessor(exporter, {
    maxQueueSize: 4096,
    scheduledDelayMillis: 3000,
    maxExportBatchSize: 512,
  });

// Sampler: ParentBased so child spans follow the parent’s decision
const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(sampleRate),
});

if (!isLocalEnv() && !projectId) {
  throw new Error('GCP_PROJECT_ID must be set in production for log/trace correlation.');
}

const sdk = new NodeSDK({
  sampler,
  spanProcessor,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start immediately when this module is imported
sdk.start();

// Graceful shutdown
async function shutdownAndExit(code = 0): Promise<void> {
  try {
    await sdk.shutdown();
    // eslint-disable-next-line no-console
    console.log('OpenTelemetry SDK shut down successfully');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error shutting down OpenTelemetry SDK', err);
  } finally {
    process.exit(code);
  }
}

process.once('SIGTERM', () => shutdownAndExit(0));
process.once('SIGINT', () => shutdownAndExit(0));

export { sdk as instrumentationSDK };
