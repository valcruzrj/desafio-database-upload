import { getRepository } from 'typeorm';

import Category from '../models/Category';
import { getCustomRepository }  from 'typeorm';

import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
}


class CreateCategoryService {
  public async execute({
    title,
  }: Request): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = categoriesRepository.create({
      title,});
    await categoriesRepository.save(category);
    return category;
  }
}

export default CreateCategoryService;
