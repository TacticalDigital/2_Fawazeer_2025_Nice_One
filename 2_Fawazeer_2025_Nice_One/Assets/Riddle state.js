// RiddleState.js
// Version: 1.7

//@input SceneObject riddleGroup
//@input int correctAnswerIndex = 0 {"widget":"combobox", "values":[{"label":"Button 1", "value":0}, {"label":"Button 2", "value":1}], "label":"Correct Button"}
//@input SceneObject[] riddleFadeObjects
//@input Asset.Material[] riddleFadeMaterials
//@input Component.Text[] riddleTextObjects
//@input vec4 riddleTextFadeColor = {1,1,1,0} {"widget":"color"}
//@input float riddleFadeTime = 1.0
//@input Component.ScriptComponent mainManager

//@ui {"widget":"group_start", "label":"Button 1 Settings"}
//@input Component.Image button1Image
//@input Asset.Texture button1Default
//@input Asset.Texture button1Correct {"label":"Button 1 Correct Texture"}
//@input Asset.Texture button1Incorrect {"label":"Button 1 Incorrect Texture"}
//@input Component.ScriptComponent button1Script
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Button 2 Settings"}
//@input Component.Image button2Image
//@input Asset.Texture button2Default
//@input Asset.Texture button2Correct {"label":"Button 2 Correct Texture"}
//@input Asset.Texture button2Incorrect {"label":"Button 2 Incorrect Texture"}
//@input Component.ScriptComponent button2Script
//@ui {"widget":"group_end"}

// Store if riddle was already answered
script.riddleAnswered = false;

// Убедимся, что функции обработчики нажатий определены до начала использования
script.button_1 = function() {
    print("[RiddleState] Button 1 pressed");
    
    // Check if this is the correct answer (index 0)
    var isCorrect = (0 === script.correctAnswerIndex);
    
    // Set button appearance based on correctness
    if (script.button1Image) {
        if (isCorrect && script.button1Correct) {
            script.button1Image.mainPass.baseTex = script.button1Correct;
        } else if (!isCorrect && script.button1Incorrect) {
            script.button1Image.mainPass.baseTex = script.button1Incorrect;
        }
    }

    // Enable button script if assigned
    if (script.button1Script) {
        script.button1Script.getSceneObject().enabled = true;
        script.button1Script.api.startTween()
    }

    if (isCorrect) {
        print("[RiddleState] Correct answer!");
        script.riddleAnswered = true;  // Now lock the interaction
        fadeOutRiddle();
    } else {
        print("[RiddleState] Wrong answer!");
    }
};

script.button_2 = function() {
    print("[RiddleState] Button 2 pressed");
    
    // Check if this is the correct answer (index 1)
    var isCorrect = (1 === script.correctAnswerIndex);
    
    // Set button appearance based on correctness
    if (script.button2Image) {
        if (isCorrect && script.button2Correct) {
            script.button2Image.mainPass.baseTex = script.button2Correct;
        } else if (!isCorrect && script.button2Incorrect) {
            script.button2Image.mainPass.baseTex = script.button2Incorrect;
        }
    }

    // Enable button script if assigned
    if (script.button2Script) {
        script.button2Script.getSceneObject().enabled = true;
        script.button2Script.api.startTween()
    }

    if (isCorrect) {
        print("[RiddleState] Correct answer!");
        script.riddleAnswered = true;  // Now lock the interaction
        fadeOutRiddle();
    } else {
        print("[RiddleState] Wrong answer!");
    }
};

script.api.activateRiddleState = function() {
    print("[RiddleState] Activating Riddle state.");

    if (!script.riddleGroup) {
        print("[RiddleState] ERROR: riddleGroup is not assigned!");
        return;
    }

    // Reset riddle state
    script.riddleAnswered = false;
    
    script.riddleGroup.enabled = true;
    setRiddleButtonsDefault();
    fadeInTextObjects(script.riddleTextObjects, new vec4(1,1,1,1), script.riddleFadeTime);
};

function fadeOutRiddle() {
    fadeOutTextObjects(script.riddleTextObjects, script.riddleTextFadeColor, script.riddleFadeTime, function() {
        script.riddleGroup.enabled = false;
        print("[RiddleState] Riddle faded out.");
        
        // Notify main manager if available
        if (script.mainManager && script.mainManager.api && script.mainManager.api.riddleCompleted) {
            script.mainManager.api.riddleCompleted();
        }
    });

    fadeOutObjects(script.riddleFadeObjects, script.riddleFadeMaterials, "opacity", script.riddleFadeTime);
}

// Set default button textures
function setRiddleButtonsDefault() {
    if (script.button1Image && script.button1Default) {
        script.button1Image.mainPass.baseTex = script.button1Default;
    }
    if (script.button2Image && script.button2Default) {
        script.button2Image.mainPass.baseTex = script.button2Default;
    }
}

// Fade utilities
function fadeInTextObjects(textComponents, targetColor, fadeTime) {
    if (!textComponents) return;

    for (let i = 0; i < textComponents.length; i++) {
        if (textComponents[i]) {
            var c = textComponents[i].textFill.color;
            textComponents[i].textFill.color = new vec4(c.r, c.g, c.b, 0);
        }
    }

    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");

    updateEvent.bind(function () {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1);
        let alpha = lerp(0.0, targetColor.a, progress);

        for (let i = 0; i < textComponents.length; i++) {
            if (textComponents[i]) {
                textComponents[i].textFill.color = new vec4(
                    targetColor.r,
                    targetColor.g,
                    targetColor.b,
                    alpha
                );
            }
        }

        if (progress >= 1) {
            updateEvent.enabled = false;
        }
    });
}

function fadeOutTextObjects(textObjects, fadeColor, fadeTime, callback) {
    if (!textObjects) {
        if (callback) callback();
        return;
    }

    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");

    updateEvent.bind(function () {
        let elapsedTime = getTime() - startTime;
        let progress = Math.min(elapsedTime / fadeTime, 1);
        let alpha = lerp(1, 0, progress);

        for (let i = 0; i < textObjects.length; i++) {
            if (textObjects[i]) {
                textObjects[i].textFill.color = new vec4(
                    fadeColor.r,
                    fadeColor.g,
                    fadeColor.b,
                    alpha
                );
            }
        }

        if (progress >= 1) {
            for (let i = 0; i < textObjects.length; i++) {
                if (textObjects[i]) {
                    textObjects[i].enabled = false;
                }
            }
            if (callback) callback();
            updateEvent.enabled = false;
        }
    });
}

function fadeOutObjects(objects, materials, alphaParameter, fadeTime, callback) {
    if (!objects || !materials) {
        if (callback) callback();
        return;
    }
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");

    updateEvent.bind(function () {
        let elapsedTime = getTime() - startTime;
        let progress = Math.min(elapsedTime / fadeTime, 1);
        let alpha = lerp(1, 0, progress);

        for (let i = 0; i < materials.length; i++) {
            if (materials[i]) {
                materials[i].mainPass.baseColor = new vec4(1,1,1, alpha);
            }
        }

        if (progress >= 1) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i]) {
                    objects[i].enabled = false;
                }
            }
            if (callback) callback();
            updateEvent.enabled = false;
        }
    });
}

function lerp(a, b, x) {
    return a + (b - a) * x;
}