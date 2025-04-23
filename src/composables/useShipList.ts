import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Ship } from '@/types/interfaces'

export const useShipList = async (): Promise<Ship[]> => {
  const querySnapshot = await getDocs(collection(db, 'shiplist'))
  const ships: Ship[] = []
  querySnapshot.forEach((doc) => {
    ships.push({
      id: doc.id,
      ...(doc.data() as Ship), // Updated to use doc.data() instead of data
    })
  })
  return ships
}
