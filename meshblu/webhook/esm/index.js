import util from 'util';
import express from 'express';

const app = express();
app.use(express.json());
app.post('/', (req, resp) => {
  console.log(`Message arrived: ${util.inspect(req.body)}`);
  resp.end();
});
app.listen(80, () => {
  console.log('Server listening on 80');
});
