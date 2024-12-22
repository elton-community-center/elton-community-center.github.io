document.addEventListener("DOMContentLoaded", function(){
    const calendar_month = document.getElementById("calender-month")
    const calendar_schedule = document.getElementById("calendar-schedule")
    const image = document.getElementById("image")

    const calendar_month_URL = "https://calendar.google.com/calendar/embed?height=720&wkst=1&ctz=America%2FWinnipeg&showPrint=0&showTz=0&showTabs=0&showNav=0&showTitle=0&src=ZWx0b25jb21tdW5pdHljZW50ZXJAZ21haWwuY29t&amp;color=%234285F4"
    const calendar_schedule_URL = "https://calendar.google.com/calendar/embed?height=720&wkst=1&ctz=America%2FWinnipeg&showPrint=0&showTz=0&showTabs=0&showNav=0&showTitle=0&mode=AGENDA&src=ZWx0b25jb21tdW5pdHljZW50ZXJAZ21haWwuY29t&amp;color=%234285F4"

    calendar_month.style.display = "block"
    calendar_schedule.style.display = "none"
    image.style.display = "none"
})