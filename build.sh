versao=$(git rev-parse HEAD | cut -c 1-7)
aws ecr get-login-password --region us-east-1 --profile bia| docker login --username AWS --password-stdin 322095785990.dkr.ecr.us-east-1.amazonaws.com
docker build -t bia-beanstalk .
docker tag bia-beanstalk:latest 322095785990.dkr.ecr.us-east-1.amazonaws.com/bia-beanstalk:$versao
docker push 322095785990.dkr.ecr.us-east-1.amazonaws.com/bia-beanstalk:$versao
rm .env 2> /dev/null
./gerar-compose.sh
rm bia-versao-*zip
zip -r bia-versao-$versao.zip docker-compose.yml .ebextensions
git checkout docker-compose.yml