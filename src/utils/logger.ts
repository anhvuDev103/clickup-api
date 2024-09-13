const getLogger = (type: string) => (content: string) => {
  console.log(`[${type}] ${content}`);
};

export const logger = {
  mongoDb: getLogger('MongoDB'),
};
