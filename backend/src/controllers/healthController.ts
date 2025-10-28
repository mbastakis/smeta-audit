import { Request, Response } from 'express';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Simple health check response
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json(response);
    
    console.log(`Health check OK - Response time: ${responseTime}ms`);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed'
    });
  }
};
