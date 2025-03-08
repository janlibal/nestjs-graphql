// graphql-config.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema-v1.gql'),
      playground: true, // Enable GraphQL Playground in development
      path: 'api/v1/graphql', // Custom GraphQL endpoint
    }),
  ],
  exports: [GraphQLModule],  // Optionally export the GraphQLModule to use it in other modules
})
export class GraphqlConfigModule {}
