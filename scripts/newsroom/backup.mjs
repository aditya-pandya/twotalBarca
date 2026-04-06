import { createNewsroomBackup } from "../../lib/newsroom-io.ts";
import { parseArgs } from "./_shared.mjs";

const args = parseArgs(process.argv.slice(2));
const outputPath = await createNewsroomBackup(process.cwd(), args.label);

console.log(`Backup created at ${outputPath}`);
