import keywordExtractor from 'keyword-extractor'
import stemmer from 'stemmer'
import content from './faq.json'

const invertedIndexes = {}
const extractorOptions = { remove_digits: true, remove_duplicates: false, return_changed_case: true }
const TAG_POINTS = 5
const QUESTION_POINTS = 3
const ANSWER_POINTS = 1

content.forEach((item, contentIndex) => {
  // First get the words
  // Question
  const keywords = item.q.split(' ').map(stemmer)
  for (const word of keywords) {
    if (!invertedIndexes[word]) {
      invertedIndexes[word] = []
      invertedIndexes[word][contentIndex] = [contentIndex, QUESTION_POINTS]
    } else if (!invertedIndexes[word][contentIndex]) {
      invertedIndexes[word][contentIndex] = [contentIndex, QUESTION_POINTS]
    } else {
      invertedIndexes[word][contentIndex][1] += QUESTION_POINTS
    }
  }

  // Answer
  const answerKeywords = keywordExtractor.extract(item.a, extractorOptions).map(stemmer)
  for (const word of answerKeywords) {
    if (!invertedIndexes[word]) {
      invertedIndexes[word] = []
      invertedIndexes[word][contentIndex] = [contentIndex, ANSWER_POINTS]
    } else if (!invertedIndexes[word][contentIndex]) {
      invertedIndexes[word][contentIndex] = [contentIndex, ANSWER_POINTS]
    } else {
      invertedIndexes[word][contentIndex][1] += ANSWER_POINTS
    }
  }

  // Tags. Give half points for each word if it's a multi-word tag
  const halfTags = []
  const tags = []
  item.t.forEach(item => {
    tags.push(stemmer(item))
    const splat = item.split(' ')
    if (splat.length > 1) {
      splat.forEach(halfTag => halfTags.push(stemmer(halfTag)))
    }
  })
  const bothTags = [ halfTags, tags ]
  for (let i = 0; i < bothTags.length; ++i) {
    const POINTS = i === 0 ? TAG_POINTS / 2 : TAG_POINTS
    const tags = bothTags[i]
    for (const word of tags) {
      if (!invertedIndexes[word]) {
        invertedIndexes[word] = []
        invertedIndexes[word][contentIndex] = [contentIndex, POINTS]
      } else if (!invertedIndexes[word][contentIndex]) {
        invertedIndexes[word][contentIndex] = [contentIndex, POINTS]
      } else {
        invertedIndexes[word][contentIndex][1] += POINTS
      }
    }
  }

  item.qe = item.q.replace(/\s/g, '-').replace(/\?/g, '')
})

for (const word in invertedIndexes) {
  const invertedIndex = invertedIndexes[word]
  invertedIndexes[word] = invertedIndex.filter(item => item)
}

export { content as faq, invertedIndexes }
