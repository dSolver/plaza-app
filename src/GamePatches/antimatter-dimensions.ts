import { patches } from './index';
const code = `
console.log("Patching Antimatter Dimensions");

import('//cdn.jsdelivr.net/npm/sweetalert2@11.4.8/dist/sweetalert2.all.min.js').then(module => {

    var old_element = document.getElementById("importbtn");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    
    console.log("Swal loaded")
    
    const Swal = Sweetalert2

    document.getElementById("importbtn").onclick = async function () {
        let { value: save_data } = await Swal.fire({
            title: 'Input your save. (your current save file will be overwritten!',
            input: 'text',
            inputLabel: 'Your save',
            inputValue: '',
            showCancelButton: true
          })
          
    
        
        if (save_data.constructor !== String) save_data = "";
        if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "80b7fdc794f5dfc944da6a445a3f21a2d0f7c974d044f2ea25713037e96af9e3") {
            document.getElementById("body").style.animation = "barrelRoll 5s 1";
            giveAchievement("Do a barrel roll!")
            setTimeout(function(){ document.getElementById("body").style.animation = ""; }, 5000)
        } else if (sha512_256(save_data.replace(/\s/g, '').toUpperCase()) === "857876556a230da15fe1bb6f410ca8dbc9274de47c1a847c2281a7103dd2c274") giveAchievement("So do I");
        else if (sha512_256(save_data) === "de24687ee7ba1acd8f5dc8f71d41a3d4b7f14432fff53a4d4166e7eea48a88c0") {
            player.options.theme = "S1";
            player.options.secretThemeKey = save_data;
            setTheme(player.options.theme);
        } else if (sha512_256(save_data) === "76269d18c05c9ebec8a990a096cee046dea042a0421f8ab81d17f34dd1cdbdbf") {
            player.options.theme = "S2";
            player.options.secretThemeKey = save_data;
            setTheme(player.options.theme);
        } else if (sha512_256(save_data) === "d764e9a1d1e18081be19f3483b537ae1159ab40d10e096df1d9e857d68d6ba7a") {
            player.options.theme = "S3";
            player.options.secretThemeKey = save_data;
            setTheme(player.options.theme);
        } else if (sha512_256(save_data) === "ae0199482ecfa538a03eb37c67866e67a11f1832516c26c7939e971e514d40c5") {
            player.options.theme = "S4";
            player.options.secretThemeKey = save_data;
            setTheme(player.options.theme);
        }  else if (sha512_256(save_data) === "7a668b64cdfe1bcdf7a38d3858429ee21290268de66b9784afba27dc5225ce28") {
            player.options.theme = "S5";
            player.options.secretThemeKey = save_data;
            setTheme(player.options.theme);
        } else {
            save_data = JSON.parse(atob(save_data), function(k, v) { return (v === Infinity) ? "Infinity" : v; });
            if(verify_save(save_data)) forceHardReset = true
            if(verify_save(save_data)) document.getElementById("reset").click();
            forceHardReset = false
            if (!save_data || !verify_save(save_data)) {
                alert('could not load the save..');
                load_custom_game();
                return;
            }
            saved = 0;
            totalMult = 1
            currentMult = 1
            infinitiedMult = 1
            achievementMult = 1
            challengeMult = 1
            unspentBonus = 1
            infDimPow = 1
            postc8Mult = new Decimal(0)
            mult18 = new Decimal(1)
            ec10bonus = new Decimal(1)
            player = save_data;
            save_game();
            load_game();
            updateChallenges()
            transformSaveToDecimal()
        }
    };

}).catch(err => {
    console.error('failed to load Swal', err)
})

`
const domain = 'ivark.github.io'

export const AD = ()=> {
    patches[domain] = code
}