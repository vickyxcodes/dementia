import { openDB } from 'idb'

const DB_NAME = 'dementia-care-db'
const DB_VERSION = 1
const ANSWERS_STORE = 'answers'

export function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ANSWERS_STORE)) {
        db.createObjectStore(ANSWERS_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
      }
    },
  })
}

export async function logAnswer({ domain, correct, timestamp = new Date().toISOString() }) {
  try {
    const db = await initDB()
    const id = await db.add(ANSWERS_STORE, {
      domain,
      correct,
      timestamp,
    })
    return id
  } catch (error) {
    console.error('Failed to write answer to IndexedDB:', error)
  }
}

export async function getAllAnswers() {
  try {
    const db = await initDB()
    return await db.getAll(ANSWERS_STORE)
  } catch (error) {
    console.error('Failed to read answers from IndexedDB:', error)
    return []
  }
}

