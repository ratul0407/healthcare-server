import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  daabase_url: process.env.DATABASE_URL,
  access_secret: process.env.ACCESS_SECRET,
  refresh_secret: process.env.REFRESH_SECRET,
  access_expires: process.env.ACCESS_EXPIRES,
  refresh_expires: process.env.REFRESH_EXPIRES,
  cloudinary: {
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  },
  open_router_api_key: process.env.OPEN_ROUTER_API_KEY,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  webhook_secret: process.env.WEBHOOK_SECRET,
};
