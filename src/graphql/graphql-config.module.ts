// graphql-config.module.ts
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { join } from 'path'
import { GqlAuthGuard } from 'src/auth/guards/gpl-auth.guard'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema-v1.gql'),
      playground: process.env.NODE_ENV !== 'prod', //true
      path: 'api/v1/graphql',
      context: ({ req }) => {
        return { req }
      },
    }),
  ],
  providers: [GqlAuthGuard],
  exports: [GraphQLModule],
})
export class GraphqlConfigModule {}
