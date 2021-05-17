import { createReadStream, ReadStream } from "fs";
import { createInterface } from "readline";
import { createGunzip, Gunzip } from "zlib";

export async function* lines(filePath: string): AsyncGenerator<string> {
  let fileStream: ReadStream | Gunzip = createReadStream(filePath);
  if (filePath.endsWith(".gz")) {
    fileStream = fileStream.pipe(createGunzip());
  }

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    yield line;
  }
}
