import { Config, PluginTypes, start } from '@google-cloud/trace-agent';
import { isLocalEnv } from 'src/framework/utils';

let traceAgent: PluginTypes.Tracer | null = null;

const startTracing = (config?: Config): void => {
  if (!isLocalEnv()) traceAgent = start(config);
};

export { startTracing, traceAgent, Config as TraceAgentConfig };
