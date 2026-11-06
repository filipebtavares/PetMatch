import express from 'express';
import animaisRoutes from './routes/animais.routes';

const app = express();
app.disable('x-powered-by');
const PORT = 8080;

app.use(express.json());

// API Routes
app.use('/api/animais', animaisRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
