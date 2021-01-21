const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { Parser } = require('json2csv')
const fs = require('fs')

const verbose = false

function jsonToCsv(json) {
  const parser = new Parser({
    header: false
  })
  const csv = parser.parse(json)
  verbose && console.log(csv)
  fs.writeFile('out.csv', csv, function (err) {
    if (err) return console.log(err)
    console.log('out.csv file is generated!')
  })
}

fs.readdir(__dirname + '/input/', (err, files) => {
  if (err) return console.log(err)

  let wordsJson = []
  let wordsCsv = []
  let completedCount = 0
  const filesLength = files.length
  for (const input of files) {
    if (!input.endsWith('.html')) {
      completedCount++
      continue
    }

    JSDOM.fromFile(__dirname + '/input/' + input).then(dom => {
      const document = dom.window.document
      const words = document.getElementsByClassName('card_word')
      for (const word of words) {
        const wordTitle = word.getElementsByClassName('title')[0].text.replace(/[0-9|·]/g, '').trim()

        let wordJson = { title: wordTitle, mean: [] }
        let wordCsv = { title: wordTitle, mean: "" }

        verbose && console.log(wordTitle)
        let meanNum = 1

        const means = word.getElementsByClassName('item_mean')
        for (const mean of means) {
          const desc = mean.getElementsByClassName('mean_desc')[0]
          const partSpeechElm = desc.getElementsByClassName('part_speech')[0]
          const partSpeech = partSpeechElm ? partSpeechElm.textContent : ""
          const cont = desc.getElementsByClassName('cont')[0].textContent.replace(partSpeech, '').trim()

          let meanJson = {
            partSpeech: partSpeech,
            desc: cont,
            examples: []
          }
          wordJson.mean.push(meanJson)
          wordCsv.mean += meanNum.toString() + '.\n'
          if (partSpeech) {
            wordCsv.mean += partSpeech + ' ' + cont + '\n'
          } else {
            wordCsv.mean += cont + '\n'
          }

          verbose && console.log('  ' + meanNum.toString() + '.')
          verbose && console.log('    ' + partSpeech + ' ' + cont)

          const examples = mean.getElementsByClassName('item_example')
          for (const example of examples) {
            const exampleJson = getExampleJsonFromElement(example)
            if (exampleJson) {
              meanJson.examples.push(exampleJson)
              wordCsv.mean += exampleJson.origin + '\n'
              wordCsv.mean += exampleJson.translate + '\n'
            }
          }

          meanNum++
        }
        wordsJson.push(wordJson)
        wordsCsv.push(wordCsv)
      }
      verbose && console.log(wordsJson)

      completedCount++
      if (completedCount == files.length) {
        jsonToCsv(wordsCsv)
      }
    })
  }
})

function getExampleJsonFromElement(example) {
  let origin = example.getElementsByClassName('origin')[0]
  let translate = example.getElementsByClassName('translate')[0]

  if (origin === undefined || translate === undefined) {
    return
  }

  origin = origin.textContent.trim()
  translate = translate.textContent.trim()

  verbose && console.log('    ' + origin)
  verbose && console.log('    ' + translate)

  return {
    origin: origin,
    translate: translate
  }
}
