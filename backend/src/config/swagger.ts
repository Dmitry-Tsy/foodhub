import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodHub API',
      version: '3.0.0',
      description: 'API для приложения FoodHub - социальная сеть для гурманов',
      contact: {
        name: 'FoodHub Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server (эмулятор)',
      },
      {
        url: 'http://192.168.31.212:3000',
        description: 'Development server (реальное устройство)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT токен полученный после регистрации/входа',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            bio: { type: 'string', nullable: true },
            avatar: { type: 'string', nullable: true },
            trustScore: { type: 'number' },
            followersCount: { type: 'number' },
            followingCount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Restaurant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            googlePlaceId: { type: 'string', nullable: true },
            name: { type: 'string' },
            address: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            cuisineType: { type: 'string' },
            phone: { type: 'string', nullable: true },
            website: { type: 'string', nullable: true },
            photos: { type: 'array', items: { type: 'string' } },
            averageRating: { type: 'number', nullable: true },
            reviewCount: { type: 'number' },
          },
        },
        Dish: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            restaurantId: { type: 'string', format: 'uuid' },
            addedBy: { type: 'string', format: 'uuid' },
            photo: { type: 'string', nullable: true },
            price: { type: 'number', nullable: true },
            category: { type: 'string', nullable: true },
            averageRating: { type: 'number' },
            reviewCount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        DishReview: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            dishId: { type: 'string', format: 'uuid' },
            authorId: { type: 'string', format: 'uuid' },
            rating: { type: 'number', minimum: 0, maximum: 10 },
            comment: { type: 'string', nullable: true },
            foodPairing: { type: 'string', nullable: true },
            photos: { type: 'array', items: { type: 'string' } },
            helpfulCount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        TasteProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            favoriteCuisines: { type: 'array', items: { type: 'string' } },
            favoriteIngredients: { type: 'array', items: { type: 'string' } },
            excludedIngredients: { type: 'array', items: { type: 'string' } },
            spicyLevel: { 
              type: 'string', 
              enum: ['none', 'mild', 'medium', 'hot', 'extreme'] 
            },
            dietaryRestrictions: { type: 'array', items: { type: 'string' } },
            preferredPriceRangeMin: { type: 'number' },
            preferredPriceRangeMax: { type: 'number' },
            tastePreferences: {
              type: 'object',
              properties: {
                sweet: { type: 'number', minimum: 0, maximum: 10 },
                salty: { type: 'number', minimum: 0, maximum: 10 },
                sour: { type: 'number', minimum: 0, maximum: 10 },
                bitter: { type: 'number', minimum: 0, maximum: 10 },
                umami: { type: 'number', minimum: 0, maximum: 10 },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Авторизация и регистрация' },
      { name: 'Users', description: 'Пользователи и их активность' },
      { name: 'Dishes', description: 'Операции с блюдами' },
      { name: 'Reviews', description: 'Отзывы на блюда' },
      { name: 'Restaurants', description: 'Рестораны' },
      { name: 'Taste Profile', description: 'Вкусовые профили' },
      { name: 'Feed', description: 'Лента активности' },
      { name: 'Search', description: 'Глобальный поиск' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

