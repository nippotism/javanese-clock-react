import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {Button} from "@heroui/button";
import { DateTime } from "luxon";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const parseGregorian = (gregorian: any) => {
    const [day, month, year] = gregorian.split("-");
    return new Date(`${year}-${month}-${day}`).toISOString().split("T")[0];
};
 
export function DrawerDemo() {


    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const [prayerTimings, setPrayerTimings] = useState<PrayerTimings>({
        Fajr: "",
        Dhuhr: "",
        Asr: "",
        Maghrib: "",
        Isha: "",
    });

    const now = DateTime.now();
    const nowDate = now.toLocaleString(DateTime.DATE_FULL);
    const formattedToday = new Date().toISOString().split('T')[0];


    const nowjs = new Date();
    let tahun = nowjs.getFullYear();
    let bulan = nowjs.getMonth() + 1; 


      useEffect(() => {

        let api = `//api.aladhan.com/v1/calendarByCity/${tahun}/${bulan}?city=semarang&country=Indonesia&method=20`;
    
    
        fetch(api)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            
            const Data = data.data
            console.log(Data);
            
            const dataToday = Data.filter((item: any) => parseGregorian(item.date.gregorian.date) === formattedToday)[0];
            
            console.log("Data Today");
            setPrayerTimings({
              Fajr: `${formattedToday}T${dataToday.timings.Fajr.replace(" (WIB)", "")}`,
              Dhuhr: `${formattedToday}T${dataToday.timings.Dhuhr.replace(" (WIB)", "")}`,
              Asr: `${formattedToday}T${dataToday.timings.Asr.replace(" (WIB)", "")}`,
              Maghrib: `${formattedToday}T${dataToday.timings.Maghrib.replace(" (WIB)", "")}`,
              Isha: `${formattedToday}T${dataToday.timings.Isha.replace(" (WIB)", "")}`,
            });
    
          });
      }, []);


      useEffect(() => {
        console.log("Prayer Timings");
        console.log(prayerTimings);

      }, [prayerTimings]);

 
 
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
            variant="solid"
            isIconOnly
            className='hover:-translate-y-2 transition-all duration-300'
        >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
            </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-screen">
        <DrawerHeader className="justify-items-center font-jakarta-sans mb-3">
            <DrawerTitle>Jadwal Sholat Hari Ini</DrawerTitle>
            <DrawerDescription>{nowDate}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col lg:flex-row gap-9 justify-center ">
            {Object.entries(prayerTimings).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                        <div className="font-jakarta-sans font-bold">{key=='Fajr'?'Subuh':key}<span className=" ml-1 font-light">|   { DateTime.fromISO(value).toLocaleString(DateTime.TIME_24_SIMPLE)} WIB</span></div>
                        <div>
                        <FlipClockCountdown
                            to={value}
                            renderMap={[false,true,true,true]}
                            labels={['Days', 'Jam', 'Menit', 'Detik']}
                            hideOnComplete={false}
                            digitBlockStyle={{backgroundColor: '#f3f4f6', color: '#1f2937', height: '45px', width: '30px', fontSize: '30px'}}
                            dividerStyle={theme === "dark" ? {color: '#f3f4f6'}:{color: '#1f2937'}}
                        />
                        </div>
                    </div>
                )
            )}
          </div>
          <DrawerFooter>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}