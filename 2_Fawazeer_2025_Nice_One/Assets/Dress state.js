// DressState.js
// Version: 1.7
//@input float assetsDelay = 1.0            // Delay before enabling dress assets
//@input float delayToRiddle = 2.0          // Delay before transitioning to Riddle state
//@input SceneObject[] universalObjects
//@input SceneObject[] maleObjects          // Additional male-specific objects
//@input SceneObject[] femaleObjects        // Additional female-specific objects
//@input SceneObject maleGarmentsParent
//@input SceneObject femaleGarmentsParent
//@input SceneObject[] disableObjects       // Objects to disable when this state is activated
//@input Component.ScriptComponent dressScript
//@input Component.ScriptComponent mainManager

// Activate Dress state: external dressScript starts immediately, then assets are enabled.
script.api.activateDressState = function() {
    print("[DressState] Activating Dress & Photo state.");
    
    // Activate external dressScript immediately.
    if (script.dressScript) {
        script.dressScript.getSceneObject().enabled = true;
        print("[DressState] dressScript enabled immediately.");
    }
    
    // Wait for assetsDelay, then enable dress assets.
    var assetsDelayEvent = script.createEvent("DelayedCallbackEvent");
    assetsDelayEvent.bind(enableDressAssets);
    assetsDelayEvent.reset(script.assetsDelay);
};

function enableDressAssets() {
    // Disable objects specified in disableObjects.
    if (script.disableObjects && script.disableObjects.length > 0) {
        toggleObjects(script.disableObjects, false);
        print("[DressState] Disabled objects from 'disableObjects'.");
    }
    
    // Retrieve selected gender from mainManager.
    if (!script.mainManager || !script.mainManager.api.getSelectedGender) {
        print("[DressState] mainManager not assigned or getSelectedGender() missing.");
        return;
    }
    let gender = script.mainManager.api.getSelectedGender();
    if (!gender) {
        print("[DressState] Selected gender is not set! Aborting asset activation.");
        return;
    }
    let isMale = (gender === "male");
    
    if (script.maleGarmentsParent) {
        script.maleGarmentsParent.enabled = isMale;
    }
    if (script.femaleGarmentsParent) {
        script.femaleGarmentsParent.enabled = !isMale;
    }
    
    // Enable gender-specific objects
    toggleObjects(script.maleObjects, isMale);
    toggleObjects(script.femaleObjects, !isMale);
    
    // Enable universal objects
    toggleObjects(script.universalObjects, true);
    
    // After delayToRiddle, transition to Riddle state.
    var riddleDelayEvent = script.createEvent("DelayedCallbackEvent");
    riddleDelayEvent.bind(function() {
        script.mainManager.api.transitionToRiddle();
    });
    riddleDelayEvent.reset(script.delayToRiddle);
}

function toggleObjects(objects, state) {
    if (!objects) return;
    for (let i = 0; i < objects.length; i++) {
        if (objects[i]) {
            objects[i].enabled = state;
        }
    }
}