# Migration Commands

npx typeorm-ts-node-commonjs migration:generate -n InitialMigration -d src/data-source.ts

npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts

npm run migration:run
