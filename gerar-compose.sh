versao=$(git rev-parse HEAD | cut -c 1-7)
echo "TAG=$versao" > .env
echo "DB_SECRET_NAME=rds!db-b4b74a63-2384-4065-9d98-71aa772b0ce2" >> .env
echo "DB_REGION=us-east-1" >> .env
echo "DB_HOST=bia.cfaxmljll1xz.us-east-1.rds.amazonaws.com" >> .env
echo "DB_PORT=5432" >> .env
echo "DB_NAME=bia" >> .env
docker compose -f docker-compose-eb.yml config > docker-compose.yml
