import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pizzaSizes = [
  { name: 'Standard Ø 28cm', price: 0 },
  { name: 'Large Ø 32cm', price: 3.50 },
  { name: 'Family 46x33cm', price: 8.50 },
  { name: 'Party 60x40cm', price: 13.00 }
];

const pizzaAddons = [
  { name: 'Extra Cheese', price: 1.50 },
  { name: 'Salami', price: 2.00 },
  { name: 'Mushrooms', price: 1.50 },
  { name: 'Garlic', price: 0.50 },
  { name: 'Hot Chili Peppers', price: 1.00 }
];

const pastaAddons = [
  { name: 'Extra Parmesan', price: 1.20 },
  { name: 'Baked with Cheese (Gratinéed)', price: 2.00 },
  { name: 'Extra Sauce', price: 1.50 }
];

const meatAddons = [
  { name: 'French Fries', price: 3.50 },
  { name: 'Croquettes', price: 3.50 },
  { name: 'Mushroom Cream Sauce', price: 2.50 },
  { name: 'Herb Butter', price: 1.50 }
];

const burgerAddons = [
  { name: 'Extra Beef Patty', price: 3.50 },
  { name: 'Crispy Bacon', price: 1.50 },
  { name: 'Cheddar Cheese', price: 1.00 },
  { name: 'Jalapeños', price: 1.00 }
];

