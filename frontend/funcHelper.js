
export const calculateDateDiff = (createdAt, currentDate) => {
    // const createdAt = new Date(2000, 0, 1,  9, 0, 23);
    // const currentDate = new Date(2000, 0, 1, 23, 56, 23);
    
    if (currentDate < createdAt) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    let diff = currentDate - createdAt;
    
    let msec = diff;
    let dd = Math.floor(msec / 1000 / 60 / 60 / 24);
    msec -= dd * 1000 * 60 * 60 * 24;
    let hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    let mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    let ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    
    if (dd !== 0) {
        if (dd < 7) {
            return dd === 1 ?
                dd + " day ago" :
                dd + " days ago"
        } else {
            return "so long ago"
        }
    } else if (hh !== 0) {
        return hh === 1 ?
            hh + " hour ago" :
            hh + " hours ago"
    } else if (mm !== 0) {
        return mm === 1 ?
            mm + " minute ago" :
            mm + " minutes ago"
    } else if (ss !== 0) {
        return ss === 1 ?
            ss + " second ago" :
            ss + " seconds ago"
    } else {
        return "Just now"
    }
};