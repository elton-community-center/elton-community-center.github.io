/* ADD A CUSTOM PROMPT FOR USER INPUT (TIMES AND IMAGE CHANGE)*/

/* SLIDESHOW TIMES */
const calendar_month_time = 10 *1000
const calendar_schedule_time = 10 *1000
const image_time = 6 *1000

const CalendarRefreshTime = 10 /* REFRESHES THE CALENDAR EVERY (number) ROUNDS*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", function(){
    const progressBar = document.getElementById("progress-bar").querySelector("div")

    const calendar_month = document.getElementById("calendar-month")
    const calendar_schedule = document.getElementById("calendar-schedule")
    const image = document.getElementById("image")

    const calendar_month_URL = "https://calendar.google.com/calendar/embed?height=720&wkst=1&ctz=America%2FWinnipeg&showPrint=0&showTz=0&showTabs=0&showNav=0&showTitle=0&src=ZWx0b25jb21tdW5pdHljZW50ZXJAZ21haWwuY29t&amp;color=%234285F4"
    const calendar_schedule_URL = "https://calendar.google.com/calendar/embed?height=720&wkst=1&ctz=America%2FWinnipeg&showPrint=0&showTz=0&showTabs=0&showNav=0&showTitle=0&mode=AGENDA&src=ZWx0b25jb21tdW5pdHljZW50ZXJAZ21haWwuY29t&amp;color=%234285F4"

    calendar_month.style.display = "block"
    calendar_schedule.style.display = "none"
    image.style.display = "none"

    var currentSlide = 1
    var calendarRefresh = CalendarRefreshTime

    function hideAll(){
        calendar_month.style.display = "none"
        calendar_schedule.style.display = "none"
        image.style.display = "none"
    }

    function tweenProgressBar(duration) {
        let start = 0;
        const step = 100 / (duration / 16);
  
        function update() {
            start += step;
            if (start >= 100) {
                start = 100;
                progressBar.style.width = `${start}%`;
                return;
            }
            progressBar.style.width = `${start}%`;
            requestAnimationFrame(update);
        }
  
        requestAnimationFrame(update); // Start animation
    }

    var IsRunning = false
    async function run(){
        if (IsRunning) {return;}
        IsRunning = true
        while (true){
            if (currentSlide==1) {
                currentSlide+=1
                hideAll()
                if (calendarRefresh <= 0) {
                    let c1 = calendar_month.querySelector("iframe")
                    let c2 = calendar_schedule.querySelector("iframe")
                    c1.src = c1.src
                    c2.src = c2.src

                    calendarRefresh = CalendarRefreshTime
                    console.log("Calendar Refreshed")
                }
                calendar_month.style.display = "block"
                calendar_schedule.style.display = "none"
                image.style.display = "none"

                tweenProgressBar(calendar_month_time)

                await sleep(calendar_month_time);
            } else if (currentSlide==2) {
                currentSlide+=1
                hideAll()
                calendar_month.style.display = "none"
                calendar_schedule.style.display = "block"
                image.style.display = "none"

                tweenProgressBar(calendar_schedule_time)

                await sleep(calendar_schedule_time);
            } else {
                currentSlide = 1
                hideAll()
                calendar_month.style.display = "none"
                calendar_schedule.style.display = "none"
                image.style.display = "block"

                tweenProgressBar(image_time)

                calendarRefresh-=1
                await sleep(image_time);
            }
            await sleep(100);
        }
    }
    run()
})