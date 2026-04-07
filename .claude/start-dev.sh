#!/bin/bash
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd /Users/venky/zero-clicks
exec /usr/local/bin/node ./node_modules/.bin/next dev --port 3000
