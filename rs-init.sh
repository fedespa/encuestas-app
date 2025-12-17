#!/bin/bash
until mongosh --host mongo --eval 'quit(0)'; do
  sleep 1
done

mongosh --host mongo <<EOF
rs.initiate(
  {
    _id : "rs0",
    members: [
      { _id : 0, host : "mongo:27017" }
    ]
  }
)
EOF