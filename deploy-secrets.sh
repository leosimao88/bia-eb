#!/bin/bash

echo "=== Deploy com Secrets Manager ==="
echo ""

# Verificar se está no diretório correto
if [ ! -f "build.sh" ]; then
    echo "Erro: Execute este script no diretório bia-eb"
    exit 1
fi

# Fazer commit das mudanças
echo "1. Commitando mudanças..."
git add .
git commit -m "Adicionar suporte ao Secrets Manager" || echo "Nada para commitar"

# Build e push
echo ""
echo "2. Fazendo build e push da imagem..."
./build.sh

# Obter versão
versao=$(git rev-parse HEAD | cut -c 1-7)
echo ""
echo "3. Versão gerada: $versao"

# Upload para S3
echo ""
echo "4. Fazendo upload para S3..."
aws s3 cp bia-versao-$versao.zip s3://elasticbeanstalk-us-east-1-322095785990/ --profile bia

# Criar versão da aplicação
echo ""
echo "5. Criando versão da aplicação..."
aws elasticbeanstalk create-application-version \
  --profile bia \
  --region us-east-1 \
  --application-name bia \
  --version-label bia-secrets-$versao \
  --source-bundle S3Bucket=elasticbeanstalk-us-east-1-322095785990,S3Key=bia-versao-$versao.zip

# Deploy
echo ""
echo "6. Fazendo deploy no ambiente..."
aws elasticbeanstalk update-environment \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa \
  --version-label bia-secrets-$versao

echo ""
echo "=== Deploy iniciado! ==="
echo "Aguarde alguns minutos e teste: http://bia-beanstalk-lsa.us-east-1.elasticbeanstalk.com/api/tarefas"
