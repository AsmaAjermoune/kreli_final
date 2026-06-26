const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kreli API",
      version: "1.0.0",
      description: "API documentation for the Kreli rental marketplace platform",
    },
    servers: [{ url: "http://localhost:5000/api/v1", description: "Local dev" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            nom: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["locataire", "proprietaire", "both"] },
            statut: { type: "string", enum: ["actif", "suspendu", "bloque"] },
            telephone: { type: "string" },
            adresse: { type: "string" },
            photo: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        Materiel: {
          type: "object",
          properties: {
            _id: { type: "string" },
            titre: { type: "string" },
            description: { type: "string" },
            prix: { type: "number" },
            categorie: { type: "string" },
            photos: { type: "array", items: { type: "string" } },
            disponible: { type: "boolean" },
            proprietaire: { $ref: "#/components/schemas/User" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Location: {
          type: "object",
          properties: {
            _id: { type: "string" },
            materiel: { $ref: "#/components/schemas/Materiel" },
            locataire: { $ref: "#/components/schemas/User" },
            dateDebut: { type: "string", format: "date" },
            dateFin: { type: "string", format: "date" },
            statut: { type: "string", enum: ["en_attente", "accepte", "refuse", "en_cours", "termine", "annule"] },
            prixTotal: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
