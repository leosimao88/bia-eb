# Configuração do Secrets Manager

## Mudanças Realizadas

### 1. Código Atualizado (`config/database.js`)
- Prioriza o uso do Secrets Manager quando `DB_SECRET_NAME` está definido
- Adiciona logs para facilitar debug
- Mantém compatibilidade com desenvolvimento local

### 2. Configuração do Elastic Beanstalk (`.ebextensions/secrets-manager.config`)
- Define automaticamente as variáveis de ambiente necessárias:
  - `DB_SECRET_NAME`: Nome do secret no Secrets Manager
  - `DB_REGION`: Região AWS do secret
  - `DB_HOST`, `DB_PORT`, `DB_NAME`: Configurações do banco

### 3. Permissões IAM
A role `role-instance-profile-beanstalk` já foi configurada com permissão para acessar o Secrets Manager.

## Como Fazer o Deploy

1. Commit das mudanças:
```bash
cd /home/leonardo/Documentos/Workspace/formacaoaws/02-26projetos/desafio3/bia-eb
git add .
git commit -m "Adicionar suporte ao Secrets Manager"
```

2. Build e push da imagem:
```bash
./build.sh
```

3. Deploy no Elastic Beanstalk:
```bash
aws elasticbeanstalk create-application-version \
  --profile bia \
  --region us-east-1 \
  --application-name bia \
  --version-label bia-secrets-$(date +%Y%m%d-%H%M%S) \
  --source-bundle S3Bucket=elasticbeanstalk-us-east-1-322095785990,S3Key=bia-versao-$(git rev-parse HEAD | cut -c 1-7).zip

aws elasticbeanstalk update-environment \
  --profile bia \
  --region us-east-1 \
  --environment-name Bia-beanstalk-lsa \
  --version-label bia-secrets-$(date +%Y%m%d-%H%M%S)
```

Ou faça upload manual do arquivo `bia-versao-*.zip` pelo console do Elastic Beanstalk.

## Verificação

Após o deploy, a aplicação deve:
1. Conectar ao RDS usando as credenciais do Secrets Manager
2. Funcionar normalmente mesmo após rotação automática de senha
3. Exibir logs indicando "Usando Secrets Manager para credenciais do banco"
