import { exists, existsSync } from "fs";
import { lines } from "./lines";
import { unescape_alg } from "./vendor/alg.cubing.net";

const ALG_MATCH = /\]\d/;

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
  referrer: string;
  userAgent: string;
}

const logEntryRegex =
  /^([\d\.\:]+) - - \[([^\]]+)\] "([^ ]+) (.+) ([^ ]+)" ([\d]+) ([\d]+) "([^"]*)" "([^"]*)/;

function parseLine(line: string): LogEntry {
  const match = line.match(logEntryRegex);

  if (!match) {
    console.error("No match!");
    console.error(line);
    throw new Error("no match!");
  }

  const [
    _,
    ip,
    timeStamp,
    method,
    path,
    protocol,
    statusCode,
    numBytes,
    referrer,
    userAgent,
  ] = match;

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
    referrer,
    userAgent,
  };
}

async function* algs(lines: AsyncGenerator<string>): AsyncGenerator<string> {
  for await (const line of lines) {
    const logEntry = parseLine(line);
    try {
      let path = logEntry.request.path;
      if (path === "//") {
        path = "/"; // Workaround.
      }
      const algParam = new URL(
        path,
        "http://localhost" // Can't use `import.meta.url` in `ts-node` because the ecosystem is terrible. 😭
      ).searchParams.get("alg");
      // console.log(line, parseLine(line), algParam);
      if (algParam) {
        yield unescape_alg(algParam);
      }
    } catch (e) {
      console.error("Failure on line:\n", line, "\n", e);
      // process.exit(1);
    }
  }
}

async function processFile(fileName: string): Promise<void> {
  for await (const alg of algs(lines(fileName))) {
    if (alg.match(ALG_MATCH)) {
      console.log("\n");
      console.log(alg);
    } else {
      process.stdout.write(".");
    }
  }
}

async function main(): Promise<void> {
  const files = process.argv.slice(2);
  for (const file of files) {
    console.log("\n");
    if (existsSync(file + ".gz")) {
      console.log("Skipping because .gz version exists:", file);
    } else {
      console.log(file);
      await processFile(file);
    }
  }
}

main();
