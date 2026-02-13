#!/bin/bash

# Build e push da imagem
./build.sh

# Obter versão
versao=$(git rev-parse HEAD | cut -c 1-7)

# Upload para S3
echo "Fazendo upload para S3..."
aws s3 cp bia-versao-$versao.zip s3://elasticbeanstalk-us-east-1-322095785990/ --profile bia

# Criar versão da aplicação
echo "Criando versão da aplicação..."
aws elasticbeanstalk create-application-version \
  --profile bia \
  --region us-east-1 \
  --application-name bia \
  --version-label bia-secrets-$versao \
  --source-bundle S3Bucket=elasticbeanstalk-us-east-1-322095785990,S3Key=bia-versao-$versao.zip

# Deploy
echo "Fazendo deploy..."
aws elasticbeanstalk update-environment \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa \
  --version-label bia-secrets-$versao

echo "Deploy iniciado! Versão: bia-secrets-$versao"