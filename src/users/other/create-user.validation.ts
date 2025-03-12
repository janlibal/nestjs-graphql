// create-user.validation.ts

import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator'

// Create a validation DTO that will be used in the resolver and handler
export class CreateUserValidation {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First name must be at least 2 characters long.' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters.' })
  firstName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last name must be at least 2 characters long.' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters.' })
  lastName: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string

  @IsEmail({}, { message: 'Invalid email format.' })
  @IsNotEmpty()
  email: string
}
