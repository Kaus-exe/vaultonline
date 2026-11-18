# VaultOnline demo backend

## MySQL
Create the database:
```sql
CREATE DATABASE vaultonline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Set the database password before starting Spring Boot.

PowerShell:
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:DB_URL="jdbc:mysql://localhost:3306/vaultonline"
.mvnw.cmd spring-boot:run
```

## Frontend
```powershell
cd ..\vaultonline-frontend
npm install
npm run dev
```

## Demo accounts
The first backend start creates demo data if the corresponding users do not already exist.

- Admin phone: `+77000000001`
- Admin password: `Admin12345!`
- Demo client 1: `+77000000002`
- Demo client 2: `+77000000003`
- Demo client password: `User12345!`

Override admin credentials with `ADMIN_PHONE` and `ADMIN_PASSWORD` environment variables before the first startup. Change demo passwords before using the project outside a local classroom demonstration.

## Implemented API
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/account`, `GET /api/transactions`, `POST /api/transfers`
- Admin-only: `GET /api/admin/users`, `GET /api/admin/transactions`, `GET /api/admin/stats`, `PATCH /api/admin/users/{id}/block`

Transfers are simulated between VaultOnline demo accounts. This is an educational project, not a real banking or payment service.
