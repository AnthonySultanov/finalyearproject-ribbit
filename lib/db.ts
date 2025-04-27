import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

//this is the retry logic for the database
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

//creates the prisma client
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  //this is the event listener for the database
  const clientWithEvents = client as unknown as {
    $on: (event: string, callback: (e: any) => void) => void;
  } & PrismaClient;

  
  clientWithEvents.$on('query', (e: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Query: ' + e.query);
    }
  });

  clientWithEvents.$on('error', (e: any) => {
    console.error('Prisma Client error:', e);
  });

  return client;
};

//this is the retry logic for the database
export async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
    
      if (
        error.message.includes("Can't reach database server") ||
        error.message.includes("Connection refused") ||
        error.message.includes("Connection terminated unexpectedly") ||
        error.message.includes("Connection timed out")
      ) {
        console.warn(`Database connection attempt ${attempt} failed. Retrying in ${RETRY_DELAY_MS}ms...`);
      
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        continue;
      }
      
  
      throw error;
    }
  }
  
 
  console.error(`Failed to connect to database after ${MAX_RETRIES} attempts`);
  throw lastError;
}


export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
