// RiddleState.js
// Version: 1.7

//@input SceneObject riddleGroup
//@input int correctAnswerIndex = 0 {"widget":"combobox", "values":[{"label":"Button 1", "value":0}, {"label":"Button 2", "value":1}], "label":"Correct Button"}
//@input SceneObject[] riddleFadeObjects
//@input Asset.Material[] riddleFadeMaterials
//@input Component.Text[] riddleTextObjects
//@input vec4 riddleTextFadeColor = {1,1,1,0} {"widget":"color"}
//@input float riddleFadeTime = 1.5 {"label": "Fade Out Time"}
//@input Component.ScriptComponent mainManager
//@input float imageFadeTime = 0.5 {"label": "Image Fade Time"}
//@input float imageOffsetY = 100 {"label": "Image Rise Distance"}
//@input float answerDelay = 0.2 {"label": "Answer Button Delay"}

//@ui {"widget":"group_start", "label":"Button 1 Settings"}
//@input Component.Image button1Image {"label":"Default Button 1"}
//@input Component.Image button1CorrectImage {"label":"Correct Button 1"}
//@input Component.Image button1IncorrectImage {"label":"Incorrect Button 1"}
//@input Component.Text button1Text {"label":"Button 1 Text"}
//@input Component.ScriptComponent button1Script
//@input Component.AudioComponent[] sfx
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Button 2 Settings"}
//@input Component.Image button2Image {"label":"Default Button 2"}
//@input Component.Image button2CorrectImage {"label":"Correct Button 2"}
//@input Component.Image button2IncorrectImage {"label":"Incorrect Button 2"}
//@input Component.Text button2Text {"label":"Button 2 Text"}
//@input Component.ScriptComponent button2Script
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Question Image Settings"}
//@input Component.Image questionImage {"label":"Default Question"}
//@input Component.Image questionCorrectImage {"label":"Correct Question"}
//@input Component.Image questionIncorrectImage {"label":"Incorrect Question"}
//@input Component.Text questionText {"label":"Question Text"}
//@ui {"widget":"group_end"}

// Store if riddle was already answered
script.riddleAnswered = false;

