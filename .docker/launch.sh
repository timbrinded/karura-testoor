cd local
docker-compose down
docker volume prune -f
cd ..
docker-compose -f ./local/docker-compose.yml up -d --build