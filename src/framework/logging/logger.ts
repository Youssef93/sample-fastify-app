import { Logging as GCPCloudLogging } from '@google-cloud/logging';
import { trace } from '@opentelemetry/api';
import { getConfig } from 'src/framework/configurations/config.service';
import { ILogDetails } from 'src/framework/framework.types';
import { asyncLocalStorage } from 'src/framework/logging/async-local-storage';
import { getSafeValue, isLocalEnv } from 'src/framework/utils';

let gcpLogClass: GCPCloudLogging | undefined;

const APP_NAME = 'test';

async function logToCloud(type: 'log' | 'warn' | 'error' | 'info', logDetails: ILogDetails): Promise<void> {
  const store = asyncLocalStorage.getStore();

  const traceId = trace.getActiveSpan()?.spanContext().traceId;
  const spanId = trace.getActiveSpan()?.spanContext().spanId;

  const projectId = getConfig().gcp.projectId;

  if (!gcpLogClass) gcpLogClass = new GCPCloudLogging({ projectId });

  const gcpLogger = gcpLogClass.logSync(APP_NAME);

  const metaData = {
    severity: type.toUpperCase(),
    httpRequest: {
      requestMethod: store?.get('requestMethod'),
      requestUrl: store?.get('requestUrl'),
    },
    spanId,
    stack_trace: logDetails?.stackTrace,
    trace: `projects/${projectId}/traces/${traceId}`,
  };

  if (!logDetails.additionalInfo) logDetails.additionalInfo = {};

  const entry = gcpLogger.entry(metaData, {
    message: logDetails.message,
    serviceName: logDetails.serviceName,
    ...logDetails.additionalInfo,
  });

  gcpLogger.write(entry);
}

function internalLog(type: 'log' | 'warn' | 'error' | 'info', logDetails: ILogDetails): void {
  if (isLocalEnv()) {
    getSafeValue(console, type)(logDetails.message);
  } else {
    logToCloud(type, logDetails);
  }
}

export function log(logDetails: ILogDetails): void {
  internalLog('log', logDetails);
}

export function warn(logDetails: ILogDetails): void {
  internalLog('warn', logDetails);
}

export function error(logDetails: ILogDetails): void {
  internalLog('error', logDetails);
}

export function info(logDetails: ILogDetails): void {
  internalLog('info', logDetails);
}
