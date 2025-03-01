// LogoState.js
// Version: 1.0
//@input SceneObject logo
//@input Asset.Material logoMaterial
//@input string logoAlphaParameter = "opacity"
//@input float logoDisplayTime = 3.0
//@input float logoFadeTime = 1.0
//@input Component.ScriptComponent mainManager

function showLogo() {
    script.logo.enabled = true;
    // Ensure full opacity at start
    script.logoMaterial.mainPass[script.logoAlphaParameter] = 1;
    var displayEvent = script.createEvent("DelayedCallbackEvent");
    displayEvent.bind(fadeOutLogo);
    displayEvent.reset(script.logoDisplayTime);
}

function fadeOutLogo() {
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / script.logoFadeTime, 1);
        let alpha = 1 - progress;
        script.logoMaterial.mainPass[script.logoAlphaParameter] = alpha;
        if (progress >= 1) {
            script.logo.enabled = false;
            updateEvent.enabled = false;
            script.mainManager.api.transitionToGender();
        }
    });
}

showLogo();