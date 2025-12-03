import mongoose from "mongoose";
import app from "./app.js";
import createAuthRoutes from "./interfaces/http/routes/auth.routes.js";
import { authController } from "./infrastructure/config/container.js";


// Montar rutas con dependencias ya inyectadas
app.use("/auth", createAuthRoutes(authController))




const PORT = process.env.PORT ?? 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://admin:secret123@localhost:27017/?authMechanism=DEFAULT";
  
(async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("🔌 Conectado a MongoDB");

      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("❌ Error al iniciar la app", error);
      process.exit(1);
    }
  })();
