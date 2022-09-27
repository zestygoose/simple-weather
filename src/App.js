import './App.css';
import axios from 'axios'
import React, { useState, useEffect } from 'react'

function App() {
  const [current, setCurrent] = useState();
  const [daily, setDaily] = useState();
  const [minutely, setMinutely] = useState([]);
  const [timezone, setTimezone] = useState();
  const [offset, setOffset] = useState();
  // eslint-disable-next-line
  const [hourly, setHourly] = useState();


  const [position, setPosition] = useState();

  const key = process.env.REACT_APP_WEATHER_API_KEY;

  navigator.geolocation.getCurrentPosition((pos) => {
    setPosition(pos)
  })

  useEffect(() => {
    if (!current) {
      getWeather();
      // getWeatherTest();
    }


    // eslint-disable-next-line
  }, [position])

  const getWeather = async () => {
    console.log('Key?', key);

    if (!position || !key)
      return;

    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    console.log(`Request: https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}`);

    var response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}`);

    if (response?.data) {
      console.log('Response: ' + response)

      const { current, daily, hourly, minutely, timezone, timezone_offset } = response.data;

      setCurrent(current);
      setDaily(daily);
      setHourly(hourly);
      setMinutely(minutely);
      setTimezone(timezone);
      setOffset(timezone_offset / 3600);
    }
  }

  // eslint-disable-next-line
  const getWeatherTest = async () => {
    const response = await fetch('weather-data.json', {
      headers: {
        'content-type': 'application/json',
        'accept': 'application-json'
      }
    })

    if (response) {
      const data = await response.json();

      const { current, daily, hourly, minutely, timezone, timezone_offset } = data;

      setCurrent(current);
      setDaily(daily);
      setHourly(hourly);
      setMinutely(minutely);
      setTimezone(timezone);
      setOffset(timezone_offset / 3600);
    }
  }

  const renderCurrent = (c, m) => {
    return (
      <section className=''>
        <div className='flex justify-center'>
          <div className=''>
            <img className='w-24 h-24' alt='' src={"http://openweathermap.org/img/w/" + c?.weather[0]?.icon + ".png"}></img>
          </div>
          <div className='' style={{ fontSize: "64px" }}>{celsius(c?.temp)}&deg;C</div>
        </div>
        <table className='mx-auto'>
          <tbody>
            <tr>
              <td className='pr-16'>Humidity</td>
              <td>{c?.humidity}%</td>
            </tr>
            <tr>
              <td className='pr-16'>Precipitation</td>
              <td>{m[0]?.precipitation}%</td>
            </tr>
            <tr>
              <td className='pr-16'>Wind</td>
              <td>{c?.wind_speed} KpH</td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }

  const renderDaily = (d) => {
    return (
      <section className='pt-4'>
        <div className='flex'>
          {daily?.map((d, i) => {
            return (
              <div key={i} className='p-4 hover:bg-red-500 rounded-lg cursor-pointer'>
                <div className='text-center'>{day(d.dt)}</div>
                <img alt='' src={"http://openweathermap.org/img/w/" + d?.weather[0]?.icon + ".png"}></img>
                <div className='text-center'>{celsius(d.temp.max)}&deg;C</div>
                <div className='text-center'>{celsius(d.temp.min)}&deg;C</div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className='h-screen bg-gradient-to-r from-cyan-500 to-blue-500'>
      <div className='container h-screen flex justify-center items-center mx-auto'>
        <div className='bg-slate-700 rounded-xl text-white'>
          <div className='p-3'>
            <div className='text-xl font-bold'>
              {timezone} (GMT{offset})
            </div>
            <div className='text-xs font-light'>
              Updated {date(current?.dt)}
            </div>
          </div>
          
            {current ? renderCurrent(current, minutely) : <></>}

            {current ? renderDaily(daily) : <></>}
          
        </div>
      </div>
    </div>
  );
}

function date(epoch) {
  var date = new Date(epoch * 1000);

  return date.toUTCString();
}

function celsius(kelvin) {
  return Math.round((kelvin - 272.15) * 10) / 10;
}

function day(epoch) {
  var day = new Date(epoch * 1000).getDay();

  switch (day) {
    case 0: return 'Sun'
    case 1: return 'Mon'
    case 2: return 'Tues'
    case 3: return 'Wed'
    case 4: return 'Thu'
    case 5: return 'Fri'
    case 6: return 'Sat'
    default:
  }
}

export default App;
