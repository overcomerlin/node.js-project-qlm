import app from "./app.js";
import config from "./src/config/index.js";

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
