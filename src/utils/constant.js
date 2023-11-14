const isProduction = process.env.NODE_ENV === "production";
const domain = isProduction
  ? "https://mental-app-dev.azurewebsites.net"
  : "http://localhost:8081";
const audioDomain = isProduction
  ? "https://mental-app-dev.azurewebsites.net"
  : "http://localhost:8084";
export { isProduction, domain, audioDomain };
