// MainManager.js
// Version: 1.1
// Controls state transitions between four state objects.
//@ui {"widget": "group_start", "label": "State Settings"}
//@input int defaultState = 0 {"widget": "combobox", "values": [
//    {"label": "Logo", "value": 0},
//    {"label": "Gender Selection", "value": 1},
//    {"label": "Dress & Photo", "value": 2},
//    {"label": "Riddle", "value": 3}
//]}
//@input float delayLogoToGender = 1.0
//@input float delayGenderToDress = 1.0
//@input float delayDressToRiddle = 2.0
//@ui {"widget": "group_end"}

//@ui {"widget": "group_start", "label": "State Objects"}
//@input SceneObject logoStateObject
//@input SceneObject genderStateObject
//@input SceneObject dressStateObject
//@input SceneObject riddleStateObject
//@ui {"widget": "group_end"}

script.selectedGender = null;

script.api.getSelectedGender = function() {
    return script.selectedGender || null;
};

script.api.setSelectedGender = function(gender) {
    script.selectedGender = gender;
    print("[MainManager] Gender set to: " + gender);
};

function initManager() {
    script.logoStateObject.enabled = false;
    script.genderStateObject.enabled = false;
    script.dressStateObject.enabled = false;
    script.riddleStateObject.enabled = false;

    if (script.defaultState == 0) {
        script.logoStateObject.enabled = true;
    } else if (script.defaultState == 1) {
        script.genderStateObject.enabled = true;
        let comp = script.genderStateObject.getComponent("Component.ScriptComponent");
        if (comp && comp.api.activateGenderState) {
            comp.api.activateGenderState();
        }
    } else if (script.defaultState == 2) {
        script.dressStateObject.enabled = true;
        let comp = script.dressStateObject.getComponent("Component.ScriptComponent");
        if (comp && comp.api.activateDressState) {
            comp.api.activateDressState();
        }
    } else if (script.defaultState == 3) {
        script.riddleStateObject.enabled = true;
        let comp = script.riddleStateObject.getComponent("Component.ScriptComponent");
        if (comp && comp.api.activateRiddleState) {
            comp.api.activateRiddleState();
        }
    }
}
script.createEvent("OnStartEvent").bind(initManager);

script.api.transitionToGender = function() {
    script.logoStateObject.enabled = false;
    var delayEvent = script.createEvent("DelayedCallbackEvent");
    delayEvent.bind(function() {
         script.genderStateObject.enabled = true;
         let comp = script.genderStateObject.getComponent("Component.ScriptComponent");
         if (comp && comp.api.activateGenderState) {
             comp.api.activateGenderState();
         }
    });
    delayEvent.reset(script.delayLogoToGender);
};

script.api.transitionToDress = function() {
    script.genderStateObject.enabled = false;
    var delayEvent = script.createEvent("DelayedCallbackEvent");
    delayEvent.bind(function() {
         script.dressStateObject.enabled = true;
         let comp = script.dressStateObject.getComponent("Component.ScriptComponent");
         if (comp && comp.api.activateDressState) {
             comp.api.activateDressState();
         }
    });
    delayEvent.reset(script.delayGenderToDress);
};

script.api.transitionToRiddle = function() {
    print("[MainManager] Transitioning to Riddle...");
    script.dressStateObject.enabled = false;
    
    var delayEvent = script.createEvent("DelayedCallbackEvent");
    delayEvent.bind(function() {
        print("[MainManager] Enabling Riddle state...");

        script.riddleStateObject.enabled = true;
        
        let comp = script.riddleStateObject.getComponent("Component.ScriptComponent");
        if (comp && comp.api.activateRiddleState) {
            print("[MainManager] Calling activateRiddleState()...");
            comp.api.activateRiddleState();
        } else {
            print("[ERROR] Riddle state script is missing activateRiddleState()!");
        }
    });
    delayEvent.reset(script.delayDressToRiddle);
};