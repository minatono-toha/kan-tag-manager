import type { TagManagement, ShipOwnership, ShipVariantOverride } from '@/types/interfaces'

const DB_NAME = 'KanTagManagerDB'
const TAG_STORE_NAME = 'tagManagement'
const OWNERSHIP_STORE_NAME = 'shipOwnership'
const VARIANT_STORE_NAME = 'shipVariant'
const DB_VERSION = 3  // Version 3 for variant overrides and clean start

let dbInstance: IDBDatabase | null = null
let initPromise: Promise<IDBDatabase> | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance
  if (initPromise) return initPromise

  initPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      initPromise = null
      reject(request.error)
    }

    request.onsuccess = () => {
      dbInstance = request.result

      // Handle version changes from other tabs
      dbInstance.onversionchange = () => {
        dbInstance?.close()
        dbInstance = null
        initPromise = null
        alert('新しいバージョンのデータベースが利用可能です。ページをリロードしてください。')
      }

      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const oldVersion = event.oldVersion

      console.log(`IndexedDB upgrade: v${oldVersion} -> v${DB_VERSION}`)

      // 全体クリーンアップ要請あり：全ストアを削除して再作成
      // oldVersion < 3 の場合は全リセット
      if (oldVersion < 3) {
        console.log('Cleaning up and creating new stores for v3 (Reset requested)...')

        // 既存のストアをすべて削除
        const existingStores = Array.from(db.objectStoreNames)
        existingStores.forEach(name => {
          db.deleteObjectStore(name)
        })

        // tagManagement ストア作成
        const tagStore = db.createObjectStore(TAG_STORE_NAME, { keyPath: 'id' })
        tagStore.createIndex('eventId', 'eventId', { unique: false })
        tagStore.createIndex('orig', 'orig', { unique: false })
        tagStore.createIndex('eventId_orig_shipIndex', ['eventId', 'orig', 'shipIndex'], { unique: true })
        tagStore.createIndex('shipIndex', 'shipIndex', { unique: false })

        // shipOwnership ストア作成
        const ownershipStore = db.createObjectStore(OWNERSHIP_STORE_NAME, { keyPath: 'id' })
        ownershipStore.createIndex('orig', 'orig', { unique: true })

        // shipVariant ストア作成
        const variantStore = db.createObjectStore(VARIANT_STORE_NAME, { keyPath: 'id' })
        variantStore.createIndex('orig', 'orig', { unique: false })

        console.log('IndexedDB v3 initialization complete (Clean reset)')
      }
    }
  })

  return initPromise
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
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getShipOwnership(orig: number): Promise<ShipOwnership | null> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readonly')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)
    const id = generateOwnershipId(orig)

    const request = store.get(id)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllShipOwnership(): Promise<ShipOwnership[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readonly')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)

    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

export async function deleteShipOwnership(orig: number): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([OWNERSHIP_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(OWNERSHIP_STORE_NAME)
    const id = generateOwnershipId(orig)

    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ===== Tag Management Functions =====

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
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
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
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
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
    allRequest.onerror = () => reject(allRequest.error)
  })
}

export async function getAllTagManagementForEvent(eventId: number): Promise<TagManagement[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TAG_STORE_NAME], 'readonly')
    const store = transaction.objectStore(TAG_STORE_NAME)
    const index = store.index('eventId')

    const request = index.getAll(eventId)
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
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
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ===== Ship Variant Persistence Functions =====

function generateVariantKey(orig: number, shipIndex: number): string {
  return `${orig}_${shipIndex}`
}

export async function saveShipVariantOverride(data: ShipVariantOverride): Promise<void> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VARIANT_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(VARIANT_STORE_NAME)

    const dataWithId = {
      ...data,
      id: generateVariantKey(data.orig, data.shipIndex)
    }

    const request = store.put(dataWithId)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getAllShipVariantOverrides(): Promise<ShipVariantOverride[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VARIANT_STORE_NAME], 'readonly')
    const store = transaction.objectStore(VARIANT_STORE_NAME)

    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

