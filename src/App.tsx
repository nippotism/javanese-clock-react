import { useState, useEffect} from 'react'
import { motion } from "framer-motion";
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import ThemeToggle from './components/ui/them-toggle';
import { AuroraBackground } from './components/ui/aurora-background';
import FullScreenToggle from './components/ui/fullscreen-toogle';
import { DrawerDemo } from './components/ui/drawer-sholat';
import { DateTime } from 'luxon';



interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const menet: { [key: string]: string } = {
  '00': '',
  '0': '',
  '01': 'sak',
  '02': 'rong',
  '03': 'telung',
  '04': 'patang',
  '05': 'limo',
  '06': 'enem',
  '07': 'pitung',
  '08': 'wolung',
  '09': 'sangang',
  '10': 'sepuloh',
  '20': 'rong puloh',
  '30': 'telung puloh',
  '40': 'patang puloh',
  '50': 'seket',
};

export const jam: { [key: string]: string } = {
  '0': 'rolas',
  '01': 'sak',
  '02': 'rong',
  '03': 'telung',
  '04': 'patang',
  '05': 'limang',
  '06': 'enem',
  '07': 'pitung',
  '08': 'wolung',
  '09': 'sangang',
  '10': 'sepuloh',
  '11': 'sewelas',
  '12': 'rolas',
};



export function updateSchedule(hour: number, minute: number): string {
  const menet: Record<number, string> = {
      0: '',
      5: 'limo',
      10: 'sepuloh',
      15: 'seprapat',
      20: 'rong puloh',
      25: 'selawe',
      30: 'setengah'
  };

  const jam: Record<number, string> = {
      0: 'rolas',
      1: 'siji',
      2: 'loro',
      3: 'telu',
      4: 'papat',
      5: 'limo',
      6: 'enem',
      7: 'pitu',
      8: 'wolu',
      9: 'songo',
      10: 'sepuloh',
      11: 'sewelas',
      12: 'rolas'
  };

  let ore = '';
  if (hour >= 15 && hour < 18) {
      ore = 'sore';
  } else if (hour >= 18) {
      ore = 'bengi';
  } else if (hour < 11) {
      ore = 'isuk';
  } else {
      ore = 'awan';
  }

  let kuranglebih = '';
  if (minute > 30) {
      kuranglebih = 'kurang';
  } else if (minute < 30) {
      kuranglebih = 'luwih';
  }

  hour = hour >= 12 ? hour - 12 : hour;

  if (minute % 5 !== 0) {
      return `${jam[hour]} ${ore}`;
  }

  if (minute === 30 || minute === 0) {
      hour = minute === 0 ? hour : hour + 1;
      return `${menet[minute]} ${jam[hour]} ${ore}`;
  } else {
      hour = minute > 30 ? hour + 1 : hour;
      minute = minute < 30 ? minute : 60 - minute;
      return `${jam[hour]} ${kuranglebih} ${menet[minute]} ${ore}`;
  }
}

export const parseGregorian = (gregorian: any) => {
  const [day, month, year] = gregorian.split("-");
  return new Date(`${year}-${month}-${day}`).toISOString().split("T")[0];
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", { hour12: false });
};





