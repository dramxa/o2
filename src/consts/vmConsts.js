

/** Действия запуска/остановки ВМ
 *  Используется для отрисовки списков и свойств */
export const vmPowerActions = {
    "powerOn"       : "PowerOn"   , 
    "powerOff"      : "PowerOff"  ,
    "softPowerOff"  : "SoftOff"   ,
    "suspend"       : "Suspended" ,
    "softReboot"    : "SoftReset" , 
    "reboot"        : "HardReset" , 
}

export const vmCpuPresets = [
    { code: 1, name: 1 },
    { code: 2, name: 2 },
    { code: 4, name: 4 },
    { code: 6, name: 6 },
    { code: 8, name: 8 },
    { code: 10, name: 10 },
    { code: 16, name: 16 },
]

export const vmRamPresets = [
    { code:  256, name:  256  , precisionCode: 'mb'},
    { code:  512, name:  512  , precisionCode: 'mb'},

    { code:   2, name:  2, precisionCode: 'gb'},
    { code:   4, name:  4, precisionCode: 'gb'},
    { code:   8, name:  8, precisionCode: 'gb'},
    { code:  16, name: 16, precisionCode: 'gb'},
    { code:  32, name: 32, precisionCode: 'gb'},
    { code:  64, name: 64, precisionCode: 'gb'},

    { code:   1, name:  1, precisionCode: 'tb'},
    { code:   2, name:  2, precisionCode: 'tb'},
    { code:   4, name:  4, precisionCode: 'tb'},
    { code:   6, name:  6, precisionCode: 'tb'},
    { code:   8, name:  8, precisionCode: 'tb'},
]

/** Дефолтные конфигурации CPU, RAM ВМ */
export const vmPresets = [
   { code: "cpu1ram2"    , name: '1 CPU/2 GB RAM'   , cpu: 1,  ram:  2, ramPrecisionCode: 'gb' },
   { code: "cpu2ram4"    , name: '2 CPU/4 GB RAM'   , cpu: 2,  ram:  4, ramPrecisionCode: 'gb' },
   { code: "cpu2ram8"    , name: '2 CPU/8 GB RAM'   , cpu: 2,  ram:  8, ramPrecisionCode: 'gb' },
   { code: "cpu4ram8"    , name: '4 CPU/8 GB RAM'   , cpu: 4,  ram:  8, ramPrecisionCode: 'gb' },
   { code: "cpu4ram16"   , name: '4 CPU/16 GB RAM'  , cpu: 4,  ram: 16, ramPrecisionCode: 'gb' },
   { code: "cpu4ram32"   , name: '4 CPU/32 GB RAM'  , cpu: 4,  ram: 32, ramPrecisionCode: 'gb' },
   { code: "cpu8ram32"   , name: '8 CPU/32 GB RAM'  , cpu: 8,  ram: 32, ramPrecisionCode: 'gb' },
   { code: "cpu8ram64"   , name: '8 CPU/64 GB RAM'  , cpu: 8,  ram: 64, ramPrecisionCode: 'gb' },
   { code: "cpu16ram64"  , name: '16 CPU/64 GB RAM' , cpu:16,  ram: 64, ramPrecisionCode: 'gb' },
]

/** Объем информации и конвертация */
export const vmPrecision = [
    { name: "MB", code: "mb", default: false, toMb: function(value) { return value; }              , toCurrent: function(value) { return value }  },
    { name: "GB", code: "gb", default: true , toMb: function(value) { return value * 1024; }       , toCurrent: function(value) { let res = value / 1024; return Math.ceil(res); } },
    { name: "TB", code: "tb", default: false, toMb: function(value) { return value * 1024 * 1024; }, toCurrent: function(value) { let res = value / 1024  / 1024; return Math.ceil(res);  } }    
]


/** Состояние ВМ
 *  Используется для отрисовки списков и свойств */
export const vmPowerStateCode = [
    {
        code: "running",
        name: "Running"
    },
    {
        code: "stopped",
        name: "Stopped"
    },
    {
        code: "suspended",
        name: "Suspended"
    }
]

export const vmPowerState= {       
    "running"   : "Running",
    "stopped"   : "Stopped",
    "suspended" : "Suspended"
}

export const vmDiskPolicyTypes = [
    {
        code: "sas",
        name: "SAS"
    },
    {
        code: "sata",
        name: "SATA"
    },
    {
        code: "ssd",
        name: "SSD"
    }
]
