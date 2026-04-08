export const healthSchemas = {
  RootHealthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'api work file' },
      data: {
        type: 'null',
        example: null,
      },
      meta: {
        type: 'null',
        example: null,
      },
    },
  },
};
