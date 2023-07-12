import express from 'express';
import { exec } from 'promisify-child-process';

const app = express();
const port = 8099;

const MainPath = process.cwd();

app.listen(port);
