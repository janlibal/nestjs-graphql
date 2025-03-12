import { NotFoundException } from '@nestjs/common';

async getUserById(id: string): Promise<any> {
  const user = await this.userRepository.findById(id);
  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  return user;
}
