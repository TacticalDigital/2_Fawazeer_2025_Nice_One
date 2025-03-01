// Script.js
// Version: 1.0.0
// Event: On Awake
// Description: Bind Position and Rotation of objects

// @input SceneObject sourceObject  {"label":"Target"}
// @input bool bindPosition
// @input bool bindRotation
// @input bool bindScale


if (!script.sourceObject) {
    print("ERROR: Source object to copy transform from is not set");
    return;
}

var bindPosition = script.bindPosition;
var bindRotation = script.bindRotation;
var bindScale = script.bindScale;

var sceneObject = script.getSceneObject();
sceneObject.transform = sceneObject.getTransform();

var sourceObject = script.sourceObject;
sourceObject.transform = sourceObject.getTransform();

var shiftPosition = sceneObject.transform.getWorldPosition();
var shiftRotation = sceneObject.transform.getWorldRotation();
var shiftScale = sceneObject.transform.getWorldScale();

script.createEvent("UpdateEvent").bind(onUpdate);

function onUpdate() {
    if (bindPosition) {
        var position = sourceObject.transform.getWorldPosition();
        sceneObject.transform.setWorldPosition(position.add(shiftPosition));  
    }
    if (script.bindRotation) {
        var rotation = sourceObject.transform.getWorldRotation();
        sceneObject.transform.setWorldRotation(rotation.multiply(shiftRotation))
    }
    if (script.bindScale) {
        var scale = sceneObject.transform.getWorldScale();
        sourceObject.transform.setWorldScale(scale.add(shiftScale));
    }
    
   
}

