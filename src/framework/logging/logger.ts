import { Logging as GCPCloudLogging } from '@google-cloud/logging';
import { ILogDetails } from 'src/framework/framework.types';
import { asyncLocalStorage } from 'src/framework/logging/async-local-storage';
import { isLocalEnv } from 'src/framework/utils';

let gcpLogClass: GCPCloudLogging | undefined;

async function logToCloud(type: 'log' | 'warn' | 'error' | 'info', logDetails: ILogDetails): Promise<void> {
  const store = asyncLocalStorage.getStore();

  if (!gcpLogClass) gcpLogClass = new GCPCloudLogging({ projectId: store?.get('projectId') });

  // const gcpLogger = gcpLogClass.logSync(logDetails.appName);
  const gcpLogger = gcpLogClass.logSync(logDetails.appName);

  const metaData = {
    severity: type.toUpperCase(),
    httpRequest: {
      requestMethod: store?.get('requestMethod'),
      requestUrl: store?.get('requestUrl'),
    },
    stack_trace: logDetails?.stackTrace,
    trace: `projects/${store?.get('projectId')}/traces/${store?.get('traceId')}`,
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
    console[type](logDetails.message);
  } else {
    logToCloud(type, logDetails);
  }
  // console[type](logDetails.message)
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
