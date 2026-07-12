import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_MEMO_IMAGES,
  MAX_MEMO_IMAGE_VALUE_LENGTH,
  isMemoImageValueValid,
  joinMemoImages,
  splitMemoImages,
} from './memoImageUtils.js'

test('splitMemoImages filters empty values and whitespace', () => {
  assert.deepEqual(splitMemoImages(' a.jpg, ,b.jpg,, '), ['a.jpg', 'b.jpg'])
})

test('joinMemoImages serializes non-empty original URLs', () => {
  assert.equal(joinMemoImages(['a.jpg', '', ' b.jpg ']), 'a.jpg,b.jpg')
})

test('memo image constants keep the agreed limits', () => {
  assert.equal(MAX_MEMO_IMAGES, 6)
  assert.equal(MAX_MEMO_IMAGE_VALUE_LENGTH, 999)
})

test('isMemoImageValueValid only checks the 999-character storage boundary', () => {
  assert.equal(isMemoImageValueValid('a'.repeat(999)), true)
  assert.equal(isMemoImageValueValid('a'.repeat(1000)), false)
  assert.equal(isMemoImageValueValid('a,b,c,d,e,f,g'), true)
})
