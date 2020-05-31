export const userClass = (rating) => {
    if (rating == 0) {
        return 'Unrate'
    } else if (rating >= 2500) {
        return 'Legendary'
    } else if (rating >= 2000) {
        return 'Grandmaster'
    } else if (rating >= 1800) {
        return 'Master'
    } else if (rating >= 1650) {
        return 'Professional'
    } else if (rating >= 1500) {
        return 'Regular'
    } else return 'Pupil'
}