## Database Migrations

### Generate a new migration

```bash
npm run migration:generate src/migrations/[MigrationName]
```

### Run migrations

```bash
npm run migration:run
```

### Revert last migration

```bash
npm run migration:revert
```

Note: Make sure your database is running and environment variables are properly set in .env file before running migrations.
