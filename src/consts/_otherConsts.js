/** Разделы приложения
 * Используются для навигации и основного меню
 */

/** Статус ВМ
 *  Используется для отрисовки списков и свойств */
import { toCN } from '@/utilites'

export const objStatusCode = [
    {   code: "ready",  name: "Ready"   },
    {   code: "busy" ,  name: "Busy"    },
    {   code: "error",  name: "Error"   }
]
export const objStatus = toCN(objStatusCode)


export const objBlockedCode = [
    {   code: "true" ,  name: "Blocked"     },
    {   code: "false",  name: "Not blocked" }
]
export const objBlocked = toCN(objBlockedCode)

export const objLockedCode = [
    {   code: "true" ,  name: "Locked"     },
    {   code: "false",  name: "Not locked" }
]
export const objLocked = toCN(objLockedCode)


export const objYesNoCode = [
    {   code: "true" ,   name: "Yes"   },
    {   code: "false",   name: "No"    }
]
export const objYesNo = toCN(objYesNoCode)



export const netTypesCode = [
    {   code: "public"  ,  name: "Public"    },
    {   code: "isolated",  name: "Isolated"  }
]
export const netTypes = toCN(netTypesCode)

/** Статус задач
 *  Используется для отрисовки списков и свойств */
export const taskStatusCode = [
    {   code: "busy",     name: "Busy"     },
    {   code: "running",  name: "Running"  },
    {   code: "success",  name: "Success"  },
    {   code: "error",    name: "Error"    }
]