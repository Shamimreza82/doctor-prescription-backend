
import { startServer } from './bootstrap/startServer';

void startServer().catch((error: unknown) => {
  console.error(error)
  process.exit(1);
});
