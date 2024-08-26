export const dateConvert = (date: string) => {
  const dateArr = date.split(" ")
  return dateArr[0].replace(/\:/g, '-') + ' ' + dateArr[1]
}