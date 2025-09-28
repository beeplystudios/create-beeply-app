export const createContext = (request: Request) => {
  return {
    request,
  };
};

export type TRPCContext = ReturnType<typeof createContext>;
