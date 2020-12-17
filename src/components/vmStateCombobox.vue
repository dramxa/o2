<template>
    <v-menu offset-y class="c-vm-state-combo" :disabled="isDisabled">
        <template v-slot:activator="{ on }">
            <v-btn class="px-1 custom-transform-class text-none" text v-on="on" :disabled="isDisabled">
                <div class="d-flex align-center"><i :class="state.class + ' ' + state.icon + ' mr-1 mdi icon-20'" ></i><span :class="state.class">{{state.name}}</span><v-icon v-show="!isDisabled" color="#b0bec5" small class="ml-2">mdi-chevron-down</v-icon></div>
            </v-btn>
        </template>
        <v-list class="c-vm-state-combo__list control-combobox border blue050-border br-4">
            <div v-for="(item, index) in actions" :key="index">
                <v-divider v-if="item.code=='divider'"></v-divider>
                <v-list-item  v-if="item.code!='divider'" @click="onClick(item)">
                    <v-list-item-title :class="item.class + ' body-2'"><v-icon :class="'mr-1 ' + item.class">{{item.icon}}</v-icon>{{item.name}}</v-list-item-title>
                </v-list-item>
            </div>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    props: ['value', 'isDisabled'],

    data(){
        return {
            stateCodes:[
                { code: "running"  , name: "Running"  , icon: "mdi-play" , class:"green600" },
                { code: "stopped"  , name: "Stopped"  , icon: "mdi-stop" , class:"grey700"  },
                { code: "suspended", name: "Suspended", icon: "mdi-pause", class:"brown700"   }
            ],

            actionCodes:[
                {code: "powerOn"      , excludeState: ["running"]             , name: "Run"        , icon: "mdi-play"     , class: "green600"},
                // {code: "softPowerOff" , excludeState: ["stopped", "suspended"], name: "Soft stop"  , icon: "mdi-stop"     , class: "grey500"},
                // {code: "softReboot"   , excludeState: ["stopped", "suspended"], name: "Soft reboot", icon: "mdi-autorenew", class: "grey500"},

                // {code: "divider", excludeState: ["stopped", "suspended"]},

                {code: "suspend" , excludeState: ["stopped", "suspended"], name: "Suspend", icon: "mdi-pause"    , class: "brown700"}, 
                {code: "powerOff", excludeState: ["stopped"]             , name: "Stop"   , icon: "mdi-stop"     , class: "grey500" },
                {code: "reboot"  , excludeState: ["stopped", "suspended"], name: "Reboot" , icon: "mdi-autorenew", class: "grey500" } 
           ]
        }
    },

    computed:{
        state(){
            let item = this.stateCodes.find(f=>{ return f.code == this.value });
            return item
        },

        actions(){
            var items =
                this.actionCodes.filter(item =>{ return !item.excludeState.some(s=>{ return s==this.value }); });
            return items;
        }
    },

    methods:{
        onClick(item){
            this.$emit('doAction', item.code);
        }
    }
}
</script>

<style lang="stylus" scoped>
.c-vm-state-combo
    &__list
        width: 200px
</style>
<style scoped>
.white-theme .theme--light.v-btn.v-btn--disabled .v-icon, .dark-theme .theme--light.v-btn.v-btn--disabled .v-icon{color:unset !important;}
</style>