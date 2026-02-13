# Configuração do Secrets Manager

## Arquivos Modificados

### 1. `config/database.js`
- Usa Secrets Manager quando `DB_SECRET_NAME` está definido
- Fallback para variáveis de ambiente em desenvolvimento local

### 2. `api/models/index.js`
- Inicialização assíncrona do Sequelize
- Método `initialize()` para aguardar configuração do banco

### 3. `api/controllers/tarefas.js`
- Aguarda inicialização do banco antes de cada operação

### 4. `server.js`
- Inicializa banco antes de iniciar o servidor

### 5. `package.json`
- Dependências AWS SDK adicionadas:
  - @aws-sdk/client-secrets-manager
  - @aws-sdk/client-sts
  - @aws-sdk/credential-providers

### 6. `.ebextensions/secrets-manager.config`
- Configuração automática das variáveis de ambiente no Elastic Beanstalk

### 7. `docker-compose-eb.yml`
- Template para geração do docker-compose.yml com variáveis do Secrets Manager

## Variáveis de Ambiente

### Elastic Beanstalk (via .ebextensions)
- `DB_SECRET_NAME`: rds!db-b4b74a63-2384-4065-9d98-71aa772b0ce2
- `DB_REGION`: us-east-1
- `DB_HOST`: bia.cfaxmljll1xz.us-east-1.rds.amazonaws.com
- `DB_PORT`: 5432
- `DB_NAME`: bia

### Desenvolvimento Local
Use `docker-compose-local.yml` com as mesmas variáveis

## Deploy

```bash
./build.sh
./deploy.sh
```

## Permissões IAM

A role `role-instance-profile-beanstalk` tem permissão para:
- `secretsmanager:GetSecretValue`
- `secretsmanager:DescribeSecret`
