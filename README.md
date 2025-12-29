# trigger-cloudflare-cron

Script to manually trigger Cloudflare Worker cron jobs locally.

## Usage

After publishing to npm, you can run it with:

```bash
npx trigger-cloudflare-cron
```

### Examples

```bash
# Use defaults (cron: "* * * * *", port: 8787)
npx trigger-cloudflare-cron

# Specify cron pattern
npx trigger-cloudflare-cron -cron "* * * * *"

# Specify cron pattern and port
npx trigger-cloudflare-cron -cron "* * * * *" -port 3000

# Use positional arguments
npx trigger-cloudflare-cron "* * * * *" 1234567890 3000

# Use named arguments
npx trigger-cloudflare-cron --cron "*/10 * * * *" --time 1234567890 --port 3000
```

### Arguments

- `-cron` / `--cron`: Cron pattern (default: `"* * * * *"`)
- `-time` / `--time`: Scheduled time timestamp (optional)
- `-port` / `--port`: Port number (default: `8787` or `PORT` environment variable)

## Development

To install dependencies:

```bash
bun install
# or
npm install
```

### Building

Build the TypeScript source to JavaScript:

```bash
bun run build
```

This compiles `index.ts` to `dist/index.js` using Bun.

### Development Scripts

- `bun run build` - Build the project (compiles TS to JS in `dist/` folder)
- `bun run dev` - Run the TypeScript source directly during development

### Testing Locally

To test the compiled version locally:

```bash
# Build first
bun run build

# Then link and test
npm link
trigger-cloudflare-cron
```

Or run the TypeScript source directly during development:

```bash
bun run dev
```

Or run the compiled version directly:

```bash
node dist/index.js
```
