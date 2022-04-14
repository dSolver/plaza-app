import { registerPatch } from './index';

const domain = 'jacorb90.me/Prestige-Tree'

const code = `
console.log("Patching Prestige Tree");

import('//cdn.jsdelivr.net/npm/sweetalert2@11.4.8/dist/sweetalert2.all.min.js').then(module => {

    
    console.log("Swal loaded")
    
    const Swal = Sweetalert2;

    window.importSave = async (imported=undefined, forced=false) => {
        if (imported === undefined){
            let { value } = await Swal.fire({
                title: 'Paste your save here',
                input: 'text',
                inputLabel: 'Your save',
                inputValue: '',
                showCancelButton: true
              })

            imported = value
        }

           
        try {
            let tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)))
            if (tempPlr.versionType != modInfo.id && !forced && !confirm("This save appears to be for a different mod! Are you sure you want to import?"))
                return
            player = tempPlr;
            player.versionType = modInfo.id
            fixSave()
            save()
            loadSave(allSaves.set)
        } catch (e) {
            return;
        }
    }

}).catch(err => {
    console.error('failed to load Swal', err)
})

`

export const prestigeTree = () => {
    registerPatch(domain, code)
}