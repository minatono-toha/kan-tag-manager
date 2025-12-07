import type { TagManagement } from '@/types/interfaces'

const DB_NAME = 'KanTagManagerDB'
const STORE_NAME = 'tagManagement'
const DB_VERSION = 1

let dbInstance: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' })

        // Create indexes for efficient queries
        objectStore.createIndex('eventId', 'eventId', { unique: false })
        objectStore.createIndex('orig', 'orig', { unique: false })
        objectStore.createIndex('eventId_orig', ['eventId', 'orig'], { unique: true })
      }
    }
  })
}

function generateId(eventId: number, orig: number): string {
  return `${eventId}_${orig}`
}

export async function saveTagManagement(data: TagManagement): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const dataWithId = {
      ...data,
      id: generateId(data.eventId, data.orig)
    }

    const request = store.put(dataWithId)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function getTagManagement(eventId: number, orig: number): Promise<TagManagement | null> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const id = generateId(eventId, orig)

    const request = store.get(id)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function getAllTagManagementForEvent(eventId: number): Promise<TagManagement[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('eventId')

    const request = index.getAll(eventId)

    request.onsuccess = () => {
      resolve(request.result || [])
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function deleteTagManagement(eventId: number, orig: number): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const id = generateId(eventId, orig)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
