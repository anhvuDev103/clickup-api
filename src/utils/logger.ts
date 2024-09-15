const getLogger = (type: string) => (content: string) => {
  const now = new Date().toISOString();

  console.log(`[${now}] [${type}] ${content}`);
};

export const logger = {
  mongoDb: getLogger('MongoDB'),
  app: getLogger('App'),
};
