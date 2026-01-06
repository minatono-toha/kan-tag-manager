import { openDB, type IDBPDatabase, deleteDB } from 'idb'
import type { TagManagement, ShipOwnership, ShipVariantOverride } from '@/types/interfaces'

const DEFAULT_DB_NAME = 'KanTagManagerDB'
const TAG_STORE_NAME = 'tagManagement'
const OWNERSHIP_STORE_NAME = 'shipOwnership'
const VARIANT_STORE_NAME = 'shipVariant'
const METADATA_STORE_NAME = 'externalMetadata'
const DB_VERSION = 5 // Bumped to 5 for metadata store

let dbPromise: Promise<IDBPDatabase> | null = null

// Get current active database name from localStorage
export function getActiveDBName(): string {
  return localStorage.getItem('kan-tag-active-db') || DEFAULT_DB_NAME
}

export function setActiveDBName(name: string) {
  localStorage.setItem('kan-tag-active-db', name)
}

export async function resetDBConnection() {
  if (dbPromise) {
    const db = await dbPromise
    db.close()
    dbPromise = null
  }
}

export async function initDB(): Promise<IDBPDatabase> {
  if (dbPromise) return dbPromise

  const dbName = getActiveDBName()

  dbPromise = openDB(dbName, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`IndexedDB upgrade: v${oldVersion} -> v${newVersion}`)

      // 1. Mandatory cleanup/reset for very old versions or requested reset
      if (oldVersion < 4) {
        console.log('Cleaning up and re-creating all stores for v4...')
        const existingStores = Array.from(db.objectStoreNames)
        existingStores.forEach((name) => {
          db.deleteObjectStore(name)
        })
      }

      // 2. Ensure all stores exist (Safe to call if stores don't exist yet)
      if (!db.objectStoreNames.contains(TAG_STORE_NAME)) {
        const tagStore = db.createObjectStore(TAG_STORE_NAME, { keyPath: 'id' })
        tagStore.createIndex('eventId', 'eventId', { unique: false })
        tagStore.createIndex('orig', 'orig', { unique: false })
        tagStore.createIndex('eventId_orig_shipIndex', ['eventId', 'orig', 'shipIndex'], { unique: true })
        tagStore.createIndex('shipIndex', 'shipIndex', { unique: false })
      }

      if (!db.objectStoreNames.contains(OWNERSHIP_STORE_NAME)) {
        const ownershipStore = db.createObjectStore(OWNERSHIP_STORE_NAME, { keyPath: 'id' })
        ownershipStore.createIndex('orig', 'orig', { unique: true })
      }

      if (!db.objectStoreNames.contains(VARIANT_STORE_NAME)) {
        const variantStore = db.createObjectStore(VARIANT_STORE_NAME, { keyPath: 'id' })
        variantStore.createIndex('orig', 'orig', { unique: false })
      }

      if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
        const metadataStore = db.createObjectStore(METADATA_STORE_NAME, { keyPath: 'id' })
        metadataStore.createIndex('orig', 'orig', { unique: false })
      }

      console.log('IndexedDB initialization complete.')
    },
    blocked() {
      console.warn('IndexedDB upgrade blocked by another tab.')
      alert('他のタブで古いバージョンのサイトが開かれています。すべてのタブを閉じてからリロードしてください。')
    },
    blocking() {
      console.warn('IndexedDB upgrade blocking another tab.')
      db.close() // Close connection to allow upgrade
      dbPromise = null
    },
    terminated() {
      console.error('IndexedDB connection terminated unexpectedly.')
      dbPromise = null
    }
  })

  return dbPromise
}

export async function deleteDatabase(dbName: string): Promise<void> {
  await deleteDB(dbName)
}

// ===== Ship Ownership Functions =====

function generateOwnershipId(orig: number): string {
  return `${orig}`
}

export async function saveShipOwnership(data: ShipOwnership): Promise<void> {
  const db = await initDB()
  const dataWithId = {
    ...data,
    id: generateOwnershipId(data.orig)
  }
  await db.put(OWNERSHIP_STORE_NAME, dataWithId)
}

