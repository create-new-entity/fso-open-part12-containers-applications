
const NOTIFICATION_DURATION = 3000

export const handleNotification = (newNotification, setNotification) => {
  setNotification(newNotification)
  setTimeout(() => {
    setNotification(null)
  }, NOTIFICATION_DURATION)
}