const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions')

const { NodeSDK } = require('@opentelemetry/sdk-node');

const {
    getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
    //ConsoleMetricExporter,
    PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');

// OTLP Exporter
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');

// Instrumentations
const { ExpressInstrumentation } =
    require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
    require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "todo-service"
    }),
    //traceExporter: new ConsoleSpanExporter(),
    traceExporter: new OTLPTraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
        //exporter: new ConsoleMetricExporter(),
        exporter: new OTLPMetricExporter(),
    }),
    instrumentations: [
        getNodeAutoInstrumentations(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(),
        new HttpInstrumentation()],
});

sdk.start();