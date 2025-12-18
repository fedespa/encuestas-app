#!/bin/bash
set -e

until mongosh --host mongo --eval 'db.adminCommand("ping")' >/dev/null 2>&1; do
  sleep 2
done

mongosh --host mongo <<EOF
try {
  rs.status()
  print("Replica set already initialized")
} catch (e) {
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongo:27017" }]
  })
}
EOF
