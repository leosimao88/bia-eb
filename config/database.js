const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { fromIni, fromEnv } = require("@aws-sdk/credential-providers");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

async function isLocalConnection() {
  // Lógica para determinar se a conexão é local
  return (
    process.env.DB_HOST === undefined ||
    process.env.DB_HOST === "database" ||
    process.env.DB_HOST === "127.0.0.1" ||
    process.env.DB_HOST === "localhost"
  );
}

async function getRemoteDialectOptions() {
  // Configurações específicas para conexões remotas (útil a partir do pg 15)
  return {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

async function getConfig(){
  let dbConfig = {
    username: "postgres",
    password: "postgres",
    database: "bia",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5433,
    dialect: "postgres",
    dialectOptions: await isLocalConnection() ? {} : await getRemoteDialectOptions(),
  };

  if(process.env.DB_SECRET_NAME && process.env.DB_SECRET_NAME.trim() !== '' ){
    console.log('🔐 Carregando credenciais do AWS Secrets Manager...');
    console.log('   Secret Name:', process.env.DB_SECRET_NAME);
    console.log('   Region:', process.env.DB_REGION);
    
    const secretsManagerClient = await createSecretsManagerClient();
    const secrets = await getSecrets(secretsManagerClient);

    if(secrets){
      dbConfig.username = secrets.username;
      dbConfig.password = secrets.password;
      console.log('✅ Credenciais carregadas do Secrets Manager');
      console.log('   Username:', secrets.username);
      console.log('   Password: ****' + secrets.password.slice(-4));
      await imprimirSecrets(secrets);
    }
  } else if(process.env.DB_USER && process.env.DB_PWD) {
    console.log('⚠️  Usando credenciais das variáveis de ambiente');
    dbConfig.username = process.env.DB_USER;
    dbConfig.password = process.env.DB_PWD;
  } else {
    console.log('🏠 Usando credenciais padrão (desenvolvimento local)');
  }
  
  return dbConfig;
}

async function createSecretsManagerClient() {
  // Verifica se a variável de ambiente está definida e não está vazia
  let credentials;
  
  if (process.env.IS_LOCAL === "true") {
    credentials = fromEnv();
    //credentials = fromIni({ profile: "SEU_PROFILE" });
  }
  
  if (process.env.DB_SECRET_NAME) {
    // Instancia o cliente do Secrets Manager
    const client = new SecretsManagerClient({
      region: process.env.DB_REGION,
      credentials
    });

  if(process.env.DEBUG_SECRET === "true"){
    const stsClient = new STSClient({
      region: process.env.DB_REGION,
      credentials
    });

    try {
      const identity = await stsClient.send(new GetCallerIdentityCommand({}));
      console.log('Credenciais carregadas com sucesso:', identity);
      console.log('Account ID:', identity.Account);
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
    }
  }
    return client;
  } else {
    console.log('DB_SECRET_NAME não está definida. Se for usar secrets, informe também DB_REGION.');
    return null;
  }
}

async function imprimirSecrets(secrets){
  if(process.env.DEBUG_SECRET === "true")
    console.log(secrets);
}

async function getSecrets(secretsManagerClient) {
  try {
    if (!secretsManagerClient) {
      console.error('O cliente do Secrets Manager não foi instanciado.');
      return;
    }
    console.log(`Vou trabalhar com o secrets ${process.env.DB_SECRET_NAME}`);
    const command = new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_NAME });
    const data = await secretsManagerClient.send(command);

    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      return Buffer.from(data.SecretBinary, 'base64');
    }
  } catch (err) {
    console.error('Erro ao recuperar as credenciais do Secrets Manager:', err);
    throw err;
  }
}

module.exports = getConfig;

