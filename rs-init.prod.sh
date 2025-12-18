#!/bin/bash

mongod --bind_ip_all --replSet rs0 --keyFile /data/configdb/mongo-keyfile &
MONGOPID=$!

echo "Esperando a que MongoDB inicie..."
until mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 2
done

IS_INIT=$(mongosh --quiet --eval "rs.status().ok" 2>/dev/null)

if [ "$IS_INIT" != "1" ]; then
    IS_INIT=$(mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --quiet --eval "rs.status().ok" 2>/dev/null)
fi

if [ "$IS_INIT" != "1" ]; then
    echo "Configuración inicial: No se detectó Replica Set. Iniciando..."
    mongosh --quiet --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'mongo:27017'}]})"
    
    # Esperar a que el nodo sea PRIMARY para poder crear usuarios
    echo "Esperando a que el nodo sea PRIMARY..."
    until mongosh --quiet --eval "rs.isMaster().ismaster" | grep -q "true"; do
      sleep 2
    done
    
    echo "Creando usuario administrador (Root)..."
    mongosh admin --eval "db.createUser({user: '$MONGO_INITDB_ROOT_USERNAME', pwd: '$MONGO_INITDB_ROOT_PASSWORD', roles: [{role: 'root', db: 'admin'}]})"
    
    echo "Creando usuario de la aplicación ($MONGO_APP_USER)..."
    mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin <<EOF
use $MONGO_APP_DB
db.createUser({
  user: '$MONGO_APP_USER',
  pwd: '$MONGO_APP_PASSWORD',
  roles: [{ role: 'readWrite', db: '$MONGO_APP_DB' }]
})
EOF
    echo "Configuración de usuarios completada."
else
    echo "El Replica Set y los usuarios ya están configurados. Saltando inicialización."
fi

# Mantener el proceso de mongod en primer plano
wait $MONGOPID