// Убедимся, что функции обработчики нажатий определены до начала использования
script.button_1 = function() {
    print("[RiddleState] Button 1 pressed");
    
    if (!script.sfx || script.sfx.length < 2) {
        print("[RiddleState] ERROR: Sound effects not properly assigned!");
        return;
    }
    
    var isCorrect = (0 === script.correctAnswerIndex);
    
    // Show appropriate result images without hiding defaults
    if (isCorrect) {
        if (script.questionCorrectImage) {
            script.questionCorrectImage.enabled = true;
            animateImageIn(script.questionCorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
        if (script.button1CorrectImage) {
            script.button1CorrectImage.enabled = true;
            animateImageIn(script.button1CorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
    } else {
        if (script.questionIncorrectImage) {
            script.questionIncorrectImage.enabled = true;
            animateImageIn(script.questionIncorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
        if (script.button1IncorrectImage) {
            script.button1IncorrectImage.enabled = true;
            animateImageIn(script.button1IncorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
    }

    // Enable button script if assigned
    if (script.button1Script) {
        script.button1Script.getSceneObject().enabled = true;
        script.button1Script.api.startTween()
    }

    if (isCorrect) {
        script.sfx[0].play(1)
        print("[RiddleState] Correct answer!");
        script.riddleAnswered = true;  // Now lock the interaction
        fadeOutRiddle();
    } else {
        script.sfx[1].play(1)
        print("[RiddleState] Wrong answer!");
    }
};

script.button_2 = function() {
    print("[RiddleState] Button 2 pressed");
    
    if (!script.sfx || script.sfx.length < 2) {
        print("[RiddleState] ERROR: Sound effects not properly assigned!");
        return;
    }
    
    var isCorrect = (1 === script.correctAnswerIndex);
    
    // Show appropriate result images without hiding defaults
    if (isCorrect) {
        if (script.questionCorrectImage) {
            script.questionCorrectImage.enabled = true;
            animateImageIn(script.questionCorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
        if (script.button2CorrectImage) {
            script.button2CorrectImage.enabled = true;
            animateImageIn(script.button2CorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
    } else {
        if (script.questionIncorrectImage) {
            script.questionIncorrectImage.enabled = true;
            animateImageIn(script.questionIncorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
        if (script.button2IncorrectImage) {
            script.button2IncorrectImage.enabled = true;
            animateImageIn(script.button2IncorrectImage, script.imageOffsetY, 0, script.imageFadeTime);
        }
    }

    // Enable button script if assigned
    if (script.button2Script) {
        script.button2Script.getSceneObject().enabled = true;
        script.button2Script.api.startTween()
    }

    if (isCorrect) {
        script.sfx[0].play(1);
        print("[RiddleState] Correct answer!");
        script.riddleAnswered = true;  // Now lock the interaction
        fadeOutRiddle();
    } else {
        script.sfx[1].play(1);
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
    
    // Animate question image and text immediately
    if (script.questionImage) {
        animateImageIn(script.questionImage, script.imageOffsetY, 0, script.imageFadeTime);
    }
    
    // Fade in question text immediately
    let questionTextArray = [];
    if (script.questionText) questionTextArray.push(script.questionText);
    fadeInTextObjects(questionTextArray, new vec4(1,1,1,1), script.imageFadeTime * 1.5);
    
    // Delay button images and texts
    var delayEvent = script.createEvent("DelayedCallbackEvent");
    delayEvent.bind(function() {
        // Animate button images
        if (script.button1Image) {
            animateImageIn(script.button1Image, script.imageOffsetY, 0, script.imageFadeTime);
        }
        if (script.button2Image) {
            animateImageIn(script.button2Image, script.imageOffsetY, 0, script.imageFadeTime);
        }
        
        // Fade in button texts with the same timing as button images
        let buttonTextArray = [];
        if (script.button1Text) buttonTextArray.push(script.button1Text);
        if (script.button2Text) buttonTextArray.push(script.button2Text);
        fadeInTextObjects(buttonTextArray, new vec4(1,1,1,1), script.imageFadeTime * 1.5);
    });
    delayEvent.reset(script.answerDelay);
};

function fadeOutRiddle() {
    // Wait 2 seconds before starting the fade out
    var delayEvent = script.createEvent("DelayedCallbackEvent");
    delayEvent.bind(function() {
        // Start all fade outs after the 2 second delay
        fadeOutAll();
    });
    delayEvent.reset(2.0);
}

// Modify fadeOutAll function to fade everything at once
function fadeOutAll() {
    // Get all images and text that should fade out
    let imagesToFade = [];
    let textsToFade = [];
    
    // Add all visible images to fade
    if (script.questionImage && script.questionImage.enabled) imagesToFade.push(script.questionImage);
    if (script.questionCorrectImage && script.questionCorrectImage.enabled) imagesToFade.push(script.questionCorrectImage);
    if (script.questionIncorrectImage && script.questionIncorrectImage.enabled) imagesToFade.push(script.questionIncorrectImage);
    
    if (script.button1Image && script.button1Image.enabled) imagesToFade.push(script.button1Image);
    if (script.button1CorrectImage && script.button1CorrectImage.enabled) imagesToFade.push(script.button1CorrectImage);
    if (script.button1IncorrectImage && script.button1IncorrectImage.enabled) imagesToFade.push(script.button1IncorrectImage);
    
    if (script.button2Image && script.button2Image.enabled) imagesToFade.push(script.button2Image);
    if (script.button2CorrectImage && script.button2CorrectImage.enabled) imagesToFade.push(script.button2CorrectImage);
    if (script.button2IncorrectImage && script.button2IncorrectImage.enabled) imagesToFade.push(script.button2IncorrectImage);
    
    // Add all texts to fade
    if (script.questionText) textsToFade.push(script.questionText);
    if (script.button1Text) textsToFade.push(script.button1Text);
    if (script.button2Text) textsToFade.push(script.button2Text);
    
    // Fade out all images together
    fadeOutImagesGroup(imagesToFade, script.riddleFadeTime);
    
    // Fade out all text together
    fadeOutTextObjects(textsToFade, script.riddleTextFadeColor, script.riddleFadeTime, function() {
        script.riddleGroup.enabled = false;
        print("[RiddleState] Riddle faded out.");
        
        // Notify main manager if available
        if (script.mainManager && script.mainManager.api && script.mainManager.api.riddleCompleted) {
            script.mainManager.api.riddleCompleted();
        }
    });

    // Fade out additional objects
    fadeOutObjects(script.riddleFadeObjects, script.riddleFadeMaterials, "opacity", script.riddleFadeTime);
}

// Add new function to fade out a group of images
function fadeOutImagesGroup(images, fadeTime) {
    if (!images || images.length === 0) return;
    
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1.0);
        
        // Ease out function for smoother fade
        progress = 1 - Math.pow(1 - progress, 2);
        
        // Update all image opacities
        for (let i = 0; i < images.length; i++) {
            if (images[i]) {
                images[i].mainPass.baseColor = new vec4(1, 1, 1, 1 - progress);
            }
        }
        
        if (progress >= 1.0) {
            for (let i = 0; i < images.length; i++) {
                if (images[i]) {
                    images[i].enabled = false;
                }
            }
            updateEvent.enabled = false;
        }
    });
}

// New function to fade image and text together
function fadeImageWithText(image, text, fadeTime) {
    if (!image && !text) return;
    
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1.0);
        
        // Ease out function for smoother fade
        progress = 1 - Math.pow(1 - progress, 2);
        
        // Update image opacity if available
        if (image) {
            image.mainPass.baseColor = new vec4(1, 1, 1, 1 - progress);
        }
        
        // Update text opacity if available
        if (text) {
            let color = text.textFill.color;
            text.textFill.color = new vec4(color.r, color.g, color.b, 1 - progress);
        }
        
        if (progress >= 1.0) {
            if (image) image.enabled = false;
            if (text) text.enabled = false;
            updateEvent.enabled = false;
        }
    });
}

// Add new function for fading out images
function fadeImageOut(image, fadeTime) {
    if (!image) return;
    
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1.0);
        
        // Ease out function for smoother fade
        progress = 1 - Math.pow(1 - progress, 2);
        
        // Update opacity
        image.mainPass.baseColor = new vec4(1, 1, 1, 1 - progress);
        
        if (progress >= 1.0) {
            image.enabled = false;
            updateEvent.enabled = false;
        }
    });
}

// Set default button textures
function setRiddleButtonsDefault() {
    // Enable default images
    if (script.questionImage) {
        script.questionImage.enabled = true;
        script.questionImage.mainPass.baseColor = new vec4(1, 1, 1, 0);
    }
    if (script.button1Image) {
        script.button1Image.enabled = true;
        script.button1Image.mainPass.baseColor = new vec4(1, 1, 1, 0);
    }
    if (script.button2Image) {
        script.button2Image.enabled = true;
        script.button2Image.mainPass.baseColor = new vec4(1, 1, 1, 0);
    }
    
    // Reset text opacity
    if (script.questionText) {
        script.questionText.enabled = true;
        script.questionText.textFill.color = new vec4(
            script.questionText.textFill.color.r,
            script.questionText.textFill.color.g,
            script.questionText.textFill.color.b,
            0
        );
    }
    if (script.button1Text) {
        script.button1Text.enabled = true;
        script.button1Text.textFill.color = new vec4(
            script.button1Text.textFill.color.r,
            script.button1Text.textFill.color.g,
            script.button1Text.textFill.color.b,
            0
        );
    }
    if (script.button2Text) {
        script.button2Text.enabled = true;
        script.button2Text.textFill.color = new vec4(
            script.button2Text.textFill.color.r,
            script.button2Text.textFill.color.g,
            script.button2Text.textFill.color.b,
            0
        );
    }
    
    // Disable result images
    if (script.questionCorrectImage) script.questionCorrectImage.enabled = false;
    if (script.questionIncorrectImage) script.questionIncorrectImage.enabled = false;
    if (script.button1CorrectImage) script.button1CorrectImage.enabled = false;
    if (script.button1IncorrectImage) script.button1IncorrectImage.enabled = false;
    if (script.button2CorrectImage) script.button2CorrectImage.enabled = false;
    if (script.button2IncorrectImage) script.button2IncorrectImage.enabled = false;
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

// Add these new functions for image animations
function animateImageIn(image, startY, endY, fadeTime) {
    if (!image) return;
    
    // Store original position
    let sceneObject = image.getSceneObject();
    let originalPos = sceneObject.getTransform().getLocalPosition();
    print("[RiddleState] Original position: " + originalPos.y);
    
    // Set starting position (offset down by startY)
    let startingPos = new vec3(originalPos.x, originalPos.y - startY, originalPos.z);
    sceneObject.getTransform().setLocalPosition(startingPos);
    print("[RiddleState] Starting position with offset: " + startingPos.y);
    
    // Set starting opacity
    image.mainPass.baseColor = new vec4(1, 1, 1, 0);
    
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1.0);
        
        // Ease in-out function
        progress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Update position
        let currentY = originalPos.y - startY + (startY * progress);
        sceneObject.getTransform().setLocalPosition(new vec3(originalPos.x, currentY, originalPos.z));
        
        // Update opacity
        image.mainPass.baseColor = new vec4(1, 1, 1, progress);
        
        if (progress >= 1.0) {
            print("[RiddleState] Animation complete, final position: " + originalPos.y);
            updateEvent.enabled = false;
        }
    });
}

// Add new function for text animation
function animateTextIn(textComp, startY, endY, fadeTime) {
    if (!textComp) return;
    
    // Store original position
    let sceneObject = textComp.getSceneObject();
    let originalPos = sceneObject.getTransform().getLocalPosition();
    
    // Set starting position
    sceneObject.getTransform().setLocalPosition(new vec3(originalPos.x, originalPos.y - startY, originalPos.z));
    
    // Set starting opacity
    textComp.textFill.color = new vec4(textComp.textFill.color.r, textComp.textFill.color.g, textComp.textFill.color.b, 0);
    
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1.0);
        
        // Ease in-out function
        progress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Update position
        let currentY = originalPos.y - startY + (startY * progress);
        sceneObject.getTransform().setLocalPosition(new vec3(originalPos.x, currentY, originalPos.z));
        
        // Update opacity
        let color = textComp.textFill.color;
        textComp.textFill.color = new vec4(color.r, color.g, color.b, progress);
        
        if (progress >= 1.0) {
            updateEvent.enabled = false;
        }
    });
}

// Add new function for text fade out
function fadeTextOut(textComp, fadeTime) {
    if (!textComp) return;
    
    let startTime = getTime();
    var updateEvent = script.createEvent("UpdateEvent");
    
    updateEvent.bind(function() {
        let elapsed = getTime() - startTime;
        let progress = Math.min(elapsed / fadeTime, 1.0);
        
        // Ease out function for smoother fade
        progress = 1 - Math.pow(1 - progress, 2);
        
        // Update opacity
        let color = textComp.textFill.color;
        textComp.textFill.color = new vec4(color.r, color.g, color.b, 1 - progress);
        
        if (progress >= 1.0) {
            textComp.enabled = false;
            updateEvent.enabled = false;
        }
    });
}