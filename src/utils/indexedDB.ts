import type { TagManagement, ShipOwnership } from '@/types/interfaces'

const DB_NAME = 'KanTagManagerDB'
const TAG_STORE_NAME = 'tagManagement'
const OWNERSHIP_STORE_NAME = 'shipOwnership'
const DB_VERSION = 2  // Version 2 for new schema

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
      const oldVersion = event.oldVersion
      const transaction = (event.target as IDBOpenDBRequest).transaction!

      console.log(`IndexedDB upgrade: v${oldVersion} -> v${DB_VERSION}`)

      // If upgrading to v2, clean start as requested
      if (oldVersion < 2) {
        console.log('Cleaning up and creating new stores for v2...')

        // Delete old tagManagement store if it exists
        if (db.objectStoreNames.contains(TAG_STORE_NAME)) {
          db.deleteObjectStore(TAG_STORE_NAME)
        }

        // Delete old shipOwnership store if it somehow exists
        if (db.objectStoreNames.contains(OWNERSHIP_STORE_NAME)) {
          db.deleteObjectStore(OWNERSHIP_STORE_NAME)
        }

        // Create tagManagement store with new schema
        const tagStore = db.createObjectStore(TAG_STORE_NAME, { keyPath: 'id' })
        tagStore.createIndex('eventId', 'eventId', { unique: false })
        tagStore.createIndex('orig', 'orig', { unique: false })
        // Compound index for unique check
        tagStore.createIndex('eventId_orig_shipIndex', ['eventId', 'orig', 'shipIndex'], { unique: true })
        tagStore.createIndex('shipIndex', 'shipIndex', { unique: false })

        // Create shipOwnership store
        const ownershipStore = db.createObjectStore(OWNERSHIP_STORE_NAME, { keyPath: 'id' })
        ownershipStore.createIndex('orig', 'orig', { unique: true })

        console.log('IndexedDB v2 initialization complete (clean setup)')
      }
    }
  })
}

// ===== Ship Ownership Functions =====

function generateOwnershipId(orig: number): string {
  return `${orig}`
}

export async function saveShipOwnership(data: ShipOwnership): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)

    const dataWithId = {
      ...data,
      id: generateOwnershipId(data.orig)
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

export async function getShipOwnership(orig: number): Promise<ShipOwnership | null> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readonly')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)
    const id = generateOwnershipId(orig)

    const request = store.get(id)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function getAllShipOwnership(): Promise<ShipOwnership[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readonly')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)

    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result || [])
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function deleteShipOwnership(orig: number): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)
    const id = generateOwnershipId(orig)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// ===== Tag Management Functions (Updated for shipIndex) =====

function generateTagId(eventId: number, orig: number, shipIndex: number): string {
  return `${eventId}_${orig}_${shipIndex}`
}

export async function saveTagManagement(data: TagManagement): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TAG_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(TAG_STORE_NAME)

    const dataWithId = {
      ...data,
      id: generateTagId(data.eventId, data.orig, data.shipIndex)
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

export async function getTagManagement(
  eventId: number,
  orig: number,
  shipIndex: number
): Promise<TagManagement | null> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TAG_STORE_NAME], 'readonly')
    const store = transaction.objectStore(TAG_STORE_NAME)
    const id = generateTagId(eventId, orig, shipIndex)

    const request = store.get(id)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

export async function getTagManagementForShip(
  eventId: number,
  orig: number
): Promise<TagManagement[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TAG_STORE_NAME], 'readonly')
    const store = transaction.objectStore(TAG_STORE_NAME)
    const allRequest = store.getAll()

    allRequest.onsuccess = () => {
      const allRecords = allRequest.result || []
      const filtered = allRecords.filter(
        (record) => record.eventId === eventId && record.orig === orig
      )
      resolve(filtered)
    }

    allRequest.onerror = () => {
      reject(allRequest.error)
    }
  })
}

export async function getAllTagManagementForEvent(eventId: number): Promise<TagManagement[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TAG_STORE_NAME], 'readonly')
    const store = transaction.objectStore(TAG_STORE_NAME)
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

export async function deleteTagManagement(
  eventId: number,
  orig: number,
  shipIndex: number
): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TAG_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(TAG_STORE_NAME)
    const id = generateTagId(eventId, orig, shipIndex)

    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
