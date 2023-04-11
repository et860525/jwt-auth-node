mongo << EOF

db = db.getSiblingDB('jwtAuth')

db.createUser({
  user: '${MONGODB_USERNAME}',
  pwd: '${MONGODB_PASSWORD}',
  roles: [
    {
      role: 'readWrite',
      db: 'jwtAuth',
    },
  ],
});

EOF
