var randomX = -70 + Math.random() * 2 * 70;
// Generating a random scale for each axis between 0.5 and 2.0, for example
var randomScaleFactor = 1 + Math.random() * 2.2;
var randomScale = new vec3(randomScaleFactor, randomScaleFactor, randomScaleFactor);

// Set the initial position
script.getTransform().setLocalPosition(new vec3(randomX, 170, -155));
// Set the random scale
script.getTransform().setLocalScale(randomScale);

// Start the drop animation with a tween and destroy the object at the end
global.tweenManager.startTween(script.getSceneObject(), "Drop", function() {
    script.getSceneObject().destroy();
});
