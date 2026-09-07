import { Queue, Worker } from 'bullmq';
import { config } from '../config/env';
import { RiskEngineService } from '../services/riskEngine.service';
import { TransactionService } from '../services/transaction.service';

const redisConnection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

// Queue for asynchronous risk evaluation
export const riskQueue = new Queue('risk-evaluation-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

// Worker processing jobs in background
export const startRiskWorker = () => {
  const worker = new Worker(
    'risk-evaluation-queue',
    async (job) => {
      const { transactionId } = job.data;
      const transaction = await TransactionService.getTransactionById(transactionId);
      const evaluation = await RiskEngineService.evaluateTransaction(transaction);
      return evaluation;
    },
    { connection: redisConnection }
  );

  worker.on('completed', (job) => {
    if (config.env === 'development') {
      console.log(`[BullMQ Worker] Job ${job.id} evaluated transaction in background`);
    }
  });

  worker.on('failed', (job, err) => {
    console.error(`[BullMQ Worker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
};
