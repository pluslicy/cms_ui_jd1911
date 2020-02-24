export function getWeekDay() {
  const arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = new Date().getDay()
  return arr[d]
}

