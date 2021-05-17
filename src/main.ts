import { lines } from "./lines";

const file = process.argv[2];

interface LogEntry {
  ip: string;
  timeStamp: string; // TODO
  request: {
    method: string;
    path: string;
    protocol: string;
  };
  statusCode: number;
  numBytes: number;
  url: string;
  userAgent: string;
}

const logEntryRegex =
  /^([\d\.\:]+) - - \[([^\]]+)\] "([^ ]+) ([^ ]+) ([^ ]+)" ([\d]+) ([\d]+) "([^"]+)" "([^"]+)/;

function parseLine(line: string): LogEntry {
  const [
    _,
    ip,
    timeStamp,
    method,
    path,
    protocol,
    statusCode,
    numBytes,
    url,
    userAgent,
  ] = line.match(logEntryRegex);

  return {
    ip,
    timeStamp,
    request: {
      method,
      path,
      protocol,
    },
    statusCode: parseInt(statusCode),
    numBytes: parseInt(numBytes),
    url,
    userAgent,
  };
}

(async () => {
  for await (const line of lines(file)) {
    console.log(parseLine(line));
  }
})();
