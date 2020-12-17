export const currenciesCode = [
    { code : 'RUB', name : 'RUB', letter: '₽'},
    { code : 'USD', name : 'USD', letter: '$'},
    { code : 'EUR', name : 'EUR', letter: '€'}
]

export const currencies = {
    RUB : { code : 'RUB', name : 'RUB', letter: '₽'},
    USD : { code : 'USD', name : 'USD', letter: '$'},
    EUR : { code : 'EUR', name : 'EUR', letter: '€'}
}

export const services = {
    cpu : {
        name        : 'vCpu',
        description : 'Providing one processor core with a guaranteed frequency'
    },

    ram : {
        name        : 'vRam',
        description : 'Providing a guaranteed amount of RAM in the amount of 1 GB'
    },

    sas : {
        name        : 'vSas',
        description : 'Providing 1 GB of fault-tolerant disk storage located on a disk array of SAS disks'
    },

    sata : {
        name        : 'vSata',
        description : 'Providing 1 GB of fault-tolerant disk storage located on a disk array of SATA disks'
    },

    ssd : {
        name        : 'vSsd',
        description : 'Providing 1 GB of fault-tolerant disk storage located on a disk array of SSD disks'
    },

    winlic : {
        name        : 'Microsoft Windows',
        description : 'Service for organizing remote on-line access to the functionality of Microsoft Windows Server Standard software on a Virtual Machine provided to the Client'
    },

    edge : {
        name        : 'Edge',
        description : 'Providing a Virtual Gateway'
    } 
}