
export function formatDateFourHoursEarlier() {
    // Get current date and time
    let currentDate = new Date();

    // Subtract 4 hours from the current date
    currentDate.setHours(currentDate.getHours() - 4);

    // Format the date in dd.MM.yyyy format
    let formattedDate = currentDate.getDate().toString().padStart(2, '0') + '.' +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') + '.' +
        currentDate.getFullYear().toString();

    return formattedDate;
}