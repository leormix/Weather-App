import { useState, useEffect } from 'react'

const api = {
  key: '714f2cb8b2a4d94e4b7cf18939161930',
  base: 'https://api.openweathermap.org/data/2.5/'
}

const BACKEND_URL = 'http://localhost:3000'

function App() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({})
  const [forecast, setForecast] = useState([])
  const [favorites, setFavorites] = useState([])


  function getUserId() {
    let id = localStorage.getItem('userId')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now()
      localStorage.setItem('userId', id)
    }
    return id
  }

  const USER_ID = getUserId()


  useEffect(() => {
    fetch(`${BACKEND_URL}/cities?userId=${USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFavorites(data)
        } else {
          console.error('API error:', data)
          setFavorites([])
        }
      })
      .catch(err => {
        console.error(err)
        setFavorites([])
      })
  }, [USER_ID])


  const fetchWeather = (city) => {
    setWeather({})
    setForecast([])
    
    fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}&lang=en`)
      .then(res => res.json())
      .then(data => {
        setWeather(data)
        setQuery('')
      })

    fetch(`${api.base}forecast?q=${city}&units=metric&APPID=${api.key}&lang=en`)
      .then(res => res.json())
      .then(data => {
        const daily = data.list.filter(i => i.dt_txt.includes('12:00:00'))
        setForecast(daily)
      })
  }

  const search = (e) => {
    if (e.key === 'Enter') fetchWeather(query)
  }

  const addToFavorites = async () => {
    if (!weather.name) return
    if (favorites.some(f => f.city === weather.name)) return

    try {
      const res = await fetch(`${BACKEND_URL}/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: weather.name,
          userId: USER_ID
        })
      })

      const city = await res.json()

      if (city?.id) {
        setFavorites(prev => [...prev, city])
      }
    } catch (err) {
      console.error(err)
    }
  }


  const deleteFromFavorites = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/cities/${id}?userId=${USER_ID}`, {
        method: 'DELETE'
      })

      setFavorites(prev =>
        prev.filter(item => item.id !== id)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const getDayName = (date) =>
    new Date(date).toLocaleDateString('ua-UA', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center min-w-screen">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6 md:gap-10 pt-6 px-4">

        {/* Favorites table */}
        <div className="
          w-full md:w-64 h-fit bg-white rounded-2xl shadow-lg p-5">
          <h3 className="text-gray-700 font-bold mb-4">
            Favorites
          </h3>

          <div className="flex flex-col gap-3">
            {favorites.map((item, index) => (
              <div key={item.id || index} className="flex gap-2">
                <button
                  onClick={() => fetchWeather(item.city)}
                  className="flex-1 px-4 py-2 text-left rounded-lg bg-gray-50 hover:bg-gray-100 shadow-sm font-medium text-gray-700 transition"
                >
                  {item.city}
                </button>
                <button
                  onClick={() => deleteFromFavorites(item.id)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg shadow-sm font-bold transition"
                  title="Remove from favorites"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* main content */}
        <div className="flex-1 flex flex-col items-center">

          {/* card */}
          <div className="w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-12">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 mb-6 rounded-xl text-center bg-gray-50 shadow-sm outline-none text-gray-600"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={search}
            />

            {weather.main ? (
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">
                  {weather.name}, {weather.sys.country}
                </h2>

                <div className="text-6xl sm:text-8xl font-bold text-gray-700 my-6">
                  {Math.round(weather.main.temp)}°
                </div>

                <p className="capitalize text-lg sm:text-xl text-gray-600 mb-6">
                  {weather.weather[0].description}
                </p>

                <button
                  onClick={addToFavorites}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg shadow font-semibold">
                  Fav
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Enter city name
              </p>
            )}
          </div>

          {/* 5-days */}
          {forecast.length > 0 && (
            <div className="w-full bg-white rounded-2xl shadow-xl p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {forecast.map((day, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl p-4 text-center shadow-sm">
                    <div className="font-bold text-gray-600 mb-2">
                      {getDayName(day.dt_txt)}
                    </div>

                    <img
                      className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt=""
                    />

                    <div className="font-bold text-gray-700">
                      {Math.round(day.main.temp)}°
                    </div>

                    <div className="text-xs text-gray-500 capitalize">
                      {day.weather[0].description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default App
