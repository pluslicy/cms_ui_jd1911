export function getWeekDay(){
  let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];  
  let d = new Date().getDay();  
  return arr[d];
}

