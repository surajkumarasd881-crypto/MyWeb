import express from 'express';
import apiRoutes from '../server/routes';

const app = express();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount all API endpoints
app.use('/api', apiRoutes);
app.use(apiRoutes); // in case Vercel strips /api prefix

export default app;
