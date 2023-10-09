import {encoded, translations} from './data.js'

// console.log("Let's rock")
// console.log(encoded, translations)


function decoded(encoded, translations) {
  const set = new Set()
  const arr = encoded.map(i => {
    const obj = {}
    Object.keys(i).forEach((prop) => {
      if(prop === 'groupId') set.add(i[prop])
      if(prop.split('Id') && prop !== 'groupId') obj[prop] =  translations[i[prop]] || i[prop]
      else obj[prop] = i[prop]
      if(i[prop] === null) obj[prop] = null
    })
    return obj
  })
  arr.push(set.keys())
  return arr
}



console.log(decoded(encoded, translations))
