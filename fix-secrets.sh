#!/bin/bash

# Script para configurar Secrets Manager no Elastic Beanstalk

echo "Atualizando variáveis de ambiente no Elastic Beanstalk..."

aws elasticbeanstalk update-environment \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa \
  --option-settings \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=DB_SECRET_NAME,Value=rds!db-b4b74a63-2384-4065-9d98-71aa772b0ce2 \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=DB_REGION,Value=us-east-1 \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=DB_USER,Value=postgres \
    Namespace=aws:elasticbeanstalk:application:environment,OptionName=DB_PWD,Value=postgres

echo "Aguardando atualização do ambiente..."
aws elasticbeanstalk wait environment-updated \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa

echo "Testando aplicação..."
curl -s http://bia-beanstalk-lsa.us-east-1.elasticbeanstalk.com/api/tarefas | jq .

echo "Concluído!"
