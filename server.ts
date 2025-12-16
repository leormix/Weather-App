import "dotenv/config"; import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client.ts'
import cors from 'cors'
import express from 'express'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }

const app = express();

console.log("URL базы данных:", process.env.DATABASE_URL);

app.use(express.json());
app.use(cors())

app.post('/cities', async (req, res) => {
  try {

    const { city } = req.body;

    // 2. Используем prisma.cities (как в схеме)
    const newCity = await prisma.cities.create({
      data: {

        city: city
      }
    });

    res.json(newCity);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Не удалось создать город' });
  }
});



app.delete('/cities/:id', async (req, res) => {
  try {

    const { id } = req.params;


    const deletedCity = await prisma.cities.delete({
      where: {
        id: Number(id)
      }
    });

    res.json(deletedCity);

  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Не удалось удалить (возможно, такого ID нет)' });
  }
});

app.get('/cities', async (req, res) => {
  try {
    const cities = await prisma.cities.findMany();
    res.json(cities);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
});

app.listen(3000, () => {
  console.log('Server running');
});