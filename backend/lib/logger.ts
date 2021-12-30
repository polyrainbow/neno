const logLevels = [
  "error",
  "warn",
  "info",
  "verbose",
];

let currentLogLevel = "info";

const LOG_LEVEL = process.env.LOG_LEVEL;

if (LOG_LEVEL) {
  currentLogLevel = LOG_LEVEL;
} else {
  // eslint-disable-next-line no-console
  console.warn(
    "WARN: Environment variable LOG_LEVEL is not set. "
    + "Proceeding with log level 'info'.",
  );
}

const error = (msg) => {
  // eslint-disable-next-line no-console
  console.log("ERROR: " + msg);
};

const warn = (msg) => {
  if (logLevels.indexOf(currentLogLevel) >= logLevels.indexOf("warn")) {
    // eslint-disable-next-line no-console
    console.log("WARN: " + msg);
  }
};

const info = (msg) => {
  if (logLevels.indexOf(currentLogLevel) >= logLevels.indexOf("info")) {
    // eslint-disable-next-line no-console
    console.log("INFO: " + msg);
  }
};

const verbose = (msg) => {
  if (logLevels.indexOf(currentLogLevel) >= logLevels.indexOf("verbose")) {
    // eslint-disable-next-line no-console
    console.log("VERBOSE: " + msg);
  }
};

export {
  error,
  warn,
  info,
  verbose,
};