function App() {

  const [time, setTime] = useState<Date>(new Date());
  const [desc, setDesc] = useState<string>("");
  const [sholatReminder, setSholatReminder] = useState<string>("Dereng Adzan");
  const [dataSholat, setDataSholat] = useState<any>([
    {
      Fajr: "00:00",
      Sunrise: "00:00",
      Dhuhr: "00:00",
      Asr: "00:00",
      Maghrib: "00:00",
      Isha: "00:00",
    },
  ]);

  const [count, setCount] = useState(0);


  const now = new Date();
  let tahun = now.getFullYear();
  let bulan = now.getMonth() + 1; 
  const formattedToday = now.toISOString().split('T')[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    let api = `//api.aladhan.com/v1/calendarByCity/${tahun}/${bulan}?city=semarang&country=Indonesia&method=20`;


    fetch(api)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
        const Data = data.data
        console.log(Data);
        console.log(formattedToday);
        
        const dataToday = Data.filter((item: any) => parseGregorian(item.date.gregorian.date) === formattedToday)[0];
        
        setDataSholat({
          Fajr: dataToday.timings.Fajr.replace(" (WIB)", ""),
          Sunrise: dataToday.timings.Sunrise.replace(" (WIB)", ""),
          Dhuhr: dataToday.timings.Dhuhr.replace(" (WIB)", ""),
          Asr: dataToday.timings.Asr.replace(" (WIB)", ""),
          Maghrib: dataToday.timings.Maghrib.replace(" (WIB)", ""),
          Isha: dataToday.timings.Isha.replace(" (WIB)", ""),
        });

      });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("Data Sholat");
    console.log(dataSholat);
  }, [dataSholat]);

  useEffect(() => {

    if (dataSholat.Fajr === "00:00") {
      return;
    }

    const now = DateTime.local();
    const currentTime = now;

  // Convert prayer times to DateTime objects using Luxon
  const prayerTimes = {
    Subuh: DateTime.fromISO(`${currentTime.toISODate()}T${dataSholat.Fajr}`),
    Dzuhur: DateTime.fromISO(`${currentTime.toISODate()}T${dataSholat.Dhuhr}`),
    Ashar: DateTime.fromISO(`${currentTime.toISODate()}T${dataSholat.Asr}`),
    Maghrib: DateTime.fromISO(`${currentTime.toISODate()}T${dataSholat.Maghrib}`),
    Isya: DateTime.fromISO(`${currentTime.toISODate()}T${dataSholat.Isha}`),
  };

  const sortedPrayerTimes = Object.entries(prayerTimes).sort(
    (a, b) => a[1].toMillis() - b[1].toMillis()
  );

  let nextPrayerName: string | undefined;
  let distanceToNextPrayer = Infinity;
  let previousPrayerName: string | undefined;
  let distanceFromPreviousPrayer = Infinity;

  // Find the next and previous prayer times
  for (let i = 0; i < sortedPrayerTimes.length; i++) {
    const timeDifference = sortedPrayerTimes[i][1].diff(currentTime, 'minutes').minutes;
    if (timeDifference >= 0) {
      if (i > 0) {
        previousPrayerName = sortedPrayerTimes[i - 1][0];
        distanceFromPreviousPrayer = currentTime.diff(sortedPrayerTimes[i - 1][1], 'minutes').minutes;
      }
      nextPrayerName = sortedPrayerTimes[i][0];
      distanceToNextPrayer = timeDifference;
      break;
    }
  }

  console.log('nextPrayerName');
  console.log(nextPrayerName);
  console.log('distanceToNextPrayer');
  console.log(distanceToNextPrayer);
  console.log('previousPrayerName');
  console.log(previousPrayerName);

  if (distanceFromPreviousPrayer < 20) {
    setSholatReminder(`Wayahe solat ${previousPrayerName}.`);
  } else if (distanceToNextPrayer > 0 && distanceToNextPrayer < 480) {
    //add zero to jamm and menitt if less than 10
    const jamm = Math.floor(distanceToNextPrayer / 60);
    const menitt = distanceToNextPrayer % 60;
    const menitper10 = Math.floor(menitt / 10) * 10;

    console.log('jamm');
    console.log(jamm);
    console.log('menitt');
    console.log(menitt);

    if (menitt < 10) {
      if (jamm < 1) {
        setSholatReminder(`${menet[menitt]} ${menitt === 0 ? '' : 'menit'} neh solat ${nextPrayerName}.`);
      } else {
        setSholatReminder(`${jamm < 1 ? '' : jam[jamm] + ' jam'} ${menet[menitper10]} menit meneh solat ${nextPrayerName}.`);
      }
    } else {
      const jamjam = jamm < 10 ? '0' + jamm : jamm;
      setSholatReminder(`${jamm < 1 ? '' : jam[jamjam] + ' jam'} ${menet[menitper10]} menit meneh solat ${nextPrayerName}.`);
    }
  }




  }, [dataSholat]);

  useEffect(() => {
    setDesc(updateSchedule(time.getHours(), Math.floor(time.getMinutes() / 5) * 5));
  }, [time]);







  return (
    <AuroraBackground className="w-full h-screen flex items-center justify-center">
        <div className='absolute lg:bottom-10 lg:right-10 bottom-5 right-5 flex flex-row gap-4'>
          <DrawerDemo />
          <ThemeToggle />
          <FullScreenToggle />
        </div>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className='md:items-center items-left justify-center flex flex-col gap-4'>
            <div className="text-base md:text-4xl dark:text-neutral-200 py-4 font-jakarta-sans font-bold -mb-4 tracking-wider">  
            {formatTime(time)}
            </div>
            <div className="text-6xl text-left sm:text-6xl md:text-8xl lg:text-[9rem] dark:text-white md:text-center font-reenie mb-3 lg:mb-4">
              {desc}.
            </div>
            <div className="bg-black dark:bg-white  px-2 py-1 lg:px-4 lg:py-3 rounded-full text-[0.5rem] md:text-2xl text-white dark:text-black text-center font-space-mono lg:mt-6  mt-3 shadow-md shadow-gray-400 dark:shadow-gray-900 hover:translate-x-2 transition-all duration-400 ease-in-out">
              {sholatReminder}
            </div>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}

export default App;


