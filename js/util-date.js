function parseDateValue(rawDate) {
    if (rawDate != '' && rawDate != null) {
        var dateArray = rawDate.split("-");
        //var parsedDate= dateArray[2] +'-'+ dateArray[1] +'-'+ dateArray[0];
        var parsedDate = new Date(parseInt(dateArray[2]), (parseInt(dateArray[1]) - 1), parseInt(dateArray[0]));
        return parsedDate;
    } else {
        return '';
    }
}

function padDate(dd){
    dd = dd.toString()

    return (dd[1] ? dd : "0" + dd[0])
}

function dtString(d) {
    if (!d) {
        return ''
    }

    var insOk = d instanceof Date;

    if (!insOk) {
        d = new Date(d)
    }

    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = d.getDate().toString();

    //return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
    let datestr = (dd[1] ? dd : "0" + dd[0]) + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + yyyy; // padding

    return datestr.indexOf("NaN") > -1 ? '' : datestr;
};

function dateDiffInDay(date1, date2) {
    // Get 1 day in milliseconds
    if (!date1 || !date2) {
        return 0
    }
    // 1000*60*60*24
    var one_day = 86400000;

    var insOk = date1 instanceof Date && date2 instanceof Date;

    if (!insOk) {
        date1 = new Date(date1)
        date2 = new Date(date2)
    }

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

function addDate(dt, amount, dateType) {
    switch (dateType) {
        case 'days':
            return dt.setDate(dt.getDate() + amount) && dt;
        case 'weeks':
            return dt.setDate(dt.getDate() + (7 * amount)) && dt;
        case 'months':
            return dt.setMonth(dt.getMonth() + amount) && dt;
        case 'years':
            return dt.setFullYear( dt.getFullYear() + amount) && dt;
    }
}
  
function currentMonthAtYear(year = null){
    let d = new Date()
    // beware, d.getMonth is subed by 1, for example february is 1
    let arr = [d.getFullYear(), padDate(d.getMonth()+1), padDate(d.getDate())]
    if(year){
        year = parseInt(year)
        d.setYear(year)
        arr[0] = year
    }

    return {
        date:d,
        fmt: arr.join("-")
    }
}
