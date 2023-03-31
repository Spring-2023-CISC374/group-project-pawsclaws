// JavaScript Import (Any other way????)
// https://www.npmjs.com/package/lodash.flatten
import {flatten} from 'lodash'

export const product = (arr1, arr2) => flatten(arr1.map(e1 => arr2.map(e2 => [e1, e2])))