#!/bin/bash

echo "Buscando logs do Elastic Beanstalk..."
echo ""

aws elasticbeanstalk request-environment-info \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa \
  --info-type tail > /dev/null

sleep 15

aws elasticbeanstalk retrieve-environment-info \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa \
  --info-type tail \
  --query 'EnvironmentInfo[-1].Message' \
  --output text | xargs curl -s 2>/dev/null | \
  grep -A 30 "INICIANDO APLICAÇÃO\|Carregando credenciais\|Credenciais carregadas" | \
  head -25
