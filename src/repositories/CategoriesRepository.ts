import Category from '../models/Category';
import { EntityRepository, Repository } from 'typeorm';


interface CreateCategoryDTO {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  // private categories: Category[];

  // constructor() {
  //   this.categories = [];
  // }

  // public all(): Category[] {
  //   return this.categories;
  // }

  // public create({title}: CreateCategoryDTO): Category {
  //   const category = new Category({
  //     title,
  //   });

  //   this.categories.push(category);

  //   return category;

 // }
}

export default CategoriesRepository;
