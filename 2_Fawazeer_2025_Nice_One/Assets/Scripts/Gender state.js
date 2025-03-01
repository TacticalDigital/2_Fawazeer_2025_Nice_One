// GenderState.js
// Version: 1.3

//@input SceneObject[] genderButtons
//@input SceneObject hintTapGender
//@input SceneObject[] tapObjects // Additional tap objects
//@input Component.ScriptComponent mainManager
//@input float fadeDuration = 0.8
// @input SceneObject[] mlObjs
//@input SceneObject makeupObj

function fadeInUI() {
    for (let i = 0; i < script.genderButtons.length; i++) {
        script.genderButtons[i].enabled = true;
        fadeObject(script.genderButtons[i], true, script.fadeDuration);
    }
    script.hintTapGender.enabled = true;
    fadeObject(script.hintTapGender, true, script.fadeDuration);

    for (let i = 0; i < script.tapObjects.length; i++) {
        script.tapObjects[i].enabled = true;
        fadeObject(script.tapObjects[i], true, script.fadeDuration);
    }
}

function fadeOutUI(callback) {
    let completed = 0;
    let total = script.genderButtons.length + script.tapObjects.length + 1;

    for (let i = 0; i < script.genderButtons.length; i++) {
        fadeObject(script.genderButtons[i], false, script.fadeDuration, function () {
            script.genderButtons[i].enabled = false;
            completed++;
            if (completed === total && callback) callback();
        });
    }

    for (let i = 0; i < script.tapObjects.length; i++) {
        fadeObject(script.tapObjects[i], false, script.fadeDuration, function () {
            script.tapObjects[i].enabled = false;
            completed++;
            if (completed === total && callback) callback();
        });
    }

    fadeObject(script.hintTapGender, false, script.fadeDuration, function () {
        script.hintTapGender.enabled = false;
        completed++;
        if (completed === total && callback) callback();
    });
}

function fadeObject(object, show, duration, onComplete) {
    if (!object) return;
    let startTime = getTime();
    let startAlpha = show ? 0 : 1;
    let endAlpha = show ? 1 : 0;
    object.enabled = true;
    let updateEvent = script.createEvent("UpdateEvent");
    updateEvent.bind(function () {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / duration, 1);
        let alpha = startAlpha + (endAlpha - startAlpha) * progress;
        let comp = object.getComponent("Component.Image") || object.getComponent("Component.Text");
        if (comp) {
            comp.mainPass.baseColor = new vec4(1, 1, 1, alpha);
        }
        if (progress >= 1) {
            updateEvent.enabled = false;
            if (!show) object.enabled = false;
            if (onComplete) onComplete();
        }
    });
}

function setInitialAlpha() {
    for (let i = 0; i < script.genderButtons.length; i++) {
        script.genderButtons[i].enabled = true;
        setAlpha(script.genderButtons[i], 0);
    }
    script.hintTapGender.enabled = true;
    setAlpha(script.hintTapGender, 0);

    for (let i = 0; i < script.tapObjects.length; i++) {
        script.tapObjects[i].enabled = true;
        setAlpha(script.tapObjects[i], 0);
    }
}

function setAlpha(object, alpha) {
    let comp = object.getComponent("Component.Image") || object.getComponent("Component.Text");
    if (comp) {
        comp.mainPass.baseColor = new vec4(1, 1, 1, alpha);
    }
}

script.api.activateGenderState = function () {
    setInitialAlpha();
    fadeInUI();
};

script.selectMaleGender = function () {
    fadeOutUI(function () {
        script.makeupObj.enabled = false
        script.mlObjs[0].enabled = true
        script.mlObjs[1].enabled = false
        script.mainManager.api.setSelectedGender("male");
        script.mainManager.api.transitionToDress();
    });
};

script.selectFemaleGender = function () {
    fadeOutUI(function () {
        script.makeupObj.enabled = true
        script.mlObjs[0].enabled = false
        script.mlObjs[1].enabled = true
        script.mainManager.api.setSelectedGender("female");
        script.mainManager.api.transitionToDress();
    });
};