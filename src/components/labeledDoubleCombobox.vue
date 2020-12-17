<template>
    <v-flex class="mx-2 advanced-editor-col-1" xs12>
        <v-layout>
            <v-flex xs7 class="mr-2">
                <v-card flat tile class="c-labeled-double-combo">
                    <span class="font-regular prop-title fs-s grey700 nonselect">{{label1}}</span><br>
                    <span class="text--primary prop-value">
                        <span v-if="!editMode">{{selected1}}</span>
                        <div v-if="editMode">
                            <v-menu offset-y style="width:100%">
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" text height="24px" style="width:100%;text-transform:none;min-width:unset;" class="text-left justify-space-between align-center px-2 normal-text fs-s fw-b br-2 grey300-border grey700" outlined>
                                        <div class="prop-edit-value">{{selected1}}</div>
                                        <div style="margin-bottom: -3px;"> <i class="grey500-i icon-ChDown" ></i> </div>
                                    </v-btn>
                                </template>
                                <v-list class="control-combobox" max-height="240px">
                                    <span v-for="item in items1" :key="item.code">
                                        <v-list-item class="prop-edit-value px-3 fs-s fw-b grey700 white"  
                                            @click="updateValue(item)"
                                            style="min-height: 30px;">
                                            {{item.name}}
                                        </v-list-item>
                                    </span>
                                </v-list>
                            </v-menu>
                        </div>
                    </span>
                </v-card>
            </v-flex>
            <v-flex xs5 class="ml-2">
                <v-card flat tile class="c-labeled-double-combo">
                    <span class="font-regular prop-title fs-s grey700 nonselect">{{label2}}</span><br>
                    <span class="text--primary prop-value">
                        <span v-if="!editMode">{{selected2}}</span>
                        <div v-if="editMode">
                            <v-menu offset-y style="width:100%">
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" text height="24px" style="width:100%;text-transform:none;min-width:unset;" class="text-left justify-space-between align-center px-2 normal-text fs-s fw-b br-2 grey300-border grey700" outlined>
                                        <div class="prop-edit-value">{{selected2}}</div>
                                        <div style="margin-bottom: -3px;"> <i class="grey500-i icon-ChDown" ></i> </div>
                                    </v-btn>
                                </template>
                                <div>
                                <v-list class="control-combobox" max-height="240px">
                                    <span v-for="item in items2" :key="item.code">
                                        <v-list-item class="prop-edit-value px-3 fs-s fw-b grey700 white"  
                                            @click="updateValue(item)"
                                            style="min-height: 30px;">
                                            {{item.name}}
                                        </v-list-item>
                                    </span>
                                </v-list>
                                </div>
                            </v-menu>
                        </div>
                    </span>
                </v-card>
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
export default {
    props: ['editMode','label1','label2','selected1','selected2', 'items1', 'items2'],
    data(){
        return{

        }
    }
}
</script>
<style lang="stylus" scoped>
.c-labeled-double-combo
    line-height: 1.1

</style>