import Vue from 'vue';

import glbLoading             from '@/components/glbLoading'
import group                  from '@/components/group'
import labeledField           from '@/components/labeledField'
import labeledFieldLogin      from '@/components/labeledFieldLogin'
import labeledCombo           from '@/components/labeledCombobox'
import labeledInputCombo      from '@/components/labeledInputCombo'
import labeledComboFilter     from '@/components/labeledComboFilter'
import labeledComboFilterTmpl from '@/components/labeledComboFilterTmpl'
import labeledDoubleCombobox  from '@/components/labeledDoubleCombobox'
import labeledTextArea        from '@/components/labeledTextArea'
import labeledCheckbox        from '@/components/labeledCheckbox'
import tableCheckbox          from '@/components/tableCheckbox'
import labeledBtn             from '@/components/labeledBtn'
import toolbarBtn             from '@/components/toolbarBtn'
import topNotification        from '@/components/topNotification'
import uploadList             from '@/components/uploadList'
import vmStateCombobox        from '@/components/vmStateCombobox'
import labeledSlot            from '@/components/labeledSlot'
import advEditorIncrement     from '@/components/advEditorIncrement'
import labeledCheckCombo      from '@/components/labeledCheckCombo'
import labeledDate            from '@/components/labeledDate'
import labeledFieldHdd        from '@/components/labeledFieldHdd'
import titleComponent         from '@/components/title'
import locationsViewContent    from '@/modules/locations/locations-view-content'

export default function () {
    Vue.component('c-glb-loading'               , glbLoading)
    Vue.component('c-group'                     , group)
    Vue.component('c-labeled-field'             , labeledField)
    Vue.component('c-labeled-field-login'       , labeledFieldLogin)
    Vue.component('c-labeled-combo'             , labeledCombo)
    Vue.component('c-labeled-input-combo'       , labeledInputCombo)
    Vue.component('c-labeled-combo-filter'      , labeledComboFilter)
    Vue.component('c-labeled-combo-filter-tmpl' , labeledComboFilterTmpl)
    Vue.component('c-labeled-double-combo'      , labeledDoubleCombobox)
    Vue.component('c-labeled-btn'               , labeledBtn)
    Vue.component('c-toolbar-btn'               , toolbarBtn)
    Vue.component('c-labeled-textArea'          , labeledTextArea)
    Vue.component('c-labeled-checkbox'          , labeledCheckbox)
    Vue.component('c-table-checkbox'            , tableCheckbox)
    Vue.component('c-top-notification'          , topNotification )
    Vue.component('c-upload-list'               , uploadList )
    Vue.component('c-vm-state-combo'            , vmStateCombobox )
    Vue.component('c-labeled-slot'              , labeledSlot )
    Vue.component('c-adv-editor-increment'      , advEditorIncrement )
    Vue.component('c-labeled-check-combo'       , labeledCheckCombo )
    Vue.component('c-labeled-date'              , labeledDate )
    Vue.component('c-labeled-field-hdd'         , labeledFieldHdd )
    Vue.component('c-title'                     , titleComponent);
    Vue.component('c-locations-view-content'    , locationsViewContent);
}
  