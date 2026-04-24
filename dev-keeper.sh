#!/bin/bash
while true; do
  cd /home/z/my-project
  node node_modules/.bin/next dev -p 3000 2>&1 | tee /home/z/my-project/dev.log
  echo "Next.js exited. Restarting in 3 seconds..." >> /home/z/my-project/dev.log
  sleep 3
done
