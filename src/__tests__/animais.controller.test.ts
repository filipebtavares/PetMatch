import express from 'express';
import request from 'supertest';
import animaisRoutes from '../routes/animais.routes';
import { animais } from '../data/animais';

const app = express();
app.use(express.json());
app.use('/api/animais', animaisRoutes);

describe('Animais API', () => {
  // Backup of initial data to restore after each test
  const initialAnimais = [...animais];

  afterEach(() => {
    // Restore initial data after each test
    animais.length = 0;
    animais.push(...initialAnimais);
  });

  describe('GET /api/animais', () => {
    it('should return all animals', async () => {
      const response = await request(app).get('/api/animais');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('nome', 'Rex');
    });
  });

  describe('POST /api/animais', () => {
    it('should create a new animal with valid data', async () => {
      const novoAnimal = {
        nome: 'Bolinha',
        especie: 'Cachorro',
        idade: 2
      };

      const response = await request(app)
        .post('/api/animais')
        .send(novoAnimal);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome', 'Bolinha');
      expect(response.body).toHaveProperty('disponivel', true);

      // Verify that the animal was added to the data source
      expect(animais).toHaveLength(4);
      expect(animais[3].nome).toBe('Bolinha');
    });

    it('should return 400 if required fields are missing', async () => {
      const animalInvalido = {
        nome: 'Bolinha'
        // missing especie and idade
      };

      const response = await request(app)
        .post('/api/animais')
        .send(animalInvalido);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Nome, espécie e idade são obrigatórios');
      
      // Verify nothing was added
      expect(animais).toHaveLength(3);
    });

    it('should return 400 if nome is empty', async () => {
      const animalInvalido = {
        nome: '   ',
        especie: 'Cachorro',
        idade: 2
      };

      const response = await request(app)
        .post('/api/animais')
        .send(animalInvalido);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Nome não pode ser vazio');
    });

    it('should return 400 if especie is empty', async () => {
      const animalInvalido = {
        nome: 'Bolinha',
        especie: '  ',
        idade: 2
      };

      const response = await request(app)
        .post('/api/animais')
        .send(animalInvalido);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Espécie não pode ser vazia');
    });

    it('should return 400 if idade is negative', async () => {
      const animalInvalido = {
        nome: 'Bolinha',
        especie: 'Cachorro',
        idade: -1
      };

      const response = await request(app)
        .post('/api/animais')
        .send(animalInvalido);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Idade deve ser um número maior ou igual a zero');
    });
  });

  describe('DELETE /api/animais/:id', () => {
    it('should delete an existing animal and return 204', async () => {
      const response = await request(app).delete('/api/animais/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verificar que o animal foi removido
      const listResponse = await request(app).get('/api/animais');
      const ids = listResponse.body.map((a: { id: number }) => a.id);
      expect(ids).not.toContain(1);
    });

    it('should return 404 when trying to delete a non-existing animal', async () => {
      const response = await request(app).delete('/api/animais/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Animal não encontrado');
    });

    it('should return 404 for an invalid (non-numeric) id', async () => {
      const response = await request(app).delete('/api/animais/abc');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Animal não encontrado');
    });
  });
});
