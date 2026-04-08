export const healthPaths = {
  '/': {
    get: {
      tags: ['Health'],
      summary: 'Get root status response',
      responses: {
        '200': {
          description: 'Service responded successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RootHealthResponse' },
            },
          },
        },
      },
    },
  },
};
