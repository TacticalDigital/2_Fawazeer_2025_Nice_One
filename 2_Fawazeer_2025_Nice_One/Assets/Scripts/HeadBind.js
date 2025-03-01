// @input Component.Head headBind
// @input SceneObject target
// @input SceneObject body
var onUpdate = script.createEvent("UpdateEvent");
onUpdate.bind(function(){
    var sourceRotation = script.headBind.getTransform().getLocalRotation();
    var sourcePosition = script.headBind.getTransform().getWorldPosition();
    var animRotation = script.target.getTransform().getLocalRotation();
    var newRotation = new quat (sourceRotation.w, sourceRotation.y, sourceRotation.z*-1, sourceRotation.x*-1)
    script.target.getTransform().setLocalRotation(newRotation);
    script.body.getTransform().setWorldPosition(sourcePosition);
//    print(sourceRotation);
//    print(animRotation);
//
})