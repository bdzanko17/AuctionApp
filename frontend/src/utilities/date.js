import moment, { months } from "moment";

export const longDateTimeFormat = "D MMMM YYYY [at] HH:mm";

export const getMonth = (n) => {
    return months(n);
}

export const getMonths = () => {
    return months();
}

export const getNextYears = (n) => {
    const year = moment().year();
    return [...Array(n).keys()].map(x => year + x);
}

export const getPastYears = (n) => {
    const year = moment().year();
    return [...Array(n).keys()].map(x => year - x - 1);
}

export const getDaysArrayInMonth = (month, year) => {
    if (month == null || year == null)
        return [];
    const monthM = month > 0 ? month : moment().month() + 1;
    const yearM = year > 0 ? year : moment().year();
    return Array.from({ length: moment(yearM + "-" + monthM, "YYYY-MM").daysInMonth() }, (_, i) => i + 1);
}

export const getDaysInMonth = (month, year) => {
    if (month == null || year == null)
        return 0;
    return moment(year + "-" + month, "YYYY-MM").daysInMonth();
}

export const getLongDateTime = (date) => {
    return moment.utc(date).local().format(longDateTimeFormat);
}

export const getCurrentYear = () => {
    return moment().year();
}

export const getCurrentMonth = () => {
    return moment().month();
}

export const getDurationBetweenDates = (date1, date2) => {
    return moment.duration(date2.diff(date1)).format("Y [years], M [months], W [weeks], D [days], h[h] m[m]", { trim: "all" });
}

export const getDate = (day, month, year) => {
    return moment().set({ "date": day, "month": month, "year": year }).toDate();
}

export const dateCompare = (d1, d2, order) => {
    return order ? moment.utc(d1).isAfter(moment.utc(d2)) : moment.utc(d2).isAfter(moment.utc(d1));
}
