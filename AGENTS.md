<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## PR Checklist

Before pushing, run:

```bash
npm run lint        # must exit with 0 errors
npm run build -- --webpack  # must compile without errors
```
