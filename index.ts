#!/usr/bin/env node

/**
 * Script to manually trigger Cloudflare Worker cron jobs locally
 *
 * Usage (positional arguments):
 *   npx trigger-cloudflare-cron [cron] [time] [port]
 *
 * Usage (named arguments):
 *   npx trigger-cloudflare-cron -cron "pattern" -time timestamp -port 3000
 *   npx trigger-cloudflare-cron --cron "pattern" --time timestamp --port 3000
 *
 * Examples:
 *   npx trigger-cloudflare-cron
 *   npx trigger-cloudflare-cron -cron "* * * * *"
 *   npx trigger-cloudflare-cron -cron "* * * * *" -port 3000
 *   npx trigger-cloudflare-cron -port 3000 -cron "*\/10 * * * *" -time 1234567890
 */

const DEFAULT_PORT = 8787;
const DEFAULT_CRON = "* * * * *";

interface ParsedArgs {
  cron: string | null;
  time: string | null;
  port: number | null;
}

// Parse command-line arguments
function parseArgs(): ParsedArgs {
  const args: ParsedArgs = { cron: null, time: null, port: null };
  const argv = process.argv.slice(2);

  // Check for named arguments
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const nextArg = argv[i + 1];

    if ((arg === "-cron" || arg === "--cron") && nextArg) {
      args.cron = nextArg;
      i++; // Skip next argument as it's the value
    } else if ((arg === "-time" || arg === "--time") && nextArg) {
      args.time = nextArg;
      i++;
    } else if ((arg === "-port" || arg === "--port") && nextArg) {
      args.port = Number(nextArg);
      i++;
    }
  }

  // Fallback to positional arguments if named args not used
  if (!args.cron && !args.time && !args.port && argv.length > 0) {
    args.cron = argv[0] || null;
    args.time = argv[1] || null;
    args.port = argv[2] ? Number(argv[2]) : null;
  }

  return args;
}

const parsedArgs = parseArgs();
const cronPattern = parsedArgs.cron || DEFAULT_CRON;
const scheduledTime = parsedArgs.time || null;
const port = parsedArgs.port || Number(process.env.PORT) || DEFAULT_PORT;

const url = new URL(`http://localhost:${port}/cdn-cgi/handler/scheduled`);
url.searchParams.set("cron", cronPattern);

if (scheduledTime) {
  url.searchParams.set("time", scheduledTime);
}

console.log(`Triggering cron job...`);
console.log(`  URL: ${url.toString()}`);
console.log(`  Cron: ${cronPattern}`);

if (scheduledTime) {
  console.log(`  Time: ${scheduledTime}`);
}
console.log("");

fetch(url.toString())
  .then(async (response) => {
    const text = await response.text();
    console.log(`Status: ${response.status} ${response.statusText}`);
    if (text) {
      console.log(`Response: ${text}`);
    }
    if (!response.ok) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    console.error("\nMake sure 'wrangler dev' is running on port", port);
    process.exit(1);
  });
