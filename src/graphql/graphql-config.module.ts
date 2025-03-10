import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { join } from 'path'
import { GqlAuthGuard } from 'src/auth/guards/gpl-auth.guard'
import { formatGraphQLError } from './exceptions.formatter'
import { graphqlContext } from './graphql.context'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema-v1.gql'),
      playground: process.env.NODE_ENV !== 'prod', //true
      path: 'api/v1/graphql',
      context: graphqlContext,
      formatError: formatGraphQLError,
    }),
  ],
  providers: [GqlAuthGuard],
  exports: [GraphQLModule],
})
export class GraphqlConfigModule {}
