import { DateTime } from 'luxon';


interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  }

const PrayerTime = ({ timings }: { timings: PrayerTimings }) => {

  const menet: { [key: string]: string } = {
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

  const jam: { [key: string]: string } = {
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

  // Get the current time using Luxon
  const now = DateTime.local();
  const currentTime = now;

  // Convert prayer times to DateTime objects using Luxon
  const prayerTimes = {
    Subuh: DateTime.fromISO(`${currentTime.toISODate()}T${timings.Fajr}`),
    Dzuhur: DateTime.fromISO(`${currentTime.toISODate()}T${timings.Dhuhr}`),
    Ashar: DateTime.fromISO(`${currentTime.toISODate()}T${timings.Asr}`),
    Maghrib: DateTime.fromISO(`${currentTime.toISODate()}T${timings.Maghrib}`),
    Isya: DateTime.fromISO(`${currentTime.toISODate()}T${timings.Isha}`),
  };

  console.log('timings');
  console.log(timings);

  return (
    `Waktu Subuh: ${prayerTimes.Subuh.toLocaleString()}\n` +
    `Waktu Dzuhur: ${prayerTimes.Dzuhur.toLocaleString(DateTime.TIME_SIMPLE)}\n` +
    `Waktu Ashar: ${prayerTimes.Ashar.toLocaleString(DateTime.TIME_SIMPLE)}\n` +
    `Waktu Maghrib: ${prayerTimes.Maghrib.toLocaleString(DateTime.TIME_SIMPLE)}\n` +
    `Waktu Isya: ${prayerTimes.Isya.toLocaleString(DateTime.TIME_SIMPLE)}\n`
  );

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

  // Display message
  const showMessage = () => {
    if (distanceFromPreviousPrayer < 20) {
      return `Wayahe solat ${previousPrayerName}.`;
    } else if (distanceToNextPrayer > 0 && distanceToNextPrayer < 180) {
      const jamm = Math.floor(distanceToNextPrayer / 60);
      const menitt = distanceToNextPrayer % 60;
      const menitper10 = Math.floor(menitt / 10) * 10;

      if (menitt < 10) {
        if (jamm < 1) {
          return `${menet[menitt]} ${menitt === 0 ? '' : 'menit'} neh solat ${nextPrayerName}.`;
        } else {
          return `${jamm < 1 ? '' : jam[jamm] + ' jam'} ${menet[menitper10]} menit meneh solat ${nextPrayerName}.`;
        }
      } else {
        return `${jamm < 1 ? '' : jam[jamm] + ' jam'} ${menet[menitper10]} menit meneh solat ${nextPrayerName}.`;
      }
    }
  };
};


export default PrayerTime;