export async function getShipOwnership(orig: number): Promise<ShipOwnership | null> {
  const db = await initDB()
  const id = generateOwnershipId(orig)
  const result = await db.get(OWNERSHIP_STORE_NAME, id)
  return result || null
}

export async function getAllShipOwnership(): Promise<ShipOwnership[]> {
  const db = await initDB()
  return await db.getAll(OWNERSHIP_STORE_NAME)
}

export async function deleteShipOwnership(orig: number): Promise<void> {
  const db = await initDB()
  const id = generateOwnershipId(orig)
  await db.delete(OWNERSHIP_STORE_NAME, id)
}

// ===== Tag Management Functions =====

function generateTagId(eventId: number, orig: number, shipIndex: number): string {
  return `${eventId}_${orig}_${shipIndex}`
}

export async function saveTagManagement(data: TagManagement): Promise<void> {
  const db = await initDB()
  const dataWithId = {
    ...data,
    id: generateTagId(data.eventId, data.orig, data.shipIndex)
  }
  await db.put(TAG_STORE_NAME, dataWithId)
}

export async function getTagManagement(
  eventId: number,
  orig: number,
  shipIndex: number
): Promise<TagManagement | null> {
  const db = await initDB()
  const id = generateTagId(eventId, orig, shipIndex)
  const result = await db.get(TAG_STORE_NAME, id)
  return result || null
}

export async function getTagManagementForShip(
  eventId: number,
  orig: number
): Promise<TagManagement[]> {
  const db = await initDB()
  const allRecords = await db.getAll(TAG_STORE_NAME)
  return allRecords.filter((record) => record.eventId === eventId && record.orig === orig)
}

export async function getAllTagManagementForEvent(eventId: number): Promise<TagManagement[]> {
  const db = await initDB()
  return await db.getAllFromIndex(TAG_STORE_NAME, 'eventId', eventId)
}

export async function getAllTagManagement(): Promise<TagManagement[]> {
  const db = await initDB()
  return await db.getAll(TAG_STORE_NAME)
}


export async function deleteTagManagement(
  eventId: number,
  orig: number,
  shipIndex: number
): Promise<void> {
  const db = await initDB()
  const id = generateTagId(eventId, orig, shipIndex)
  await db.delete(TAG_STORE_NAME, id)
}

// ===== Ship Variant Persistence Functions =====

function generateVariantKey(orig: number, shipIndex: number): string {
  return `${orig}_${shipIndex}`
}

export async function saveShipVariantOverride(data: ShipVariantOverride): Promise<void> {
  const db = await initDB()
  const dataWithId = {
    ...data,
    id: generateVariantKey(data.orig, data.shipIndex)
  }
  await db.put(VARIANT_STORE_NAME, dataWithId)
}

export async function getAllShipVariantOverrides(): Promise<ShipVariantOverride[]> {
  const db = await initDB()
  return await db.getAll(VARIANT_STORE_NAME)
}

// ===== External Metadata Functions =====

export interface ExternalShipMetadata {
  id?: string // `${orig}_${shipIndex}`
  orig: number
  shipIndex: number
  // JSON fields to preserve
  lv: number
  st: number[]
  exp: number[]
  ex: number
  sp: number[]
  // Any other unknown fields
  [key: string]: any
}

function generateMetadataKey(orig: number, shipIndex: number): string {
    return `${orig}_${shipIndex}`
}

export async function saveShipMetadata(data: ExternalShipMetadata): Promise<void> {
    const db = await initDB()
    const dataWithId = {
        ...data,
        id: generateMetadataKey(data.orig, data.shipIndex)
    }
    await db.put(METADATA_STORE_NAME, dataWithId)
}

export async function getAllShipMetadata(): Promise<ExternalShipMetadata[]> {
    const db = await initDB()
    return await db.getAll(METADATA_STORE_NAME)
}
