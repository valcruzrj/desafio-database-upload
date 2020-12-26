import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

 import CategoriesRepository from '../repositories/CategoriesRepository';
 import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();

const categoriesRepository = new CategoriesRepository();

categoriesRouter.get('/', async (request, response) => {
  const categoryRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoryRepository.find();

  return response.json({ categories });

});


categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;
  const createCategory = new CreateCategoryService();
  const category = await createCategory.execute({
    title,
  });

  return response.json(category);

});


export default categoriesRouter;
