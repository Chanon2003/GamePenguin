import app, { connectDB } from './app';

const start = async () => {
  await connectDB();
  app.listen(3000, () => console.log('Server running on port 3000'));
};

start();