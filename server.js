import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from './generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const app = express()

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

app.use(cors())
app.use(express.json())



/* ===== CREATE USER IF NOT EXISTS ===== */
async function ensureUser(userId) {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId }
  })
}

/* ===== GET CITIES ===== */
/* ===== GET CITIES ===== */
app.get('/cities', async (req, res) => {
  // ИСПРАВЛЕНИЕ: просто берем userId из query
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const cities = await prisma.cities.findMany({
      where: { userId: String(userId) } // На всякий случай приводим к строке
    });
    res.json(cities);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ===== ADD CITY ===== */
app.post('/cities', async (req, res) => {
  try {
    const { city, userId } = req.body
    if (!city || !userId) {
      return res.status(400).json({ error: 'city and userId required' })
    }

    await ensureUser(userId)

    const newCity = await prisma.cities.create({
      data: { city, userId }
    })

    res.json(newCity)
  } catch {
    res.status(400).json({ error: 'City already exists' })
  }
})

/* ===== DELETE CITY ===== */
app.delete('/cities/:id', async (req, res) => {
  const { id } = req.params;

  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const city = await prisma.cities.findFirst({
      where: {
        id: Number(id),
        userId: String(userId)
      }
    });

    if (!city) {
      return res.status(403).json({ error: 'No access or city not found' });
    }

    await prisma.cities.delete({
      where: { id: Number(id) }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