const categories = [
  {
    name: "Highlights + Chef's Special",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Homestyle Chicken Fingers 5pcs", description: "100% homemade crispy chicken fingers with dip of your choice", price: 5.90, sizes: [], addons: [{ name: "Sweet Chili Dip", price: 0.80 }, { name: "BBQ Dip", price: 0.80 }] },
      { name: "Homestyle Chicken Fingers 8pcs", description: "100% homemade crispy chicken fingers with dip of your choice", price: 8.90, sizes: [], addons: [{ name: "Sweet Chili Dip", price: 0.80 }, { name: "BBQ Dip", price: 0.80 }] },
      { name: "Chili Cheese Fries", description: "Crispy french fries topped with warm cheddar sauce and jalapeños", price: 7.50, sizes: [], addons: [] },
      { name: "Chili-Cheese Beef Burger", description: "Juicy beef patty, jalapeños, chili cheese sauce, lettuce and tomato + fries", price: 14.90, sizes: [], addons: burgerAddons },
      { name: "Double chili-Cheese Beefburger", description: "Two 180g beef patties, double chili-cheese sauce, jalapeños, lettuce, pickles + fries", price: 17.20, sizes: [], addons: burgerAddons },
      { name: "Chili-Cheese Chicken Burger", description: "Crispy breaded chicken fillet with chili cheese sauce, jalapeños and crispy fries", price: 13.90, sizes: [], addons: burgerAddons },
      { name: "Chili Cheese Burger Pizza Ø 32cm", description: "Special burger pizza with seasoned minced beef, cheddar, jalapeños and burger sauce", price: 14.30, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(14.30 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Fried Noodles with Crispy Chicken", description: "Wok-tossed egg noodles with vegetables, soy sauce and golden crispy sliced chicken breast", price: 16.00, sizes: [], addons: [] },
      { name: "Fried Rice with Crispy Chicken", description: "Wok-fried jasmine rice with egg, seasonal vegetables and golden crunchy chicken", price: 16.00, sizes: [], addons: [] },
      { name: "Crunchy Chicken with Sweet and Sour", description: "100% homemade crunchy chicken fingers with aromatic sweet and sour sauce and fragrant rice", price: 16.00, sizes: [], addons: [] },
      { name: "Mango Chicken", description: "Tender chicken breast in a mild exotic sauce made with ripe mango, spices and cream, served with rice", price: 15.90, sizes: [], addons: [] },
      { name: "Chicken Tikka Masala", description: "Grilled marinated chicken in a creamy aromatic tomato curry sauce with coriander, served with basmati rice", price: 15.70, sizes: [], addons: [] },
      { name: "Chicken Tikka Salad", description: "Large mixed salad topped with warm tandoori chicken, sweet corn, carrots and house dressing", price: 12.80, sizes: [], addons: [] },
      { name: "Butter Chicken", description: "Marinated roasted chicken breast simmered in a silky buttery spiced tomato-cream curry", price: 15.70, sizes: [], addons: [] },
      { name: "Pizza Chicken BBQ Ø 32cm", description: "Smoky BBQ base, mozzarella, chicken breast, red onions and bell peppers", price: 14.10, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(14.10 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "BBQ Beef Pizza Ø 32cm", description: "Rich BBQ sauce, minced beef, crispy bacon, mozzarella and roasted red onions", price: 14.30, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(14.30 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Chef", description: "Chef special recipe with tomato sauce, mozzarella, parma ham, mushrooms, artichokes and garlic", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons }
    ]
  },
  {
    name: "Offers",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Offer A1", description: "1 Pizza (Ø 28cm) with 3 toppings of your choice + 1 small mixed salad + 1 soft drink (0.33l)", price: 15.09, sizes: [], addons: [] },
      { name: "Offer A2", description: "1 Pizza (Ø 32cm) with 3 toppings of your choice + 1 small mixed salad + 1 soft drink (0.33l)", price: 21.09, sizes: [], addons: [] },
      { name: "Offer A3", description: "1 Family Pizza (46x33cm) with 3 toppings of your choice + 1 large mixed salad + 1 bottle of wine or 1.0l drink", price: 23.09, sizes: [], addons: [] },
      { name: "Offer A4", description: "1 Party Pizza (60x40cm) with 3 toppings of your choice + 1 large mixed salad + 1 bottle of wine or 1.0l drink", price: 25.59, sizes: [], addons: [] },
      { name: "Offer C1", description: "2 Family Pizzas (46x33cm) with 3 toppings of your choice each + 1 large mixed salad + 1.0l soft drink", price: 32.00, sizes: [], addons: [] },
      { name: "Offer C2", description: "2 Party Pizzas (60x40cm) with 3 toppings of your choice each + 1 large mixed salad + 1.0l soft drink", price: 36.00, sizes: [], addons: [] },
      { name: "Offer C3", description: "4 Party Pizzas (60x40cm) with 3 toppings of your choice each + 2 large mixed salads + 2 bottles of 1.0l soft drink", price: 67.20, sizes: [], addons: [] }
    ]
  },
  {
    name: "Flammkuchen",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Flammkuchen Classic", description: "Traditional Alsatian style thin crust with sour cream, smoked bacon lardons and diced onions", price: 10.60, sizes: [], addons: [{ name: "Extra Bacon", price: 1.50 }, { name: "Extra Cheese", price: 1.50 }] },
      { name: "Flammkuchen with Ham", description: "Crispy crust with sour cream, diced tender ham and caramelized onions", price: 10.60, sizes: [], addons: [{ name: "Extra Cheese", price: 1.50 }] },
      { name: "Flammkuchen Asparagus", description: "Fresh crème fraîche, tender white and green asparagus spears, ham and spring herbs", price: 11.60, sizes: [], addons: [] },
      { name: "Flammkuchen Greek Style", description: "Crème fraîche, feta cheese, Kalamata olives, diced onions and mild peppers", price: 11.60, sizes: [], addons: [] }
    ]
  },
  {
    name: "Greek Specialties",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Gyros", description: "Spiced rotisserie pork gyros served with tzatziki, crispy french fries and fresh garden salad", price: 14.90, sizes: [], addons: [{ name: "Extra Tzatziki", price: 1.50 }, { name: "Pita Bread", price: 2.00 }] },
      { name: "Gyros Metaxa", description: "Pork gyros baked in authentic rich Metaxa cream sauce, topped with melted Gouda cheese, served with fries and salad", price: 17.00, sizes: [], addons: [] },
      { name: "Gyros Pan", description: "Sautéed gyro meat with bell peppers, onions and fresh mushrooms in a hearty herb sauce, with fries and salad", price: 17.00, sizes: [], addons: [] },
      { name: "Souvlaki", description: "Two tender grilled pork skewers seasoned with Mediterranean herbs, served with tzatziki, fries and salad", price: 15.50, sizes: [], addons: [{ name: "Extra Tzatziki", price: 1.50 }] },
      { name: "Souvlaki Chef Spezial", description: "Grilled souvlaki skewers smothered in Metaxa sauce and gratinéed with cheese, served with fries and salad", price: 17.90, sizes: [], addons: [] }
    ]
  },
  {
    name: "Doner Specialties",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Doner Plate with Salad", description: "Sliced kebab meat served with fresh mixed salad, onions and garlic yogurt sauce", price: 11.50, sizes: [], addons: [{ name: "Extra Meat", price: 3.00 }] },
      { name: "Doner Plate with Chips", description: "Generous portion of sliced kebab meat served with crispy golden french fries and garlic sauce", price: 12.50, sizes: [], addons: [{ name: "Extra Meat", price: 3.00 }] },
      { name: "Pinsa Döner", description: "Crispy oval Pinsa Romana baked with tomato sauce, mozzarella, spiced kebab meat and red onions", price: 16.20, sizes: [], addons: [] },
      { name: "Stuffed Pizza Buns with Döner", description: "6 freshly baked pizza buns filled with seasoned kebab meat and melted mozzarella", price: 10.20, sizes: [], addons: [{ name: "Garlic Dip", price: 1.20 }] },
      { name: "Döner Pizza Ø 32cm", description: "Stone baked pizza topped with tomato sauce, mozzarella, kebab meat and red onions", price: 12.40, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(12.40 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Doner spicy Ø 32cm", description: "With tomato sauce, mozzarella, kebab meat, jalapeños, onions and hot chili flakes", price: 12.90, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(12.90 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Doner Special", description: "Pizza with kebab meat, feta cheese, mild pepperoncini and garlic sauce", price: 12.90, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(12.90 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Döner Con Amore", description: "House specialty with kebab meat, mushrooms, red onions, feta and tzatziki drizzle", price: 12.90, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(12.90 + s.price).toFixed(2) })), addons: pizzaAddons }
    ]
  },
  {
    name: "Salads",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Side Salad", description: "Fresh seasonal greens with tomato, cucumber and house vinaigrette", price: 5.50, sizes: [], addons: [] },
      { name: "Mixed Salad", description: "Crisp mixed leaf lettuce, juicy tomatoes, cucumbers, sweet corn and grated carrots", price: 7.30, sizes: [], addons: [] },
      { name: "Italian Salad", description: "Mixed garden greens with ham, shredded cheese, hard-boiled egg and tuna", price: 11.00, sizes: [], addons: [] },
      { name: "Tomato Onion Salad", description: "Sliced ripe sun-drenched tomatoes and red onions seasoned with oregano and extra virgin olive oil", price: 7.30, sizes: [], addons: [] },
      { name: "Nicoise Salad", description: "Mixed lettuce with flaked tuna, black olives, red onions and boiled egg", price: 10.00, sizes: [], addons: [] },
      { name: "Prawn Salad", description: "Crisp salad bowl topped with pan-sautéed king prawns, garlic herb drizzle and lemon", price: 13.50, sizes: [], addons: [] },
      { name: "Mozzarella Salad", description: "Sliced buffalo mozzarella, ripe tomatoes, fresh basil leaves, olive oil and balsamic cream", price: 11.50, sizes: [], addons: [] },
      { name: "Greek Salad", description: "Crisp cucumber, tomatoes, bell peppers, Kalamata olives, red onions and authentic feta cheese", price: 11.50, sizes: [], addons: [] },
      { name: "Salad with Turkey Breast", description: "Mixed greens topped with succulent grilled turkey breast strips and roasted sunflower seeds", price: 13.50, sizes: [], addons: [] },
      { name: "Rocket Salad", description: "Peppery baby arugula with sweet cherry tomatoes, shaved parmesan and balsamic reduction", price: 12.50, sizes: [], addons: [] },
      { name: "Hawaiian Salad", description: "Crispy salad base with cooked ham, golden pineapple chunks and shredded Gouda", price: 10.00, sizes: [], addons: [] },
      { name: "Salmon Salad", description: "Tender pan-seared salmon fillet strips on crisp mixed seasonal greens with honey-mustard dressing", price: 14.50, sizes: [], addons: [] },
      { name: "Chicken Tikka Salad", description: "Fresh greens with marinated tandoori chicken, sweet corn, bell peppers and yogurt dressing", price: 12.80, sizes: [], addons: [] }
    ]
  },
  {
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Natural Pizza Bread Ø 28cm", description: "Freshly baked pizza dough brushed with olive oil and oregano", price: 5.20, sizes: [], addons: [] },
      { name: "Garlic Pizza Bread Ø 28cm", description: "Crispy pizza bread with fresh aromatic garlic oil and herbs", price: 5.20, sizes: [], addons: [] },
      { name: "Pizza Margherita", description: "Classic tomato sauce, fresh mozzarella cheese and fragrant basil", price: 9.00, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(9.00 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Salami Pizza", description: "San Marzano tomato sauce, mozzarella cheese and hearty beef salami", price: 9.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(9.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Ham Pizza", description: "Tomato sauce, mozzarella cheese and fine cooked ham", price: 9.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(9.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Mushroom Pizza", description: "Tomato sauce, mozzarella cheese and fresh sliced white button mushrooms", price: 9.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(9.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Bolognese", description: "Topped with homemade slow-cooked beef Bolognese sauce and melted mozzarella", price: 9.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(9.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Pepperoni", description: "Tomato sauce, mozzarella and spicy pepperoni sausage", price: 9.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(9.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Tuna, Onions, and Garlic", description: "Juicy tuna, thinly sliced red onions, garlic and melted mozzarella", price: 10.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms, ham, and onions", description: "Classic combination of sautéed mushrooms, ham, diced onions and mozzarella", price: 10.50, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.50 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Gorgonzola, pepperoni sausage, and onions", description: "Robust tangy Gorgonzola blue cheese, spicy pepperoni sausage and onions", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Napoli", description: "Tomato sauce, mozzarella, salty anchovies, capers and black olives", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms, salami, and peppers", description: "Mushrooms, hearty beef salami, sweet bell peppers and mozzarella", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms, salami, and ham", description: "The all-time favorite trio of fresh mushrooms, salami, cooked ham and mozzarella", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms, salami, anchovies, and capers", description: "Mediterranean blend of mushrooms, salami, salty anchovies and capers", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms, salami, onions, capers, and garlic", description: "Savory blend of mushrooms, salami, onions, capers and pungent garlic", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Mushrooms and Salami", description: "Tomato sauce, mozzarella, beef salami and fresh mushrooms", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms and ham", description: "Tomato sauce, mozzarella, sliced mushrooms and cooked ham", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Ham and Pineapple", description: "Hawaiian style with sweet pineapple chunks, savory ham and mozzarella", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with salami, ham, eggs, artichokes, onions", description: "Hearty combination with salami, ham, hard-boiled egg, tender artichoke hearts and onions", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Spinach, Gorgonzola and garlic", description: "Leaf spinach, melted creamy Gorgonzola, garlic and mozzarella", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Chef", description: "Chef's specialty with tomato sauce, mozzarella, parma ham, mushrooms, artichoke and garlic", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Parma", description: "Delicate Italian Parma prosciutto, fresh baby arugula and shaved Grana Padano", price: 12.00, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(12.00 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Calabrese Pizza (spicy)", description: "Spicy Calabrian salami, chili peppers, red onions and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Vegetarian Pizza", description: "Fresh seasonal bell peppers, mushrooms, artichokes, onions, olives and mozzarella", price: 10.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Vegetarian Calzone", description: "Folded pizza pocket stuffed with sautéed spinach, mushrooms, peppers, feta and mozzarella", price: 10.70, sizes: [], addons: [] },
      { name: "Calzone", description: "Folded classic calzone stuffed with ham, salami, mushrooms and melted mozzarella", price: 11.20, sizes: [], addons: [] },
      { name: "Pizza Capricciosa", description: "Ham, fresh mushrooms, artichoke hearts, black olives and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Calabria", description: "Spicy Italian sausage, sun-dried tomatoes, capers, garlic and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Bacon, Onions and Garlic", description: "Smoked bacon strips, sliced yellow onions, aromatic minced garlic and mozzarella", price: 10.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with mushrooms, salami, anchovies, ham, olives", description: "Loaded traditional pizza with five classic toppings and melted mozzarella", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Four Seasons Pizza", description: "Divided in 4 sections: ham, mushrooms, artichokes, and tender bell peppers", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Black Forest Pizza", description: "Smoked Black Forest ham, forest mushrooms, sour cream base and chives", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Boss", description: "Salami, ham, minced meat, bacon, onions and double mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Popeye", description: "Tender baby spinach, fried egg, garlic and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Diavolo", description: "Spicy pepperoni, hot jalapeño slices, red onions and chili oil", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza (spicy)", description: "Spicy ground beef, hot peppers, onions and crushed red pepper flakes", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Seafood Pizza with Garlic", description: "Tender squid, mussels, shrimp, fresh garlic and mozzarella", price: 10.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(10.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Four Cheeses", description: "Quattro Formaggi: mozzarella, gorgonzola, parmesan and creamy fontina", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Milano", description: "Milano salami, fresh mushrooms, sweet corn, boiled egg and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Shrimp, Mussels, Artichokes, and Garlic", description: "King prawns, Mediterranean mussels, tender artichokes and fresh garlic", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza with Eggplant, Ricotta, and Parma Ham", description: "Roasted eggplant slices, creamy Italian ricotta, Parma ham and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza China Town", description: "Crispy chicken strips, bamboo shoots, bell peppers and sweet chili swirl", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Bruschetta", description: "Crisp crust topped with diced seasoned tomatoes, red onions, basil and balsamic glaze", price: 11.20, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.20 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Chicken", description: "Grilled marinated chicken breast, sweetcorn, bell peppers and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons },
      { name: "Pizza Sucuk", description: "Spiced Turkish garlic sausage (sucuk), sheep's milk cheese, mild peppers and mozzarella", price: 11.70, sizes: pizzaSizes.map(s => ({ name: s.name, price: +(11.70 + s.price).toFixed(2) })), addons: pizzaAddons }
    ]
  },
  {
    name: "Pinsa",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Pinsa Margherita", description: "Classic oval artisan Pinsa Romana crust with San Marzano tomato sauce and fior di latte mozzarella", price: 11.00, sizes: [], addons: pizzaAddons },
      { name: "Pinsa Caprese", description: "Topped with fresh sliced tomatoes, creamy buffalo mozzarella, basil leaves and balsamic glaze", price: 15.00, sizes: [], addons: [] },
      { name: "Pinsa Schwarzwald", description: "Crème fraîche base, Black Forest smoked ham, caramelized onions and fresh chives", price: 15.00, sizes: [], addons: [] },
      { name: "Pinsa Quattro Formaggi", description: "Four artisanal cheeses: mozzarella, Gorgonzola, taleggio and aged parmesan", price: 15.20, sizes: [], addons: [] },
      { name: "Pinsa Spicy", description: "Spicy salami, Calabrian nduja, hot jalapeños and mozzarella", price: 15.20, sizes: [], addons: [] },
      { name: "Pinsa Napoli", description: "Tomato sauce, mozzarella, savory anchovy fillets, capers and oregano", price: 15.00, sizes: [], addons: [] },
      { name: "Pinsa Salmon", description: "Crème fraîche, smoked salmon strips, baby spinach, capers and lemon zest", price: 18.00, sizes: [], addons: [] },
      { name: "Pinsa Maria", description: "Cooked ham, fresh champignon mushrooms, artichoke hearts and mozzarella", price: 15.20, sizes: [], addons: [] },
      { name: "Pinsa Parma", description: "Parma prosciutto di San Daniele, rocket salad, cherry tomatoes and parmesan shavings", price: 15.20, sizes: [], addons: [] },
      { name: "Pinsa Aubergine", description: "Grilled marinated eggplant, ricotta salata, tomato sauce and fresh basil", price: 15.00, sizes: [], addons: [] },
      { name: "Pinsa Veggie", description: "Grilled zucchini, bell peppers, eggplant, cherry tomatoes and mozzarella", price: 15.00, sizes: [], addons: [] },
      { name: "Pinsa Sucuk", description: "Spiced Turkish garlic sucuk sausage, creamy feta cheese and mild peppers", price: 16.60, sizes: [], addons: [] },
      { name: "Pinsa Döner", description: "Tender kebab meat, red onions, garlic sauce drizzle and mozzarella", price: 16.20, sizes: [], addons: [] }
    ]
  },
  {
    name: "Stuffed Pizza Buns",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Cheese-filled Pizza Rolls", description: "6 freshly baked warm pizza rolls stuffed with melted mozzarella cheese", price: 8.90, sizes: [], addons: [{ name: "Herb Butter", price: 1.50 }, { name: "Garlic Dip", price: 1.20 }] },
      { name: "Pizza rolls filled with salami", description: "6 pizza rolls filled with beef salami and mozzarella", price: 9.70, sizes: [], addons: [{ name: "Herb Butter", price: 1.50 }] },
      { name: "Pizza rolls filled with ham", description: "6 pizza rolls filled with tender ham and melted mozzarella", price: 9.70, sizes: [], addons: [{ name: "Herb Butter", price: 1.50 }] },
      { name: "Pizza rolls filled with mushrooms", description: "6 pizza rolls stuffed with sautéed mushrooms and cheese", price: 9.70, sizes: [], addons: [] },
      { name: "Pizza rolls filled with ham and mushrooms", description: "6 pizza rolls with savory ham, mushrooms and cheese", price: 10.20, sizes: [], addons: [] },
      { name: "Pizza Rolls filled with Tuna", description: "6 pizza rolls stuffed with juicy tuna, onions and mozzarella", price: 10.20, sizes: [], addons: [] },
      { name: "Potato-filled pizza rolls", description: "6 rolls stuffed with seasoned herb potato puree and cheese", price: 10.20, sizes: [], addons: [] },
      { name: "Chicken-filled Pizza Rolls", description: "6 rolls stuffed with diced roasted chicken breast and cheese", price: 10.20, sizes: [], addons: [] },
      { name: "Sausage-Stuffed Pizza Rolls", description: "6 pizza rolls filled with mild Italian sausage and mozzarella", price: 10.20, sizes: [], addons: [] },
      { name: "Pizza rolls filled with pepperoni sausage", description: "6 pizza rolls packed with spicy pepperoni sausage and cheese", price: 10.20, sizes: [], addons: [] },
      { name: "Stuffed Pizza Buns with Döner", description: "6 pizza rolls stuffed with spiced kebab meat and cheese", price: 10.20, sizes: [], addons: [] },
      { name: "Popeye Pizza Rolls", description: "6 rolls filled with baby spinach, feta cheese and mozzarella", price: 12.20, sizes: [], addons: [] }
    ]
  },
  {
    name: "Pasta - Spaghetti",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Spaghetti Napoli", description: "Classic Italian spaghetti tossed in slow-simmered tomato basil sauce", price: 9.50, sizes: [], addons: pastaAddons },
      { name: "Spaghetti Bolo", description: "Traditional hearty minced beef Bolognese sauce with herbs and parmesan", price: 10.00, sizes: [], addons: pastaAddons },
      { name: "Spaghetti Aglio e Olio", description: "Tossed with extra virgin olive oil, golden garlic, fresh parsley and chili pepper flakes", price: 10.00, sizes: [], addons: pastaAddons },
      { name: "Spaghetti al Pesto", description: "Genovese basil pesto with pine nuts, olive oil and freshly grated parmesan", price: 10.00, sizes: [], addons: pastaAddons },
      { name: "Spaghetti Carbonara", description: "Crispy bacon, egg yolk, cream sauce and aged parmesan cheese", price: 10.50, sizes: [], addons: pastaAddons },
      { name: "Spaghetti quattro Formaggi", description: "Rich, velvety sauce made with four selected Italian melting cheeses", price: 12.60, sizes: [], addons: pastaAddons },
      { name: "Spaghetti ai Frutti di Mare", description: "Spaghetti tossed with tender squid, mussels, shrimp, garlic and white wine tomato sauce", price: 11.40, sizes: [], addons: pastaAddons },
      { name: "Spaghetti come al Mare", description: "King prawns, cherry tomatoes, garlic, white wine and parsley", price: 12.00, sizes: [], addons: pastaAddons },
      { name: "Sicilian-style Spaghetti", description: "Spicy tomato sauce with eggplant, salted ricotta and fresh basil", price: 12.00, sizes: [], addons: pastaAddons },
      { name: "Spaghetti all Amatriciana", description: "Savory pancetta bacon, red onions, chili and rich tomato sauce", price: 12.00, sizes: [], addons: pastaAddons }
    ]
  },
  {
    name: "Pasta - Penne",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Penne with Bolognese", description: "Penne pasta coated with savory slow-cooked minced beef sauce", price: 10.00, sizes: [], addons: pastaAddons },
      { name: "Penne della Capo", description: "Penne with ham, mushrooms, peas and creamy tomato sauce", price: 10.80, sizes: [], addons: pastaAddons },
      { name: "Spicy Penne", description: "Penne with spicy sausage, bell peppers and fiery tomato-chili sauce", price: 10.80, sizes: [], addons: pastaAddons },
      { name: "Penne with Tuna", description: "Flaked tuna, capers, garlic and tomato sauce", price: 10.80, sizes: [], addons: pastaAddons },
      { name: "Penne Cosa Nostra (spicy)", description: "Beef strips, mushrooms, onions and spicy cream sauce", price: 11.80, sizes: [], addons: pastaAddons },
      { name: "Penne Four Cheeses", description: "Penne in a creamy blend of gorgonzola, fontina, parmesan and mozzarella", price: 12.60, sizes: [], addons: pastaAddons },
      { name: "Penne Arrabbiata (spicy)", description: "Fiery spicy tomato sauce infused with fresh garlic, chili and parsley", price: 11.00, sizes: [], addons: pastaAddons },
      { name: "Penne Corsara", description: "Penne with succulent prawns, zucchini and saffron cream sauce", price: 12.70, sizes: [], addons: pastaAddons }
    ]
  },
  {
    name: "Pasta - Tagliatelle",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Tagliatelle with Prosciutto", description: "Egg ribbon pasta with Italian ham and mushrooms in rich cream sauce", price: 11.00, sizes: [], addons: pastaAddons },
      { name: "Tagliatelle with Spinach", description: "Tossed with tender spinach leaves and gorgonzola cream sauce", price: 12.00, sizes: [], addons: pastaAddons },
      { name: "Tagliatelle with Shrimps", description: "Pan-seared shrimps, garlic, cherry tomatoes and white wine lobster butter sauce", price: 13.00, sizes: [], addons: pastaAddons },
      { name: "Spicy Tomato Tagliatelle", description: "Spicy tomato sauce with herbs, garlic and chili", price: 13.00, sizes: [], addons: pastaAddons },
      { name: "Tagliatelle with salmon", description: "Fresh Norwegian salmon strips, dill and creamy pink tomato sauce", price: 13.00, sizes: [], addons: pastaAddons }
    ]
  },
  {
    name: "Pasta - Tortellini",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Tortellini with Bolognese", description: "Meat-stuffed pasta dumplings with traditional beef Bolognese sauce", price: 10.50, sizes: [], addons: pastaAddons },
      { name: "Tortellini with Prosciutto and Cream", description: "Stuffed pasta pockets with cooked ham in a velvety parmesan cream sauce", price: 10.50, sizes: [], addons: pastaAddons },
      { name: "Tortellini 4 cheese", description: "Stuffed tortellini baked in rich four-cheese sauce", price: 12.20, sizes: [], addons: pastaAddons },
      { name: "Tortellini Gorgonzola", description: "Tortellini tossed in intense Gorgonzola cream sauce with walnuts", price: 12.20, sizes: [], addons: pastaAddons }
    ]
  },
  {
    name: "Pasta - Gnocchi",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Gnocchi with Bolognese", description: "Soft potato dumplings smothered in savory homemade beef Bolognese", price: 10.60, sizes: [], addons: pastaAddons },
      { name: "Gnocchi with Spinach", description: "Potato gnocchi tossed with sautéed baby spinach and gorgonzola sauce", price: 12.70, sizes: [], addons: pastaAddons },
      { name: "Gnocchi Tuna", description: "Gnocchi with flaked tuna, sweet capers and fragrant tomato sauce", price: 12.20, sizes: [], addons: pastaAddons },
      { name: "Gnocchi Quattro Formaggi", description: "Potato gnocchi baked with four creamy cheeses and fresh sage", price: 12.50, sizes: [], addons: pastaAddons }
    ]
  },
  {
    name: "Risotto",
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Seafood Risotto", description: "Creamy arborio rice simmered with squid, mussels, shrimp, white wine and parsley", price: 11.40, sizes: [], addons: [] },
      { name: "Risotto with Salmon", description: "Slow-stirred risotto with fresh salmon cubes, dill and a hint of lemon zest", price: 13.00, sizes: [], addons: [] },
      { name: "Risotto with Bolognese", description: "Italian arborio rice cooked with hearty minced beef sauce and parmesan", price: 10.00, sizes: [], addons: [] },
      { name: "Four Cheese Risotto", description: "Creamy risotto made with gorgonzola, parmesan, fontina and taleggio", price: 12.60, sizes: [], addons: [] },
      { name: "Shrimp Risotto", description: "Sautéed king prawns, garlic, cherry tomatoes and white wine infused risotto", price: 13.00, sizes: [], addons: [] }
    ]
  },
  {
    name: "Pasta - Al Forno",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Baked Penne", description: "Penne pasta with Bolognese sauce, ham, cream and baked with golden cheese", price: 11.60, sizes: [], addons: [] },
      { name: "Penne Capo al Forno", description: "Penne with ham, mushrooms, peas, meat sauce, gratinéed with mozzarella", price: 12.60, sizes: [], addons: [] },
      { name: "Lasagne with Bolognese", description: "Classic layered pasta sheets with rich beef ragù, béchamel and melted cheese", price: 11.60, sizes: [], addons: [] },
      { name: "Baked Cannelloni", description: "Pasta tubes filled with seasoned minced meat and spinach, baked with tomato sauce and cheese", price: 11.60, sizes: [], addons: [] },
      { name: "Tortellini Like Grandma Used to Make", description: "Tortellini al forno with ham, peas, mushrooms, meat sauce and melted cheese", price: 12.30, sizes: [], addons: [] },
      { name: "Pasta Misto", description: "Delicious trio of Lasagne, Tortellini and Penne baked al forno with cheese", price: 13.00, sizes: [], addons: [] }
    ]
  },
  {
    name: "Pasta - Vegetarian",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Vegetarian Lasagne", description: "Layered pasta with seasonal garden vegetables, tomato sauce, béchamel and mozzarella", price: 11.60, sizes: [], addons: [] },
      { name: "Vegetarian Cannelloni", description: "Cannelloni pasta rolls stuffed with ricotta and spinach, baked with tomato cream sauce and cheese", price: 11.60, sizes: [], addons: [] },
      { name: "Penne Primavera", description: "Penne with zucchini, bell peppers, broccoli and cherry tomatoes in light herb garlic sauce", price: 10.50, sizes: [], addons: [] }
    ]
  },
  {
    name: "Rösti",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Hunter-Style Rösti", description: "Swiss grated potato cake pan-fried golden, topped with fresh mushroom cream sauce and herbs", price: 12.20, sizes: [], addons: [] },
      { name: "Rösti ham", description: "Crispy potato rösti topped with premium ham, mushrooms and melted cheese", price: 10.80, sizes: [], addons: [] },
      { name: "Rösti Popey", description: "Potato rösti with tender leaf spinach, creamy sheep's cheese (feta) and baked cheese", price: 11.20, sizes: [], addons: [] },
      { name: "Rösti Chicken", description: "Crisp potato cake loaded with seasoned chicken breast strips and baked with cheese", price: 12.00, sizes: [], addons: [] }
    ]
  },
  {
    name: "Potato Bake (Al Forno)",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Potato Bake with Broccoli", description: "Sliced tender potatoes and broccoli florets baked in garlic cream sauce, topped with melted cheese", price: 11.90, sizes: [], addons: [] },
      { name: "Potato Bake with Chicken", description: "Sliced potatoes and roasted chicken chunks in rich tomato cream sauce, baked with cheese", price: 12.90, sizes: [], addons: [] },
      { name: "Potato Bake with Ham & Mushrooms", description: "Sliced potatoes with cooked ham and fresh mushrooms in herb cream sauce, gratinéed with cheese", price: 11.90, sizes: [], addons: [] }
    ]
  },
  {
    name: "Pork Dishes",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Wiener Schnitzel", description: "Crispy breaded pork escalope served with lemon wedges, french fries and side salad", price: 16.00, sizes: [], addons: meatAddons },
      { name: "Cheese Schnitzel", description: "Breaded pork schnitzel smothered in savory Bolognese sauce and baked with cheese", price: 17.00, sizes: [], addons: meatAddons },
      { name: "Breaded Pepper Schnitzel", description: "Crispy schnitzel covered with a spicy Hungarian paprika and pepper cream sauce", price: 17.30, sizes: [], addons: meatAddons },
      { name: "Breaded hunter-style schnitzel", description: "Jägerschnitzel served in a rich cream sauce packed with fresh forest mushrooms", price: 17.30, sizes: [], addons: meatAddons },
      { name: "Cordon Bleu", description: "Pork pocket filled with ham and gooey melted mozzarella, served in rich cream sauce with fries", price: 17.80, sizes: [], addons: meatAddons },
      { name: "Breaded Schnitzel with Prosciutto and Cheese", description: "Crispy schnitzel topped with Italian prosciutto and melted mozzarella in cream sauce", price: 17.80, sizes: [], addons: meatAddons },
      { name: "Schnitzel Asparago", description: "Breaded schnitzel with delicate asparagus tips in white cream sauce, topped with mozzarella", price: 17.80, sizes: [], addons: meatAddons },
      { name: "Breaded Schnitzel with Gorgonzola", description: "Crispy schnitzel smothered in a decadent Gorgonzola blue cheese cream sauce", price: 17.80, sizes: [], addons: meatAddons },
      { name: "Piccata Milanese", description: "Pork cutlet in egg-parmesan crust, served with spaghetti in basil tomato sauce", price: 17.80, sizes: [], addons: [] },
      { name: "Breaded Schnitzel Luci (spicy)", description: "In spicy Bolognese sauce and baked with molten mozzarella cheese", price: 17.80, sizes: [], addons: meatAddons },
      { name: "Pork Steak", description: "Succulent grilled pork steak topped with caramelized fried onions and herb butter", price: 21.20, sizes: [], addons: meatAddons }
    ]
  },
  {
    name: "Beef Dishes",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Sliced Beef Liver with Onions", description: "Tender pan-fried beef liver with glazed caramelized onions, served with side salad and fries", price: 16.70, sizes: [], addons: meatAddons },
      { name: "Lamb Chops with Herb Butter", description: "Grilled marinated lamb cutlets served with homemade herb butter, fries and garden salad", price: 21.50, sizes: [], addons: meatAddons },
      { name: "Grilled Rump Steak with Herb Butter", description: "Prime 250g grilled beef rump steak topped with rich herb butter, with fries and salad", price: 22.50, sizes: [], addons: meatAddons },
      { name: "Rump Steak with Onion Roast", description: "250g grilled steak topped with crispy roasted onions and pan gravy, with fries and salad", price: 23.50, sizes: [], addons: meatAddons },
      { name: "Rump steak with sauce", description: "Grilled rump steak covered in mushroom cream pepper sauce, served with fries and salad", price: 23.50, sizes: [], addons: meatAddons },
      { name: "Rump Steak with Chanterelles", description: "Grilled rump steak served with aromatic wild chanterelle mushrooms in cream sauce", price: 24.50, sizes: [], addons: meatAddons },
      { name: "Rump steak with chanterelles in Gorgonzola cream sauce", description: "Premium steak with chanterelles simmered in rich creamy Gorgonzola sauce", price: 24.90, sizes: [], addons: meatAddons },
      { name: "Rumpsteak a la Capo", description: "Grilled rump steak topped with freshly blistered cherry tomatoes, arugula and shaved parmesan", price: 24.50, sizes: [], addons: meatAddons }
    ]
  },
  {
    name: "Turkey Dishes",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Grilled Turkey Breast with Herb Butter", description: "Tender grilled turkey breast steak with herb butter, french fries and side salad", price: 18.00, sizes: [], addons: meatAddons },
      { name: "Breaded Turkey Schnitzel in Cream Sauce", description: "Crispy breaded turkey schnitzel smothered in smooth cream sauce, served with fries and salad", price: 18.00, sizes: [], addons: meatAddons },
      { name: "Turkey strips with curry cream sauce", description: "Sautéed tender turkey strips in an exotic curry cream sauce with rice and salad", price: 18.90, sizes: [], addons: [] },
      { name: "Sliced Turkey with Mushroom Cream Sauce", description: "Tender sliced turkey breast in fresh mushroom cream sauce, served with spaetzle or fries", price: 18.90, sizes: [], addons: meatAddons }
    ]
  },
  {
    name: "Fish Dishes",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Fried Calamari Rings", description: "Freshly breaded golden crispy squid rings served with tartar sauce, lemon wedges and salad", price: 15.50, sizes: [], addons: [] },
      { name: "Grilled Salmon Fillet", description: "Pan-seared Atlantic salmon fillet served on a bed of sautéed spinach with boiled potatoes", price: 18.50, sizes: [], addons: [] },
      { name: "Grilled Calamari Whole", description: "Tender whole grilled calamari tubes with garlic, olive oil, parsley and mixed salad", price: 17.50, sizes: [], addons: [] },
      { name: "Pangasius fillet in white wine sauce", description: "Delicate fish fillet poached in aromatic white wine herb sauce, served with rice and salad", price: 16.50, sizes: [], addons: [] },
      { name: "Grilled Scampi (7 pieces)", description: "7 succulent grilled king scampi in garlic butter sauce, served with toast and side salad", price: 19.50, sizes: [], addons: [] },
      { name: "Grilled Fish Platter with Various Types of Fish", description: "Grand seafood platter with salmon, calamari and scampi, served with garlic dip and potatoes", price: 22.50, sizes: [], addons: [] }
    ]
  },
  {
    name: "Indian Dishes",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Dal Tadka", description: "Yellow lentils slow-cooked with cumin, ginger, garlic, tomatoes and aromatic Indian spices with rice", price: 13.60, sizes: [], addons: [] },
      { name: "Mix Sabzi", description: "Fresh mixed vegetables sautéed in a mildly spiced curry cream sauce, served with basmati rice", price: 14.00, sizes: [], addons: [] },
      { name: "Chana Masala", description: "Tender chickpeas simmered in a spiced onion, tomato, ginger and coriander gravy with rice", price: 14.00, sizes: [], addons: [] },
      { name: "Chicken Tikka Masala (spicy)", description: "Grilled chicken pieces with bell peppers, onions and spicy red masala curry sauce with basmati rice", price: 15.70, sizes: [], addons: [] },
      { name: "Chicken Curry", description: "Tender chicken breast fillet simmered in traditional fragrant curry sauce with basmati rice", price: 15.00, sizes: [], addons: [] },
      { name: "Butter Chicken", description: "Marinated chicken in a creamy, velvety mild tomato butter curry with aromatic basmati rice", price: 15.70, sizes: [], addons: [] },
      { name: "Chicken Palak", description: "Chicken breast fillet cooked in mildly spiced creamy spinach with garlic, ginger and rice", price: 16.00, sizes: [], addons: [] },
      { name: "Mango Chicken", description: "Tender chicken in an exotic sweet-savory sauce with mango puree, spices and cream, served with rice", price: 15.90, sizes: [], addons: [] },
      { name: "Palak Paneer", description: "Homemade Indian cottage cheese cubes in spiced spinach gravy with ginger and coconut notes", price: 14.00, sizes: [], addons: [] },
      { name: "Mattar Paneer", description: "Indian paneer cubes and green peas simmered in a spiced tomato-onion curry sauce with rice", price: 14.00, sizes: [], addons: [] },
      { name: "Chicken Tikka Salad", description: "Fresh mixed salad topped with warm marinated tandoori chicken, corn and peppers", price: 12.80, sizes: [], addons: [] },
      { name: "Lamb Curry", description: "Succulent tender lamb cubes simmered in a hearty traditional North Indian curry with basmati rice", price: 17.50, sizes: [], addons: [] },
      { name: "Lamb Vindaloo", description: "Spicy Goan lamb curry cooked with potatoes, ginger, garlic and tangy vinegar-spiced sauce", price: 17.50, sizes: [], addons: [] },
      { name: "Lamb Palak", description: "Tender lamb simmered with fresh spinach, onions, garlic and warming Indian spices", price: 17.50, sizes: [], addons: [] }
    ]
  },
  {
    name: "Asian Dishes",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Fried Noodles with Vegetables and Egg", description: "Wok-fried egg noodles with crisp seasonal vegetables, egg, bean sprouts and light soy sauce", price: 12.30, sizes: [], addons: [] },
      { name: "Fried Noodles with Chicken", description: "Wok-fried noodles with sliced tender chicken breast, egg, vegetables and savory sauce", price: 12.70, sizes: [], addons: [] },
      { name: "Fried Rice with Vegetables and Egg", description: "Fragrant fried jasmine rice with egg, carrots, peas, sweetcorn and spring onions", price: 12.30, sizes: [], addons: [] },
      { name: "Fried Rice with Chicken", description: "Wok-tossed fried rice with diced chicken breast, egg and vegetables", price: 12.70, sizes: [], addons: [] },
      { name: "Fried Rice with Crispy Chicken", description: "Fried rice with egg and vegetables topped with golden sliced crunchy chicken breast", price: 16.00, sizes: [], addons: [] },
      { name: "Fried Noodles with Crispy Chicken", description: "Egg noodles with vegetables topped with delicious golden crispy chicken fingers", price: 16.00, sizes: [], addons: [] },
      { name: "Fried Rice with Duck", description: "Fried jasmine rice with egg and vegetables topped with sliced crispy roasted duck", price: 16.00, sizes: [], addons: [] },
      { name: "Fried Noodles with Duck", description: "Wok noodles with vegetables topped with savory sliced crispy roasted duck", price: 16.00, sizes: [], addons: [] },
      { name: "Crunchy Chicken with Sweet and Sour", description: "100% homemade crunchy chicken fingers with bell peppers, pineapple, sweet and sour sauce and rice", price: 16.00, sizes: [], addons: [] },
      { name: "Duck Sweet and Sour", description: "Crispy roasted duck breast with pineapple chunks and bell peppers in classic sweet and sour sauce with rice", price: 17.00, sizes: [], addons: [] }
    ]
  },
  {
    name: "Cheese Spaetzle",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Cheese Spätzle with Cream Sauce", description: "Traditional Swabian egg noodles baked with mountain cheese in a rich cream sauce", price: 10.20, sizes: [], addons: [] },
      { name: "Cheese Spätzle with Bacon & Onions", description: "Egg noodles layered with melted cheese, crispy smoked bacon bits and caramelized onions", price: 13.20, sizes: [], addons: [] },
      { name: "Cheese Spätzle Special", description: "Spätzle with ham, sautéed champignon mushrooms and double mountain cheese, baked golden", price: 13.90, sizes: [], addons: [] }
    ]
  },
  {
    name: "Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Chicken Burger", description: "Crispy chicken breast fillet (150g), fresh lettuce, tomato slices, cucumber, cheese and fries", price: 10.80, sizes: [], addons: burgerAddons },
      { name: "Beef Burger", description: "180g pure beef patty, crisp salad, tomato, cucumber, melted cheddar and burger sauce + french fries", price: 13.20, sizes: [], addons: burgerAddons },
      { name: "Double Beef Burger", description: "Two 180g beef patties (360g), double cheddar, salad, tomatoes, pickles, special sauce + french fries", price: 16.20, sizes: [], addons: burgerAddons },
      { name: "Veggie Burger", description: "Seasoned vegetable patty, crisp lettuce, tomato, cucumber, melted cheese and house sauce + fries", price: 10.20, sizes: [], addons: burgerAddons },
      { name: "Beef BBQ Bacon Burger", description: "180g beef patty, crispy bacon strips, tangy BBQ sauce, cheddar cheese, fried onions + french fries", price: 15.10, sizes: [], addons: burgerAddons },
      { name: "Double Beef BBQ Bacon Burger", description: "Two 180g beef patties, double crispy bacon, smoky BBQ sauce, double cheddar + french fries", price: 17.20, sizes: [], addons: burgerAddons },
      { name: "Chili-Cheese Beef Burger", description: "180g beef, fiery jalapeños, warm chili-cheese sauce, lettuce, tomato + french fries", price: 14.90, sizes: [], addons: burgerAddons },
      { name: "Double Chili-Cheese Beefburger", description: "Two 180g beef patties, double jalapeños, overflowing chili-cheese sauce + french fries", price: 17.20, sizes: [], addons: burgerAddons },
      { name: "Chili-Cheese Chicken Burger", description: "Crispy chicken burger with spicy jalapeños, melted cheddar and chili cheese sauce + fries", price: 13.90, sizes: [], addons: burgerAddons }
    ]
  },
  {
    name: "Children's Plate",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Kids portion spaghetti with tomatoes", description: "Kid-sized portion of fresh spaghetti tossed in mild sweet tomato sauce", price: 9.00, sizes: [], addons: [] },
      { name: "Children's portions spaghetti with Bolognese sauce", description: "Kid-sized portion of spaghetti with homemade mild minced beef Bolognese", price: 9.00, sizes: [], addons: [] },
      { name: "Penne carbonara", description: "Kid-sized penne with cooked ham in mild creamy cheese sauce", price: 9.70, sizes: [], addons: [] },
      { name: "Small Breaded Cream Schnitzel", description: "Small pork schnitzel in delicate cream sauce, served with crispy french fries and small salad", price: 12.70, sizes: [], addons: [] },
      { name: "Small breaded turkey schnitzel", description: "Small turkey schnitzel with mild mushroom cream sauce, french fries and salad", price: 13.20, sizes: [], addons: [] },
      { name: "Kids Chicken Nuggets (4 pcs)", description: "4 golden chicken nuggets with crispy fries and ketchup", price: 7.50, sizes: [], addons: [] }
    ]
  },
  {
    name: "Nuggets & Fingerfood",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Homestyle Chicken Fingers 5 pcs", description: "100% homemade crispy chicken tender fingers with choice of dip", price: 5.90, sizes: [], addons: [{ name: "Sweet Chili Dip", price: 0.80 }, { name: "Garlic Dip", price: 1.20 }] },
      { name: "Homestyle Chicken Fingers 8 pcs", description: "100% homemade crispy chicken tender fingers with choice of dip", price: 8.90, sizes: [], addons: [{ name: "Sweet Chili Dip", price: 0.80 }, { name: "Garlic Dip", price: 1.20 }] },
      { name: "Mozzarella Sticks (5pcs)", description: "5 crispy battered mozzarella sticks with gooey molten cheese center, served with salsa dip", price: 6.90, sizes: [], addons: [] },
      { name: "Mozzarella Sticks (8 pcs)", description: "8 crispy battered mozzarella sticks served with spicy salsa dip", price: 9.90, sizes: [], addons: [] },
      { name: "8 Chicken Nuggets", description: "8 crispy chicken nuggets served with golden french fries", price: 10.20, sizes: [], addons: [] },
      { name: "15 Chicken Nuggets", description: "15 crispy chicken nuggets served with large portion of french fries and dips", price: 16.20, sizes: [], addons: [] },
      { name: "8 Spring Rolls with Vegetables", description: "Crispy vegetarian mini spring rolls with sweet and sour dip", price: 7.09, sizes: [], addons: [] },
      { name: "8 Spring Rolls With Chicken", description: "Crispy mini spring rolls filled with chicken and vegetables, served with sweet chili sauce", price: 7.59, sizes: [], addons: [] },
      { name: "Croquettes 10 pcs", description: "10 golden fried potato croquettes with fluffy potato interior", price: 5.80, sizes: [], addons: [] },
      { name: "2 Homemade Samosas", description: "2 large crispy Indian pastry parcels filled with spiced potatoes, peas and herbs", price: 6.20, sizes: [], addons: [] },
      { name: "Chicken Nuggets (6 pieces) with French Fries", description: "6 chicken nuggets with crispy fries and ketchup or mayo", price: 7.09, sizes: [], addons: [] },
      { name: "Chips (French Fries)", description: "Large portion of crisp salted french fries with ketchup or mayonnaise", price: 5.60, sizes: [], addons: [] },
      { name: "Chili Cheese Fries", description: "Crispy french fries drenched in hot spicy cheddar cheese sauce and sliced jalapeños", price: 7.50, sizes: [], addons: [] }
    ]
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "American Style Brownie", description: "Rich, dense chocolate brownie topped with crunchy roasted walnuts", price: 4.90, sizes: [], addons: [] },
      { name: "Tiramisu, homemade", description: "Authentic homemade Italian tiramisu with coffee-soaked ladyfingers and whipped mascarpone cream", price: 5.60, sizes: [], addons: [] },
      { name: "Magnum Classic", description: "Smooth vanilla ice cream coated in thick cracking milk chocolate", price: 3.20, sizes: [], addons: [] },
      { name: "Magnum Almond", description: "Velvety vanilla ice cream covered in milk chocolate with roasted almond pieces", price: 3.20, sizes: [], addons: [] },
      { name: "Tartufocreme", description: "Italian chocolate and hazelnut gelato ball with cocoa dusting", price: 5.50, sizes: [], addons: [] }
    ]
  },
  {
    name: "Extras",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Basmati Rice", description: "Steamed premium aromatic long-grain Indian basmati rice", price: 5.50, sizes: [], addons: [] },
      { name: "Yogurt Dressing 125ml", description: "Creamy fresh herb and yogurt dressing", price: 1.30, sizes: [], addons: [] },
      { name: "Vinegar-Oil Dressing, 125ml", description: "Classic Italian vinaigrette with virgin olive oil and balsamic vinegar", price: 1.30, sizes: [], addons: [] },
      { name: "Garlic Dip 125ml", description: "Creamy homemade garlic sauce", price: 1.20, sizes: [], addons: [] },
      { name: "Zaziki 125ml", description: "Authentic Greek tzatziki with strained yogurt, cucumber, garlic and olive oil", price: 1.40, sizes: [], addons: [] },
      { name: "Herb Butter", description: "Homemade whipped butter with parsley, chives and garlic", price: 1.50, sizes: [], addons: [] },
      { name: "Ketchup", description: "Portion of tomato ketchup", price: 0.80, sizes: [], addons: [] },
      { name: "Mayonnaise", description: "Portion of rich creamy mayonnaise", price: 0.80, sizes: [], addons: [] },
      { name: "Pizza Bread", description: "Freshly baked pizza dough with oregano and olive oil", price: 5.20, sizes: [], addons: [] }
    ]
  },
  {
    name: "Non-alcoholic Drinks",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "COCA-COLA 033L ALU SC", description: "Coca-Cola Original Taste aluminium sleek can 0.33l (excl. 0.25 € deposit)", price: 2.85, sizes: [], addons: [] },
      { name: "Coca-Cola 1,00 L EW PET", description: "Coca-Cola Original Taste single-use bottle 1.0l (excl. 0.15 € deposit)", price: 4.05, sizes: [], addons: [] },
      { name: "COKE ZERO 24/033L UASC", description: "Coca-Cola Zero Sugar aluminium sleek can 0.33l (excl. 0.25 € deposit)", price: 2.85, sizes: [], addons: [] },
      { name: "COCA-COLA ZERO 1,0 L PET EW 12x", description: "Coca-Cola Zero Sugar 1.0l PET bottle (excl. 0.15 € deposit)", price: 4.05, sizes: [], addons: [] },
      { name: "FANTA ORANGE 033L ALU SC", description: "Fanta Orange aluminium sleek can 0.33l (excl. 0.25 € deposit)", price: 2.85, sizes: [], addons: [] },
      { name: "FANTA ORANGE 1,0 L PET MW 12x", description: "Fanta Orange 1.0l bottle (excl. 0.15 € deposit)", price: 4.05, sizes: [], addons: [] },
      { name: "Sprite 0.33L Can", description: "Sprite lemon-lime soda aluminium can 0.33l (excl. 0.25 € deposit)", price: 2.85, sizes: [], addons: [] },
      { name: "Sprite 1.0L PET", description: "Sprite lemon-lime soda 1.0l PET bottle (excl. 0.15 € deposit)", price: 4.05, sizes: [], addons: [] },
      { name: "MEZZO MIX 24/033L UASC", description: "Mezzo Mix cola-orange fusion sleek can 0.33l (excl. 0.25 € deposit)", price: 2.85, sizes: [], addons: [] },
      { name: "Mezzo Mix 1.0l (Returnable)", description: "Mezzo Mix cola and orange soda 1.0l bottle (excl. 0.15 € deposit)", price: 4.05, sizes: [], addons: [] },
      { name: "Naturpark Quelle Spritzg 1.0l", description: "Sparkling natural mineral water 1.0l glass bottle (excl. 0.15 € deposit)", price: 3.70, sizes: [], addons: [] },
      { name: "Red Bull Energy Drink 250ml DPG", description: "Caffeinated taurine energy drink 250ml can (excl. 0.25 € deposit)", price: 3.20, sizes: [], addons: [] },
      { name: "Lift Apple Schorle 1.0l", description: "Refreshing sparkling apple spritzer 1.0l bottle (excl. 0.15 € deposit)", price: 4.05, sizes: [], addons: [] }
    ]
  },
  {
    name: "Alcoholic Drinks",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60",
    products: [
      { name: "Rothaus Pils 0.5l", description: "Premium Black Forest Pilsner beer (5.1% vol, excl. 0.08 € deposit)", price: 4.10, sizes: [], addons: [] },
      { name: "Little Red Riding Hood Dry 0.7l", description: "Rotkäppchen dry sparkling wine / Sekt (10% vol)", price: 13.59, sizes: [], addons: [] },
      { name: "Laura Romagnelli Lambrusco 0.7l", description: "Sweet Italian sparkling red wine Lambrusco dell'Emilia (8% vol)", price: 12.59, sizes: [], addons: [] },
      { name: "Casalina di Siziano Montepulciano d'Abruzzo", description: "Dry, full-bodied Italian red wine (13% vol)", price: 12.59, sizes: [], addons: [] },
      { name: "Markgräfler Baden Gutedel 1.0l", description: "Regional dry white wine from Baden Markgräflerland (11.5% vol)", price: 13.59, sizes: [], addons: [] },
      { name: "Vodka Gorbatschow 0.7l", description: "Pure, triple-filtered vodka (37.5% vol)", price: 23.00, sizes: [], addons: [] },
      { name: "Rothaus Tannenzäpfle 0.33l", description: "Famous Black Forest small bottle pilsner (5.1% vol)", price: 3.90, sizes: [], addons: [] },
      { name: "Ouzo Mirios 0.7l", description: "Traditional Greek aniseed spirit (37.5% vol)", price: 19.90, sizes: [], addons: [] },
      { name: "Jack Daniels 0.7l", description: "Old No. 7 Tennessee Sour Mash Whiskey (40% vol)", price: 28.00, sizes: [], addons: [] },
      { name: "Jack Daniel & Coca Cola", description: "Premixed Tennessee Whiskey & Cola in a 0.33l can (10% vol)", price: 4.50, sizes: [], addons: [] }
    ]
  }
];

const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);
console.log(`Generated ${categories.length} categories with a total of ${totalProducts} products!`);

const outputPath = path.join(__dirname, 'scraped_menu.json');
fs.writeFileSync(outputPath, JSON.stringify({ categories }, null, 2), 'utf-8');
console.log(`Saved successfully to ${outputPath}`);
