const app = require("./config/express")();
const db = require("./api/models");
const port = app.get("port");

// Inicializar banco e rodar aplicação
(async () => {
  try {
    console.log('='.repeat(60));
    console.log('🚀 INICIANDO APLICAÇÃO BIA');
    console.log('='.repeat(60));
    
    await db.initialize();
    
    console.log('✅ Banco de dados inicializado com sucesso');
    console.log('📊 Usando AWS Secrets Manager para credenciais');
    console.log('🔐 Secret:', process.env.DB_SECRET_NAME || 'N/A');
    console.log('🌎 Região:', process.env.DB_REGION || 'N/A');
    console.log('🗄️  Host:', process.env.DB_HOST || 'N/A');
    console.log('='.repeat(60));
    
    app.listen(port, () => {
      console.log(`✅ Servidor rodando na porta ${port}`);
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
})();
