import Vue from 'vue';
import dialogBasic from '@/dialogs/windows/dialogBasic'
import dialogController from '@/dialogs/windows/windowController'

import {register as registerCloneVmDialog}             from '@/dialogs/cloneVmDialog'
import {register as registerMigrateVmDialog}           from '@/dialogs/migrateVmDialog'
import {register as registerImportIsoDialog}           from '@/dialogs/importIsoDialog'
import {register as registerConfirmDialog}             from '@/dialogs/confirmDialog'
import {register as registerNotifyMessage}             from '@/dialogs/notifyMessage'
import {register as registerSaveAsTemplateDialog}      from '@/dialogs/saveAsTemplateDialog'
import {register as registerConvertToTemplateDialog}   from '@/dialogs/convertToTemplateDialog'
import {register as registerEditPermissionDialog}      from '@/dialogs/editPermissionDialog'
import {register as registerCreateSnapshotDialog}      from '@/dialogs/createSnapshotDialog'
import {register as registerSnapshotManagerDialog}     from '@/dialogs/snapshotManagerDialog'
import {register as registerchngPassword}              from '@/dialogs/chngPassword'
import {register as registerLocationDialog}            from '@/dialogs/locationDialog'
import {register as registerDebugDialog}               from '@/dialogs/debugDialog'
import {register as registerPlatformGuideDialog}       from '@/dialogs/platformGuideDialog'
import {register as registerAdmImportIsoDialog}        from '@/dialogs/admImportIsoDialog'
import {register as registerAdmImportVmDialog}         from '@/dialogs/admImportVmDialog'
import {register as registerUploadDialog}              from '@/dialogs/uploadDialog'
import {register as registerChngProjectAndGroupDialog} from '@/dialogs/chngProjectAndGroupDialog'
import {register as registerLocationDetailsDialog}     from '@/dialogs/locationDetailsDialog'

export default function () 
{
    // регистрируем всплывающие окна и сообщения
    Vue.component('d-dialog-basic', dialogBasic);
    dialogController();
    registerCloneVmDialog();
    registerMigrateVmDialog();
    registerConfirmDialog();
    registerNotifyMessage();
    registerSaveAsTemplateDialog();
    registerImportIsoDialog();
    registerEditPermissionDialog();
    registerCreateSnapshotDialog();
    registerSnapshotManagerDialog();
    registerchngPassword();
    registerDebugDialog();
    registerLocationDialog();
    registerPlatformGuideDialog();
    registerConvertToTemplateDialog();
    registerAdmImportIsoDialog();
    registerAdmImportVmDialog();
    registerUploadDialog();
    registerChngProjectAndGroupDialog();
    registerLocationDetailsDialog();
}