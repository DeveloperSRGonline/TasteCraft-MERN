"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Recipe_js_1 = __importDefault(require("./models/Recipe.js"));
dotenv_1.default.config();
const sampleRecipes = [
    {
        title: 'Truffle Tagliatelle',
        description: 'Rich black truffle cream sauce with hand-cut egg pasta and shaved parmesan.',
        ingredients: [
            '300g fresh egg tagliatelle',
            '50g black truffle paste',
            '100ml heavy cream',
            '30g unsalted butter',
            '40g fresh Parmigiano-Reggiano',
            'Salt and freshly cracked black pepper',
        ],
        steps: [
            'Bring a large pot of salted water to a boiling rolling simmer.',
            'In a wide skillet, melt butter over low heat and add truffle paste.',
            'Pour in heavy cream and simmer gently for 2 minutes.',
            'Cook tagliatelle for 3 minutes until al dente.',
            'Transfer pasta directly to skillet, toss with grated Parmigiano and pasta water until glossy.',
            'Garnish with shaved fresh black truffle and serve immediately.',
        ],
        category: 'Main Dish',
        userId: 'user_1',
        likesCount: 14,
        likedBy: ['user_1'],
    },
    {
        title: 'Smoked Wagyu Burger',
        description: 'Aged cheddar, caramelized onions, smoked bacon, and signature truffle mayo on brioche.',
        ingredients: [
            '200g ground Wagyu beef patty',
            '1 brioche bun',
            '2 slices aged sharp cheddar cheese',
            '1 yellow onion, sliced and caramelized',
            '2 tbsp truffle mayonnaise',
            '2 slices crispy applewood smoked bacon',
        ],
        steps: [
            'Caramelize sliced onions low and slow in butter for 25 minutes.',
            'Preheat cast iron skillet to high heat until smoking.',
            'Sear Wagyu patty for 3 minutes per side, top with cheddar and melt under a lid.',
            'Toast brioche bun with butter.',
            'Spread truffle mayo on bottom bun, add patty, caramelized onions, and crispy bacon.',
        ],
        category: 'Street Food',
        userId: 'user_1',
        likesCount: 29,
        likedBy: ['user_1'],
    },
    {
        title: 'Avocado Tartine with Microgreens',
        description: 'Artisanal sourdough toast topped with smashed Hass avocado, poached egg, and chili flakes.',
        ingredients: [
            '2 slices artisanal sourdough bread',
            '1 ripe Hass avocado',
            '1 fresh organic egg',
            '1 tbsp extra virgin olive oil',
            'Red chili flakes & Maldon sea salt',
            'Fresh microgreens for garnish',
        ],
        steps: [
            'Toast sourdough slices until golden and crisp.',
            'Mash avocado with lemon juice, sea salt, and black pepper.',
            'Poach egg in simmering water with a splash of vinegar for 3 minutes.',
            'Spread avocado evenly on sourdough, top with poached egg, microgreens, and chili flakes.',
        ],
        category: 'Vegan',
        userId: 'user_1',
        likesCount: 8,
        likedBy: [],
    },
    {
        title: 'Matcha Lava Cake',
        description: 'Warm molten matcha green tea cake with a liquid white chocolate heart.',
        ingredients: [
            '100g white chocolate',
            '50g unsalted butter',
            '2 organic eggs',
            '30g granulated sugar',
            '2 tbsp ceremonial grade matcha powder',
            '30g all-purpose flour',
        ],
        steps: [
            'Melt white chocolate and butter together over water bath.',
            'Whisk eggs and sugar until pale and fluffy.',
            'Sift matcha powder and flour into egg mixture, fold gently.',
            'Combine with melted chocolate and pour into ramekins.',
            'Bake at 200°C (400°F) for 10-12 minutes until edges are set but center jiggles.',
        ],
        category: 'Desserts',
        userId: 'user_1',
        likesCount: 21,
        likedBy: ['user_1'],
    },
];
const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tastecraft';
        await mongoose_1.default.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');
        await Recipe_js_1.default.deleteMany({});
        console.log('Cleared existing recipes.');
        await Recipe_js_1.default.insertMany(sampleRecipes);
        console.log('Successfully seeded 4 sample recipes for user_1!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};
seedDB();
