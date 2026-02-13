const app = require("./config/express")();
const db = require("./api/models");
const port = app.get("port");

// Inicializar banco e rodar aplicação
(async () => {
  try {
    await db.initialize();
    console.log('Banco de dados inicializado com sucesso');
    
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
})();
